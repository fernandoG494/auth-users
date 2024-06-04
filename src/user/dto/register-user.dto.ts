import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for registering a new user.
 */
export class RegisterUser {
  /**
   * The email address of the user.
   * This field must be a valid email format.
   */
  @IsEmail()
  email: string;

  /**
   * The name of the user.
   * This field must be a string.
   */
  @IsString()
  name: string;

  /**
   * The password of the user.
   * This field must be at least 6 characters long.
   */
  @MinLength(6)
  password: string;
}
