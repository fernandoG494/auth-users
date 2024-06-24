import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

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

  /**
   * The company the user belongs to.
   * This field is optional.
   */
  @ApiProperty({
    description: 'The company the user belongs to',
    required: false,
  })
  @IsOptional()
  @IsString()
  company?: string;

  /**
   * The profile image of the user.
   * This field is optional.
   */
  @ApiProperty({
    description: 'The profile image of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  /**
   * The user's position.
   * This value is optional
   * Default value is an empty string.
   */
  @ApiProperty({
    description: "The user's position",
    required: false,
  })
  @IsOptional()
  @IsString()
  position?: string;
}
