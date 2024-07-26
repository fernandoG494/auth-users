import { User } from '../entities/user.entity';

export interface LoginResponse {
  token: string;
  user: User;
  status: string;
}

export interface JwtVerificationResponse {
  status: number;
  error?: string;
  message: string;
}
