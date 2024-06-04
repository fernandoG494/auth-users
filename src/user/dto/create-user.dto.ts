import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for creating a new user.
 */
export class CreateUserDto {
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
   * The password of the user.
   * This field must be at least 6 characters long.
   */
  @ApiProperty({ description: 'The password of the user', minLength: 6 })
  @MinLength(6)
  password: string;
}
