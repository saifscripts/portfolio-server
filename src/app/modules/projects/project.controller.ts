/* eslint-disable no-undef */
import catchAsync from '../../utils/catchAsync';

import sendResponse from '../../utils/sendResponse';
import { ProjectServices } from './project.service';

// POST: /api/projects
const createProject = catchAsync(async (req, res) => {
    const result = await ProjectServices.createProject(
        req.body,
        req.files as Express.Multer.File[],
    );
    sendResponse(res, result);
});

// GET: /api/projects/
const getProjects = catchAsync(async (req, res) => {
    const result = await ProjectServices.getProjects(req.query);
    sendResponse(res, result);
});

// GET: /api/projects/:id
const getProject = catchAsync(async (req, res) => {
    const result = await ProjectServices.getProject(req.params.id);
    sendResponse(res, result);
});

// PUT: /api/projects/:id
const updateProject = catchAsync(async (req, res) => {
    const result = await ProjectServices.updateProject(
        req.params.id,
        req.body,
        req.files as Express.Multer.File[],
    );
    sendResponse(res, result);
});

// DELETE: /api/projects/:id
const deleteProject = catchAsync(async (req, res) => {
    const result = await ProjectServices.deleteProject(req.params.id);
    sendResponse(res, result);
});

export const ProjectControllers = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};
