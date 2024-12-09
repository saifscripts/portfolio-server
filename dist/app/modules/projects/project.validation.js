"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidations = void 0;
const isURL_1 = __importDefault(require("validator/lib/isURL"));
const zod_1 = require("zod");
const RepoSchema = zod_1.z.object({
    label: zod_1.z.string().min(1, 'Label is required'),
    url: zod_1.z.string().url('Invalid URL format'),
});
const CreateProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Project name is required'),
        description: zod_1.z.string().min(1, 'Description is required'),
        summary: zod_1.z.string().min(1, 'Summary is required'),
        content: zod_1.z.string().min(1, 'Content is required'),
        images: zod_1.z
            .array(zod_1.z.string().url('Invalid image URL'))
            .nonempty('At least one image is required'),
        live: zod_1.z.string().url('Invalid live URL'),
        repos: zod_1.z
            .array(RepoSchema)
            .nonempty('At least one repository is required'),
        techs: zod_1.z
            .array(zod_1.z.string().min(1, 'Tech name is required'))
            .nonempty('At least one tech is required'),
    }),
});
const UpdateProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Project name is required').optional(),
        description: zod_1.z.string().min(1, 'Description is required').optional(),
        summary: zod_1.z.string().min(1, 'Summary is required').optional(),
        content: zod_1.z.string().min(1, 'Content is required').optional(),
        images: zod_1.z
            .array(zod_1.z.string().refine((value) => (0, isURL_1.default)(value) || 'placeholder'))
            .optional(),
        live: zod_1.z.string().url('Invalid live URL').optional(),
        repos: zod_1.z.array(RepoSchema).optional(),
        techs: zod_1.z.array(zod_1.z.string().min(1, 'Tech name is required')).optional(),
    }),
});
exports.ProjectValidations = { CreateProjectSchema, UpdateProjectSchema };
