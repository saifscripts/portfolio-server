"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    featuredImage: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Query Middlewares
PostSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
PostSchema.pre('findOne', function (next) {
    if (this.getOptions().getDeletedDocs) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});
PostSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.Post = (0, mongoose_1.model)('Post', PostSchema);
