import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for registering a new user.
 */
export class RegisterUser {
  /**
   * The email address of the user.
   * This field must be a valid email format.
   */
  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  email: string;

  /**
   * The name of the user.
   * This field must be a string.
   */
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  name: string;

  /**
   * The last name of the user.
   * This field must be a string.
   */
  @ApiProperty({ description: 'The last name of the user' })
  @IsString()
  lastName: string;

  /**
   * The password of the user.
   * This field must be at least 6 characters long.
   */
  @ApiProperty({ description: 'The password of the user', minLength: 6 })
  @MinLength(6)
  password: string;
}
