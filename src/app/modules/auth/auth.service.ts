import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendMail } from '../../utils/sendMail';
import { ILoginCredentials } from '../user/user.interface';
import { User } from '../user/user.model';
import { IChangePassword } from './auth.interface';
import { createToken } from './auth.util';

const login = async (payload: ILoginCredentials) => {
    const user = await User.findOne({ email: payload?.email }).select(
        '+password',
    );

    // check if user exists
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // check if the user is deleted
    if (user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // check if the password matched
    const isPasswordMatched = await User.comparePassword(
        payload?.password,
        user?.password as string,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wrong user id or password');
    }

    const jwtPayload = {
        _id: user?._id,
        role: user?.role,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        avatarURL: user?.avatarURL,
    };

    // create access token
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret!,
        config.jwt_access_exp_in!,
    );

    // create refresh token
    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret!,
        config.jwt_refresh_exp_in!,
    );

    user.password = undefined; // remove password field

    return {
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        data: {
            accessToken,
            refreshToken,
        },
    };
};

const refreshToken = async (token: string) => {
    const decoded = jwt.verify(
        token,
        config.jwt_refresh_secret as string,
    ) as JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // check if the user is deleted
    if (user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const jwtPayload = {
        _id: user?._id,
        role: user?.role,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        avatarURL: user?.avatarURL,
    };

    // create access token
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret!,
        config.jwt_access_exp_in!,
    );

    return {
        statusCode: httpStatus.OK,
        message: 'Successfully retrieved refresh token!',
        token: accessToken,
        data: null,
    };
};

const changePassword = async (
    userId: mongoose.Types.ObjectId,
    payload: IChangePassword,
) => {
    const user = await User.findById(userId).select('+password');

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isPasswordMatched = await User.comparePassword(
        payload?.currentPassword,
        user?.password as string,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wrong password!');
    }

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findByIdAndUpdate(
        user._id,
        {
            password: hashedPassword,
        },
        {
            new: true,
        },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'Password changed successfully!',
        data: null,
    };
};

const forgetPassword = async (email: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user?.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User not found!');
    }

    const jwtPayload = {
        id: user._id,
        role: user.role,
    };

    // create reset token
    const resetToken = createToken(
        jwtPayload,
        config.jwt_reset_secret!,
        config.jwt_reset_exp_in!,
    );

    const resetUILink = `${config.client_base_url}/reset-password?token=${resetToken} `;

    const result = await sendMail({
        from: config.mail_auth_user!,
        to: email,
        subject: `Password Reset Link`,
        html: resetUILink,
    });

    if (!result.messageId) {
        throw new AppError(
            httpStatus.SERVICE_UNAVAILABLE,
            'Fail to send email!',
        );
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Reset link sent successfully. Check your mail.',
        data: null,
    };
};

const resetPassword = async (payload: { password: string; token: string }) => {
    const { password, token } = payload;

    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }

    const decodedUser = jwt.verify(
        token,
        config.jwt_reset_secret!,
    ) as JwtPayload;

    const user = await User.findById(decodedUser.id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user?.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds),
    );

    const updatedUser = await User.findByIdAndUpdate(
        decodedUser.id,
        {
            password: hashedPassword,
        },
        { new: true },
    );

    if (!updatedUser) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to reset password!',
        );
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Password reset successfully!',
        data: updatedUser,
    };
};

export const AuthServices = {
    login,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
