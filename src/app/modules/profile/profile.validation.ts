import { z } from 'zod';

const NameSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
});

const UpdateProfileSchema = z.object({
    body: z.object({
        name: NameSchema,
        designation: z.string().min(1, 'Designation is required'),
        photo: z.string().url('Photo must be a valid URL'),
        description: z
            .string()
            .max(200, 'Description must be at most 200 characters')
            .min(1, 'Description is required'),
        about: z.string().min(1, 'About information is required'),
        phone: z
            .string()
            .regex(/^(?:\+880|0)1[3-9]\d{8}$/, 'Invalid phone number')
            .min(1, 'Phone number is required'),
        email: z
            .string()
            .email('Invalid email format')
            .min(1, 'Email is required'),
        address: z.string().min(1, 'Address is required'),
        resume: z.string().url('Resume must be a valid URL'),
        github: z.string().url('GitHub must be a valid URL'),
        linkedin: z.string().url('LinkedIn must be a valid URL'),
        x: z.string().url('X profile must be a valid URL'),
    }),
});

export const ProfileValidations = {
    UpdateProfileSchema,
};
