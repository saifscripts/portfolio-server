/* eslint-disable no-undef */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { ProjectSearchableFields } from './project.constant';
import { IProject } from './project.interface';
import { Project } from './project.model';

const createProject = async (
    payload: IProject,
    images: Express.Multer.File[],
) => {
    payload.images = images.map((image) => image?.path);

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // create project
        const newProject = await Project.create([payload], {
            session,
        });

        if (!newProject.length) {
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
            message: 'Project created successfully',
            data: newProject[0],
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const getProjects = async (query: Record<string, unknown>) => {
    const projectQuery = new QueryBuilder(Project.find(), query)
        .search(ProjectSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const projects: Partial<IProject>[] = await projectQuery.modelQuery;

    return {
        statusCode: httpStatus.OK,
        message: 'Projects retrieved successfully',
        data: projects,
    };
};

const getProject = async (projectId: string) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, 'Project not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Project retrieved successfully',
        data: project,
    };
};

const updateProject = async (
    projectId: string,
    payload: Partial<IProject>,
    images: Express.Multer.File[],
) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, 'Project not found!');
    }

    if (images?.length === 0 && payload?.images === undefined) {
        // no images to update (this will preserve old images)
        payload.images = undefined;
    } else {
        // Images should be received both uploaded files(images) and urls(payload.images)
        // On payload there should be some placeholders (same quantity as uploaded files)
        // The following code replace the placeholders with uploaded files (urls) serially.
        payload.images = [];
        let index = 0;

        payload?.images.forEach((image) => {
            if (image === 'placeholder') {
                payload.images?.push(images[index]?.path);
                index++;
            } else {
                payload.images?.push(image);
            }
        });
    }

    const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId },
        payload,
        { new: true },
    );

    if (!updatedProject) {
        throw new AppError(httpStatus.NOT_FOUND, 'Project not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Project updated successfully!',
        data: updatedProject,
    };
};

const deleteProject = async (projectId: string) => {
    const deletedProject = await Project.findByIdAndUpdate(
        projectId,
        { isDeleted: true },
        { new: true },
    );

    if (!deletedProject) {
        throw new AppError(httpStatus.NOT_FOUND, 'Project not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Project deleted successfully!',
        data: deletedProject,
    };
};

export const ProjectServices = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};
