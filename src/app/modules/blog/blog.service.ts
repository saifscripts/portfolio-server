/* eslint-disable no-undef */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { BlogSearchableFields } from './blog.constant';
import { IBlog } from './blog.interface';
import { Post } from './blog.model';

const createBlogIntoDB = async (
    payload: IBlog,
    featuredImage: Express.Multer.File,
) => {
    payload.featuredImage = featuredImage?.path;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // create post
        const newPost = await Post.create([payload], {
            session,
        });

        if (!newPost.length) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to create post!',
            );
        }

        // commit transaction and end session
        await session.commitTransaction();
        await session.endSession();

        return {
            statusCode: httpStatus.CREATED,
            message: 'Post created successfully',
            data: newPost[0],
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const getBlogsFromDB = async (query: Record<string, unknown>) => {
    const { feed, ...params } = query;

    const postQuery = new QueryBuilder(Post.find().populate('author'), params)
        .search(BlogSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const posts: Partial<IBlog>[] = await postQuery.modelQuery;

    return {
        statusCode: httpStatus.OK,
        message: 'Posts retrieved successfully',
        data: posts,
    };
};

const getTagsFromDB = async (query: Record<string, unknown>) => {
    const limit = parseInt(query.limit as string) || 10;

    const tags = await Post.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
    ]);

    return {
        statusCode: httpStatus.OK,
        message: 'Tags retrieved successfully',
        data: tags,
    };
};

const getBlogFromDB = async (blogId: string) => {
    const blog = await Post.findOne({
        _id: blogId,
        isPublished: true,
    }).populate('author');

    if (!blog) {
        throw new AppError(httpStatus.NOT_FOUND, 'Blog not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Blog retrieved successfully',
        data: blog,
    };
};

const updateBlogIntoDB = async (
    blogId: string,
    payload: Partial<IBlog>,
    featuredImage: Express.Multer.File,
) => {
    const blog = await Post.findById(blogId);

    if (!blog) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (!featuredImage?.path && payload?.featuredImage === undefined) {
        // no image to update (this will preserve old image)
        payload.featuredImage = undefined;
    } else {
        // received new image (this will replace old image)
        payload.featuredImage = payload.featuredImage || featuredImage?.path;
    }

    const updatedBlog = await Post.findOneAndUpdate({ _id: blogId }, payload, {
        new: true,
    });

    if (!updatedBlog) {
        throw new AppError(httpStatus.NOT_FOUND, 'Blog not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Blog updated successfully!',
        data: updatedBlog,
    };
};

const deleteBlogFromDB = async (blogId: string) => {
    const blog = await Post.findById(blogId);

    if (!blog) {
        throw new AppError(httpStatus.NOT_FOUND, 'Blog not found!');
    }

    const deletedBlog = await Post.findOneAndUpdate(
        { _id: blogId },
        { isDeleted: true },
        { new: true },
    );

    if (!deletedBlog) {
        throw new AppError(httpStatus.NOT_FOUND, 'Blog not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Blog deleted successfully!',
        data: deletedBlog,
    };
};

export const BlogServices = {
    createBlogIntoDB,
    getBlogsFromDB,
    getTagsFromDB,
    getBlogFromDB,
    updateBlogIntoDB,
    deleteBlogFromDB,
};
