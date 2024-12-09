import isURL from 'validator/lib/isURL';
import { z } from 'zod';

const RepoSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    url: z.string().url('Invalid URL format'),
});

const CreateProjectSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Project name is required'),
        description: z.string().min(1, 'Description is required'),
        summary: z.string().min(1, 'Summary is required'),
        content: z.string().min(1, 'Content is required'),
        images: z
            .array(z.string().url('Invalid image URL'))
            .nonempty('At least one image is required'),
        live: z.string().url('Invalid live URL'),
        repos: z
            .array(RepoSchema)
            .nonempty('At least one repository is required'),
        techs: z
            .array(z.string().min(1, 'Tech name is required'))
            .nonempty('At least one tech is required'),
    }),
});

const UpdateProjectSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Project name is required').optional(),
        description: z.string().min(1, 'Description is required').optional(),
        summary: z.string().min(1, 'Summary is required').optional(),
        content: z.string().min(1, 'Content is required').optional(),
        images: z
            .array(z.string().refine((value) => isURL(value) || 'placeholder'))
            .optional(),
        live: z.string().url('Invalid live URL').optional(),
        repos: z.array(RepoSchema).optional(),
        techs: z.array(z.string().min(1, 'Tech name is required')).optional(),
    }),
});

export const ProjectValidations = { CreateProjectSchema, UpdateProjectSchema };
