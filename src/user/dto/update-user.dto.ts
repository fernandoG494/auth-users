import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating a user.
 * Inherits from CreateUserDto with all properties optional.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
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
  password?: string;
}
