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
exports.ProjectServices = void 0;
/* eslint-disable no-undef */
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const project_constant_1 = require("./project.constant");
const project_model_1 = require("./project.model");
const createProject = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    payload.images = images.map((image) => image === null || image === void 0 ? void 0 : image.path);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // create project
        const newProject = yield project_model_1.Project.create([payload], {
            session,
        });
        if (!newProject.length) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create post!');
        }
        // commit transaction and end session
        yield session.commitTransaction();
        yield session.endSession();
        return {
            statusCode: http_status_1.default.CREATED,
            message: 'Project created successfully',
            data: newProject[0],
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getProjects = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const projectQuery = new QueryBuilder_1.default(project_model_1.Project.find(), query)
        .search(project_constant_1.ProjectSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const projects = yield projectQuery.modelQuery;
    return {
        statusCode: http_status_1.default.OK,
        message: 'Projects retrieved successfully',
        data: projects,
    };
});
const getProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.Project.findById(projectId);
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Project retrieved successfully',
        data: project,
    };
});
const updateProject = (projectId, payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.Project.findById(projectId);
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found!');
    }
    if ((images === null || images === void 0 ? void 0 : images.length) === 0 && (payload === null || payload === void 0 ? void 0 : payload.images) === undefined) {
        // no images to update (this will preserve old images)
        payload.images = undefined;
    }
    else {
        // Images should be received both uploaded files(images) and urls(payload.images)
        // On payload there should be some placeholders (same quantity as uploaded files)
        // The following code replace the placeholders with uploaded files (urls) serially.
        payload.images = [];
        let index = 0;
        payload === null || payload === void 0 ? void 0 : payload.images.forEach((image) => {
            var _a, _b, _c;
            if (image === 'placeholder') {
                (_a = payload.images) === null || _a === void 0 ? void 0 : _a.push((_b = images[index]) === null || _b === void 0 ? void 0 : _b.path);
                index++;
            }
            else {
                (_c = payload.images) === null || _c === void 0 ? void 0 : _c.push(image);
            }
        });
    }
    const updatedProject = yield project_model_1.Project.findOneAndUpdate({ _id: projectId }, payload, { new: true });
    if (!updatedProject) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Project updated successfully!',
        data: updatedProject,
    };
});
const deleteProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedProject = yield project_model_1.Project.findByIdAndUpdate(projectId, { isDeleted: true }, { new: true });
    if (!deletedProject) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Project deleted successfully!',
        data: deletedProject,
    };
});
exports.ProjectServices = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};
