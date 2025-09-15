export interface LoginResponse {
  success: boolean;
  message: string;
  userId?: number;
  email?: string;
  fullName?: string;
  isActive?: boolean;
  emailVerified?: boolean;
}