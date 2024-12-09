import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IProfile } from './profile.interface';
import { Profile } from './profile.model';

const getProfile = async () => {
    const profile = await Profile.findOne();

    if (!profile) {
        throw new AppError(httpStatus.NOT_FOUND, 'Profile info not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Profile info retrieved successfully',
        data: profile,
    };
};

const updateProfile = async (payload: Partial<IProfile>) => {
    const updatedProfile = await Profile.findOneAndUpdate({}, payload, {
        new: true,
        upsert: true,
    });

    if (!updatedProfile) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to update profile!',
        );
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Profile info updated successfully',
        data: updatedProfile,
    };
};

export const ProfileServices = {
    getProfile,
    updateProfile,
};
