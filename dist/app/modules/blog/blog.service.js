"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogServices = void 0;
/* eslint-disable no-undef */
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const blog_constant_1 = require("./blog.constant");
const blog_model_1 = require("./blog.model");
const createBlogIntoDB = (payload, featuredImage) => __awaiter(void 0, void 0, void 0, function* () {
    payload.featuredImage = featuredImage === null || featuredImage === void 0 ? void 0 : featuredImage.path;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // create post
        const newPost = yield blog_model_1.Post.create([payload], {
            session,
        });
        if (!newPost.length) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create post!');
        }
        // commit transaction and end session
        yield session.commitTransaction();
        yield session.endSession();
        return {
            statusCode: http_status_1.default.CREATED,
            message: 'Post created successfully',
            data: newPost[0],
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getBlogsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { feed } = query, params = __rest(query, ["feed"]);
    const postQuery = new QueryBuilder_1.default(blog_model_1.Post.find().populate('author'), params)
        .search(blog_constant_1.BlogSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const posts = yield postQuery.modelQuery;
    return {
        statusCode: http_status_1.default.OK,
        message: 'Posts retrieved successfully',
        data: posts,
    };
});
const getTagsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(query.limit) || 10;
    const tags = yield blog_model_1.Post.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
    ]);
    return {
        statusCode: http_status_1.default.OK,
        message: 'Tags retrieved successfully',
        data: tags,
    };
});
const getBlogFromDB = (blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Post.findOne({
        _id: blogId,
        isPublished: true,
    }).populate('author');
    if (!blog) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Blog retrieved successfully',
        data: blog,
    };
});
const updateBlogIntoDB = (blogId, payload, featuredImage) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Post.findById(blogId);
    if (!blog) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    if (!(featuredImage === null || featuredImage === void 0 ? void 0 : featuredImage.path) && (payload === null || payload === void 0 ? void 0 : payload.featuredImage) === undefined) {
        // no image to update (this will preserve old image)
        payload.featuredImage = undefined;
    }
    else {
        // received new image (this will replace old image)
        payload.featuredImage = payload.featuredImage || (featuredImage === null || featuredImage === void 0 ? void 0 : featuredImage.path);
    }
    const updatedBlog = yield blog_model_1.Post.findOneAndUpdate({ _id: blogId }, payload, {
        new: true,
    });
    if (!updatedBlog) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Blog updated successfully!',
        data: updatedBlog,
    };
});
const deleteBlogFromDB = (blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Post.findById(blogId);
    if (!blog) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found!');
    }
    const deletedBlog = yield blog_model_1.Post.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true });
    if (!deletedBlog) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Blog deleted successfully!',
        data: deletedBlog,
    };
});
exports.BlogServices = {
    createBlogIntoDB,
    getBlogsFromDB,
    getTagsFromDB,
    getBlogFromDB,
    updateBlogIntoDB,
    deleteBlogFromDB,
};
