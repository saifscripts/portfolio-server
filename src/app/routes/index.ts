import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { ProjectRoutes } from '../modules/projects/project.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const routes = [
    { path: '/auth', route: AuthRoutes },
    { path: '/users', route: UserRoutes },
    { path: '/blogs', route: BlogRoutes },
    { path: '/projects', route: ProjectRoutes },
    { path: '/profile', route: ProfileRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
