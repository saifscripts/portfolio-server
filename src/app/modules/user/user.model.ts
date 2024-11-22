import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { UserRoles } from './user.constant';
import { IUser, UserModel } from './user.interface';

const UserSchema = new Schema<IUser, UserModel>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        phone: { type: String, required: true },
        avatarURL: { type: String, required: false },
        role: {
            type: String,
            required: true,
            enum: UserRoles,
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

UserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(
        this.password as string,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});

UserSchema.post('save', function (doc, next) {
    doc.password = undefined;
    next();
});

UserSchema.statics.comparePassword = async function (
    plain: string,
    hashed: string,
) {
    return await bcrypt.compare(plain, hashed);
};

// Query Middlewares
UserSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

UserSchema.pre('findOne', function (next) {
    if (this.getOptions().getDeletedDocs) {
        return next();
    }

    this.find({ isDeleted: { $ne: true } });
    next();
});

UserSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
