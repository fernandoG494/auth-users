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

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      const { password, ...user } = newUser.toJSON();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.name} already exists`);
      }
      throw new InternalServerErrorException('An error occurred on our side');
    }
  }

  async register(registerDto: RegisterUser): Promise<LoginResponse> {
    const user = await this.create(registerDto);
    return { user, token: this.getJWT({ id: user._id }) };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...logged } = user.toJSON();
    return { user: logged, token: this.getJWT({ id: user._id }) };
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    const { password, ...rest } = user.toJSON();
    return rest;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return `User ${user.name} updated`;
  }

  async remove(id: string): Promise<string> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
    return `User ${result.name} removed`;
  }

  public getJWT(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
