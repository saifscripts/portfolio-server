import mongoose, { Model } from 'mongoose';
import { UserRoles } from './user.constant';

export type IUserRole = (typeof UserRoles)[number];

export interface IUser {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone: string;
    avatarURL?: string;
    role: IUserRole;
    isDeleted: boolean;
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IContactUsOptions {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export interface UserModel extends Model<IUser> {
    comparePassword(plain: string, hashed: string): Promise<boolean>;
}
