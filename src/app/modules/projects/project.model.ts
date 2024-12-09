import { Schema, model } from 'mongoose';
import { IProject } from './project.interface';

const ProjectSchema = new Schema<IProject>(
    {
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
    },
    {
        timestamps: true,
    },
);

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

export const Project = model<IProject>('Project', ProjectSchema);
