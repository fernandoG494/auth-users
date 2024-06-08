import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './entities/user.entity';
import { JwtPayload, LoginResponse } from './interfaces';
import { CreateUserDto, LoginDto, RegisterUser, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Creates a new user.
   * @param createUserDto - Data transfer object for creating a user.
   * @returns The created user without the password field.
   * @throws BadRequestException if the user already exists.
   * @throws InternalServerErrorException if an error occurs during user creation.
   */
  async create(createUserDto: CreateUserDto): Promise<any> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      const { password, ...user } = newUser.toJSON();
      return {
        status: 'success',
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.name} already exists`);
      }
      throw new InternalServerErrorException('An error occurred on our side');
    }
  }

  /**
   * Registers a new user and returns a login response.
   * @param registerDto - Data transfer object for user registration.
   * @returns The registered user and a JWT token.
   */
  async register(registerDto: RegisterUser): Promise<LoginResponse> {
    const user = await this.create(registerDto);
    return { user, token: this.getJWT({ id: user._id }) };
  }

  /**
   * Logs in a user and returns a login response.
   * @param loginDto - Data transfer object for user login.
   * @returns The logged-in user and a JWT token.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...logged } = user.toJSON();
    return { user: logged, token: this.getJWT({ id: user._id }) };
  }

  /**
   * Retrieves all users.
   * @returns An array of all users.
   */
  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Retrieves a user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user without the password field.
   * @throws NotFoundException if the user is not found.
   */
  async findUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    const { password, ...rest } = user.toJSON();
    return rest;
  }

  /**
   * Updates a user by ID.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data transfer object for updating a user.
   * @returns A message indicating that the user was updated.
   * @throws NotFoundException if the user is not found.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return `User ${user.name} updated`;
  }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to delete.
   * @returns A message indicating that the user was removed.
   * @throws NotFoundException if the user is not found.
   */
  async remove(id: string): Promise<string> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
    return `User ${result.name} removed`;
  }

  /**
   * Generates a JWT token.
   * @param payload - The JWT payload.
   * @returns The generated JWT token.
   */
  public getJWT(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<LoginResponse> {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);
      const user = await this.userModel.findById(decoded.id).exec();
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      const { password, ...userData } = user.toJSON();
      return { user: userData, token };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
