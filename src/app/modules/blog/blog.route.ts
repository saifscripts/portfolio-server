import express from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { BlogControllers } from './blog.controller';
import { BlogValidations } from './blog.validation';

const router = express.Router();

router
    .route('/')
    .get(BlogControllers.getBlogs)
    .post(
        auth(USER_ROLE.ADMIN),
        upload.single('featuredImage'),
        validateRequest(BlogValidations.createBlogValidationSchema),
        BlogControllers.createBlog,
    );

router.route('/tags').get(BlogControllers.getTags);

router
    .route('/:id')
    .get(BlogControllers.getBlog)
    .put(
        auth(USER_ROLE.ADMIN),
        upload.single('featuredImage'),
        validateRequest(BlogValidations.updateBlogValidationSchema),
        BlogControllers.updateBlog,
    )
    .delete(auth(USER_ROLE.ADMIN), BlogControllers.deleteBlog);

export const BlogRoutes = router;
