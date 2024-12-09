import express from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router
    .route('/me')
    .get(auth(USER_ROLE.ADMIN), UserControllers.getMe)
    .put(
        auth(USER_ROLE.ADMIN),
        validateRequest(UserValidations.updateUserValidationSchema),
        UserControllers.updateProfile,
    );

router
    .route('/avatar')
    .post(
        auth(USER_ROLE.ADMIN),
        upload.single('avatar'),
        UserControllers.updateAvatar,
    );

router
    .route('/contact-us')
    .post(
        validateRequest(UserValidations.contactUsValidationSchema),
        UserControllers.contactUs,
    );

router.route('/:id').get(UserControllers.getUser);

export const UserRoutes = router;
