import { Document, Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export interface IUser extends Document {
  email: string;
  role: USER_ROLES;
  password?: string; // Hashed
  verified: boolean;
  status: string;
  authProvider?: string;
  socialId?: string; // For social auth (Google/Apple)
  isResetPassword?: boolean;
  oneTimeCode?: number;
  OTPExpireAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserModel = {
     isExistUserById(id: string): any;
     isExistUserByEmail(email: string): any;
     isExistUserByPhone(phoneNumber: string): any;
     isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
