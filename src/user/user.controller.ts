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
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { CreateUserDto, LoginDto, RegisterUser, UpdateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates a new user.
   * @param createUserDto - Data transfer object for creating a user.
   * @returns The created user without the password field.
   */
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.create(createUserDto);
  }

  /**
   * Logs in a user.
   * @param loginDto - Data transfer object for user login.
   * @returns The logged-in user and a JWT token.
   */
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.userService.login(loginDto);
  }

  /**
   * Registers a new user.
   * @param registerDto - Data transfer object for user registration.
   * @returns The registered user and a JWT token.
   */
  @Post('/register')
  async register(@Body() registerDto: RegisterUser): Promise<LoginResponse> {
    return this.userService.register(registerDto);
  }

  /**
   * Retrieves all users.
   * This route is protected and requires a valid JWT token.
   * @returns An array of all users.
   */
  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * Checks the validity of the JWT token.
   * This route is protected and requires a valid JWT token.
   * @param req - The request object containing the user data.
   * @returns The user and a new JWT token.
   */
  @UseGuards(AuthGuard)
  @Get('check-token')
  checkToken(@Request() req: Request): LoginResponse {
    const user = req['auser'] as User;
    return {
      user,
      token: this.userService.getJWT({ id: user._id }),
    };
  }

  /**
   * Retrieves a user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user without the password field.
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.userService.findUserById(id);
  }

  /**
   * Updates a user by ID.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data transfer object for updating a user.
   * @returns A message indicating that the user was updated.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<string> {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Deletes a user by ID.
   * This route is protected and requires a valid JWT token.
   * @param id - The ID of the user to delete.
   * @returns A message indicating that the user was deleted.
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return this.userService.remove(id);
  }
}
