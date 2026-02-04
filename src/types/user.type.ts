export interface User {
  name: string;
  email: string;
  password: string;

  refreshToken?: string;

  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
