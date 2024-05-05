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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post() // create user
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login') // login user
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post('/register') // register user
  register(@Body() registerDto: RegisterUser) {
    return this.userService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get() // find all users
  findAll(@Request() req: Request) {
    const user = req['user'];
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('check-token') // check token
  checkToken(@Request() req: Request): LoginResponse {
    const user = req['user'] as User;
    return {
      user,
      token: this.userService.getJWT({ id: user._id }),
    };
  }

  @Get(':id') // find one user
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id') // update the user
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id') // delete the user
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
