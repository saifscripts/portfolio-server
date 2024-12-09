"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const blog_route_1 = require("../modules/blog/blog.route");
const profile_route_1 = require("../modules/profile/profile.route");
const project_route_1 = require("../modules/projects/project.route");
const user_route_1 = require("../modules/user/user.route");
const router = express_1.default.Router();
const routes = [
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/users', route: user_route_1.UserRoutes },
    { path: '/blogs', route: blog_route_1.BlogRoutes },
    { path: '/projects', route: project_route_1.ProjectRoutes },
    { path: '/profile', route: profile_route_1.ProfileRoutes },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
