"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const ProjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String, required: true }],
    live: { type: String, required: true },
    repos: [
        {
            label: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
    techs: [{ type: String, required: true }],
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Query Middlewares
ProjectSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
ProjectSchema.pre('findOne', function (next) {
    if (this.getOptions().getDeletedDocs) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});
ProjectSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.Project = (0, mongoose_1.model)('Project', ProjectSchema);
