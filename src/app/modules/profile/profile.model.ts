import { Schema, model } from 'mongoose';

import { IProfile } from './profile.interface';

const ProfileSchema = new Schema<IProfile>(
    {
        name: {
            firstName: { type: String, required: true },
            middleName: { type: String },
            lastName: { type: String, required: true },
        },
        designation: { type: String, required: true },
        photo: { type: String, required: true },
        description: { type: String, required: true },
        about: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        resume: { type: String, required: true },
        github: { type: String, required: true },
        linkedin: { type: String, required: true },
        x: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

export const Profile = model<IProfile>('Profile', ProfileSchema);
