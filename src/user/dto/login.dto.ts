import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for logging in a user.
 */
export class LoginDto {
  /**
   * The email address of the user.
   * This field must be a valid email format.
   */
  @IsEmail()
  email: string;

  /**
   * The password of the user.
   * This field must be a string and must be at least 6 characters long.
   */
  @IsString()
  @MinLength(6)
  password: string;
}
