import { Schema, model } from 'mongoose';
import { IBlog } from './blog.interface';

const PostSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true },
        summary: { type: String, required: true },
        content: { type: String, required: true },
        tags: [{ type: String }],
        featuredImage: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

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

export const Post = model<IBlog>('Post', PostSchema);
