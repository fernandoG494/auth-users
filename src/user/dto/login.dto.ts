import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for logging in a user.
 */
export class LoginDto {
  /**
   * The email address of the user.
   * This field must be a valid email format.
   */
  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  email: string;

  /**
   * The password of the user.
   * This field must be a string and must be at least 6 characters long.
   */
  @ApiProperty({ description: 'The password of the user', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
