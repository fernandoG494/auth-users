import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUser } from './dto/register-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces/login-response';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post() // create user
  create(@Body() createUserDto: CreateUserDto) {
    console.log('POST /user/');
    return this.userService.create(createUserDto);
  }

  @Post('/login') // login user
  login(@Body() loginDto: LoginDto) {
    console.log('POST /user/login');
    return this.userService.login(loginDto);
  }

  @Post('/register') // register user
  register(@Body() registerDto: RegisterUser) {
    console.log('POST /user/register');
    return this.userService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get() // find all users
  findAll(@Request() req: Request) {
    console.log('GET /user/');
    const user = req['user'];
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('check-token') // check token
  checkToken(@Request() req: Request): LoginResponse {
    console.log('GET /user/check-token');
    const user = req['user'] as User;
    return {
      user,
      token: this.userService.getJWT({ id: user._id }),
    };
  }

  @Get(':id') // find one user
  findOne(@Param('id') id: number) {
    console.log(`GET /user/${id}`);
    return this.userService.findOne(id);
  }

  @Patch(':id') // update the user
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    console.log(`PATCH /user/${id}`);
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id') // delete the user
  remove(@Param('id') id: number) {
    console.log(`DELETE /user/${id}`);
    return this.userService.remove(id);
  }
}
