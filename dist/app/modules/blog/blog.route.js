"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const blog_controller_1 = require("./blog.controller");
const blog_validation_1 = require("./blog.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(blog_controller_1.BlogControllers.getBlogs)
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), upload_1.upload.single('featuredImage'), (0, validateRequest_1.default)(blog_validation_1.BlogValidations.createBlogValidationSchema), blog_controller_1.BlogControllers.createBlog);
router.route('/tags').get(blog_controller_1.BlogControllers.getTags);
router
    .route('/:id')
    .get(blog_controller_1.BlogControllers.getBlog)
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), upload_1.upload.single('featuredImage'), (0, validateRequest_1.default)(blog_validation_1.BlogValidations.updateBlogValidationSchema), blog_controller_1.BlogControllers.updateBlog)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), blog_controller_1.BlogControllers.deleteBlog);
exports.BlogRoutes = router;
