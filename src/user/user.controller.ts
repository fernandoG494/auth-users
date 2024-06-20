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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { OwnUser } from './guards/ownUser.guard';
import { CreateUserDto, LoginDto, RegisterUser, UpdateUserDto } from './dto';
import { JwtVerificationResponse, LoginResponse } from './interfaces/responses';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates a new user.
   * @param createUserDto - Data transfer object for creating a user.
   * @returns The created user without the password field.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    console.log('POST /user');
    return this.userService.create(createUserDto);
  }

  /**
   * Logs in a user.
   * @param loginDto - Data transfer object for user login.
   * @returns The logged-in user and a JWT token.
   */
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    console.log('POST /user/login');
    return this.userService.login(loginDto);
  }

  /**
   * Registers a new user.
   * @param registerDto - Data transfer object for user registration.
   * @returns The registered user and a JWT token.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async register(@Body() registerDto: RegisterUser): Promise<LoginResponse> {
    console.log('POST /user/register');
    return this.userService.register(registerDto);
  }

  /**
   * Checks the validity of the JWT token.
   * This route is protected and requires a valid JWT token.
   * @param req - The request object containing the user data.
   * @returns The user and a new JWT token.
   */
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('check-token')
  @ApiOperation({ summary: 'Check if token is valid' })
  @ApiResponse({ status: 200, description: 'Token is valid.' })
  checkToken(@Request() req: Request): JwtVerificationResponse {
    const user = req['auser'] as User;
    if (user.isActive) {
      return {
        status: 200,
        message: 'Token is valid',
        error: null,
      };
    }
    return {
      status: 401,
      message: 'Invalid or expired token',
      error: 'Unauthorized',
    };
  }

  /**
   * Retrieves all users.
   * This route is protected and requires a valid JWT token.
   * @returns An array of all users.
   */
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll(): Promise<User[]> {
    console.log('GET /user');
    return this.userService.findAll();
  }

  /**
   * Retrieves the authenticated user's information.
   * This route is protected and requires a valid JWT token.
   * @param req - The request object containing the user data.
   * @returns The authenticated user's information.
   */
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user information' })
  @ApiResponse({
    status: 200,
    description: 'Return authenticated user information.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMe(@Request() req: any): Promise<Omit<User, 'password'>> {
    const user = req['auser'] as User;
    return this.userService.findUserById(user._id);
  }

  /**
   * Retrieves a user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user without the password field.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return a user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    console.log('GET /user/:id');
    return this.userService.findUserById(id);
  }

  /**
   * Updates a user by ID.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data transfer object for updating a user.
   * @returns A message indicating that the user was updated.
   */
  @Patch(':id')
  @UseGuards(AuthGuard, OwnUser)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<string> {
    console.log('PATCH /user/:id');
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Deletes a user by ID.
   * This route is protected and requires a valid JWT token.
   * @param id - The ID of the user to delete.
   * @returns A message indicating that the user was deleted.
   */
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string): Promise<string> {
    console.log('DELETE /user/:id');
    return this.userService.remove(id);
  }
}
