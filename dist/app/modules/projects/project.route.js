"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const project_controller_1 = require("./project.controller");
const project_validation_1 = require("./project.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(project_controller_1.ProjectControllers.getProjects)
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), upload_1.upload.array('images'), (0, validateRequest_1.default)(project_validation_1.ProjectValidations.CreateProjectSchema), project_controller_1.ProjectControllers.createProject);
router
    .route('/:id')
    .get(project_controller_1.ProjectControllers.getProject)
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), upload_1.upload.array('images'), (0, validateRequest_1.default)(project_validation_1.ProjectValidations.UpdateProjectSchema), project_controller_1.ProjectControllers.updateProject)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), project_controller_1.ProjectControllers.deleteProject);
exports.ProjectRoutes = router;
