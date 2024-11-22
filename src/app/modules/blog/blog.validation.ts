import { z } from 'zod';

const createBlogValidationSchema = z.object({
    body: z.object({
        title: z
            .string({ required_error: 'Title is required' })
            .min(1, { message: 'Title is required' })
            .max(200, { message: 'Title must not exceed 200 characters' }),
        summary: z
            .string({ required_error: 'Summary is required' })
            .min(50, {
                message: 'Post summary must be at least 50 characters long.',
            })
            .max(300, {
                message: 'Post summary cannot exceed 300 characters.',
            }),
        content: z
            .string({ required_error: 'Content is required' })
            .min(1, { message: 'Content is required' }),
        tags: z
            .array(z.string({ invalid_type_error: 'Tags must be string' }))
            .transform((tags) => tags.filter((tag) => Boolean(tag)))
            .optional(),
    }),
});

const updateBlogValidationSchema = z.object({
    body: z.object({
        title: z
            .string({ required_error: 'Title is required' })
            .min(1, { message: 'Title is required' })
            .max(200, { message: 'Title must not exceed 200 characters' })
            .optional(),
        summary: z
            .string({ required_error: 'Summary is required' })
            .min(50, {
                message: 'Post summary must be at least 50 characters long.',
            })
            .max(300, {
                message: 'Post summary cannot exceed 300 characters.',
            })
            .optional(),
        content: z
            .string({ required_error: 'Content is required' })
            .min(1, { message: 'Content is required' })
            .optional(),
        tags: z
            .array(z.string({ invalid_type_error: 'Tags must be string' }))
            .transform((tags) => tags.filter((tag) => Boolean(tag)))
            .optional(),
        featuredImage: z.string().url('Invalid image url').optional(),
    }),
});

export const BlogValidations = {
    createBlogValidationSchema,
    updateBlogValidationSchema,
};
