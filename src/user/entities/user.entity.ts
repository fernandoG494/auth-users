import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Represents a User entity in the application.
 */
@Schema()
export class User {
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
}

/**
 * Schema definition for the User entity.
 */
export const UserSchema = SchemaFactory.createForClass(User);
