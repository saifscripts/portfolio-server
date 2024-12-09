"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginValidationSchema), auth_controller_1.AuthControllers.login);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshToken);
router.put('/change-password', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(auth_validation_1.AuthValidations.changePasswordValidationSchema), auth_controller_1.AuthControllers.changePassword);
router.post('/forget-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.forgetPasswordValidationSchema), auth_controller_1.AuthControllers.forgetPassword);
router.put('/reset-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.resetPasswordValidationSchema), auth_controller_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
