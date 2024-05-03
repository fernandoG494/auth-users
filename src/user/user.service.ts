import { LoginDto } from './dto/login.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUser } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcrypt.hashSync(password, 10),
        ...userData,
      });

      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.name} already exists`);
      }
      throw new InternalServerErrorException('Something happen in our side');
    }
  }

  async register(registerDto: RegisterUser): Promise<LoginResponse> {
    const user = await this.create(registerDto);
    return { user, token: this.getJWT({ id: user._id }) };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    console.log({ loginDto });
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid credentials');
    }

    const { password: _, ...logged } = user.toJSON();

    return {
      user: logged,
      token: this.getJWT({ id: user.id }),
    };
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getJWT(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
