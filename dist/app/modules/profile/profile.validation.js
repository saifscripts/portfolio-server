"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileValidations = void 0;
const zod_1 = require("zod");
const NameSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'First name is required'),
    middleName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
});
const UpdateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: NameSchema,
        designation: zod_1.z.string().min(1, 'Designation is required'),
        photo: zod_1.z.string().url('Photo must be a valid URL'),
        description: zod_1.z
            .string()
            .max(200, 'Description must be at most 200 characters')
            .min(1, 'Description is required'),
        about: zod_1.z.string().min(1, 'About information is required'),
        phone: zod_1.z
            .string()
            .regex(/^(?:\+880|0)1[3-9]\d{8}$/, 'Invalid phone number')
            .min(1, 'Phone number is required'),
        email: zod_1.z
            .string()
            .email('Invalid email format')
            .min(1, 'Email is required'),
        address: zod_1.z.string().min(1, 'Address is required'),
        resume: zod_1.z.string().url('Resume must be a valid URL'),
        github: zod_1.z.string().url('GitHub must be a valid URL'),
        linkedin: zod_1.z.string().url('LinkedIn must be a valid URL'),
        x: zod_1.z.string().url('X profile must be a valid URL'),
    }),
});
exports.ProfileValidations = {
    UpdateProfileSchema,
};
