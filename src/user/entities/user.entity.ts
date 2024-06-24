import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Represents a User entity in the application.
 */
@Schema({ timestamps: true }) // Esto habilita los campos de timestamps en el esquema
export class User extends Document {
  /**
   * The unique identifier of the user.
   */
  _id?: string;

  /**
   * The email address of the user.
   * This field must be unique and is required.
   */
  @Prop({ unique: true, required: true })
  email: string;

  /**
   * Indicates if the user is active.
   * Default value is true.
   */
  @Prop({ default: true })
  isActive: boolean;

  /**
   * The name of the user.
   * This field is required.
   */
  @Prop({ required: true })
  name: string;

  /**
   * The last name of the user.
   * This field is required.
   */
  @Prop({ required: true })
  lastName: string;

  /**
   * The password of the user.
   * This field is required and must be at least 6 characters long.
   */
  @Prop({ minlength: 6, required: true })
  password?: string;

  /**
   * The roles assigned to the user.
   * Default value is ['user'].
   */
  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  /**
   * The date the user was created.
   * Managed automatically by Mongoose.
   */
  createdAt?: Date;

  /**
   * The date the user was last modified.
   * Managed automatically by Mongoose.
   */
  updatedAt?: Date;

  /**
   * The company the user belongs to.
   * Default value is an empty string.
   */
  @Prop({ default: '' })
  company: string;

  /**
   * The profile image of the user.
   * Default value is an empty string.
   */
  @Prop({ default: '' })
  profileImage: string;

  /**
   * The user's position.
   * This value is optional
   * Default value is an empty string.
   */
  @Prop({ default: '' })
  position?: string;
}

/**
 * Schema definition for the User entity.
 */
export const UserSchema = SchemaFactory.createForClass(User);
