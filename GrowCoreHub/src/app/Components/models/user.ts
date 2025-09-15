export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}
