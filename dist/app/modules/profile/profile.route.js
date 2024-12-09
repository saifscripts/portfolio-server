"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const profile_controller_1 = require("./profile.controller");
const profile_validation_1 = require("./profile.validation");
const router = express_1.default.Router();
router.route('/').get(profile_controller_1.ProfileControllers.getProfile).put(
// auth(USER_ROLE.ADMIN),
(0, validateRequest_1.default)(profile_validation_1.ProfileValidations.UpdateProfileSchema), profile_controller_1.ProfileControllers.updateProfile);
exports.ProfileRoutes = router;
