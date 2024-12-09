/* eslint-disable no-undef */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.service';

// Route: /api/v1/blogs/ (POST)
const createBlog = catchAsync(async (req, res) => {
    const result = await BlogServices.createBlogIntoDB(
        req.body,
        req.file as Express.Multer.File,
    );
    sendResponse(res, result);
});

// Route: /api/v1/blogs/ (GET)
const getBlogs = catchAsync(async (req, res) => {
    const result = await BlogServices.getBlogsFromDB(req.query);
    sendResponse(res, result);
});

// Route: /api/v1/blogs/tags (GET)
const getTags = catchAsync(async (req, res) => {
    const result = await BlogServices.getTagsFromDB(req.query);
    sendResponse(res, result);
});

// Route: /api/v1/blogs/:id (GET)
const getBlog = catchAsync(async (req, res) => {
    const result = await BlogServices.getBlogFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/blogs/:id (PUT)
const updateBlog = catchAsync(async (req, res) => {
    const result = await BlogServices.updateBlogIntoDB(
        req.params.id,
        req.body,
        req.file as Express.Multer.File,
    );
    sendResponse(res, result);
});

// Route: /api/v1/blogs/:id (DELETE)
const deleteBlog = catchAsync(async (req, res) => {
    const result = await BlogServices.deleteBlogFromDB(req.params.id);
    sendResponse(res, result);
});

export const BlogControllers = {
    createBlog,
    getBlogs,
    getTags,
    getBlog,
    updateBlog,
    deleteBlog,
};
