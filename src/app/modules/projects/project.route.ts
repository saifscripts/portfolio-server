import express from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { ProjectControllers } from './project.controller';
import { ProjectValidations } from './project.validation';

const router = express.Router();

router
    .route('/')
    .get(ProjectControllers.getProjects)
    .post(
        auth(USER_ROLE.ADMIN),
        upload.array('images'),
        validateRequest(ProjectValidations.CreateProjectSchema),
        ProjectControllers.createProject,
    );

router
    .route('/:id')
    .get(ProjectControllers.getProject)
    .put(
        auth(USER_ROLE.ADMIN),
        upload.array('images'),
        validateRequest(ProjectValidations.UpdateProjectSchema),
        ProjectControllers.updateProject,
    )
    .delete(auth(USER_ROLE.ADMIN), ProjectControllers.deleteProject);

export const ProjectRoutes = router;
