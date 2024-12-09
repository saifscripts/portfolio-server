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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogControllers = void 0;
/* eslint-disable no-undef */
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const blog_service_1 = require("./blog.service");
// Route: /api/v1/blogs/ (POST)
const createBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogServices.createBlogIntoDB(req.body, req.file);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/blogs/ (GET)
const getBlogs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogServices.getBlogsFromDB(req.query);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/blogs/tags (GET)
const getTags = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogServices.getTagsFromDB(req.query);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/blogs/:id (GET)
const getBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogServices.getBlogFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/blogs/:id (PUT)
const updateBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogServices.updateBlogIntoDB(req.params.id, req.body, req.file);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/blogs/:id (DELETE)
const deleteBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogServices.deleteBlogFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
exports.BlogControllers = {
    createBlog,
    getBlogs,
    getTags,
    getBlog,
    updateBlog,
    deleteBlog,
};
