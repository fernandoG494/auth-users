import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiPropertyOptional({ description: 'The email address of the user' })
  @IsEmail()
  email: string;

  /**
   * The name of the user.
   * This field must be a string.
   */
  @ApiPropertyOptional({ description: 'The name of the user' })
  @IsString()
  name: string;

  /**
   * The name of the user.
   * This field must be a string.
   */
  @ApiPropertyOptional({ description: 'The last name of the user' })
  @IsString()
  lastNameame: string;

  /**
   * The password of the user.
   * This field must be at least 6 characters long.
   */
  @ApiPropertyOptional({
    description: 'The password of the user',
    minLength: 6,
  })
  @MinLength(6)
  password?: string;
}
