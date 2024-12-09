import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProfileControllers } from './profile.controller';
import { ProfileValidations } from './profile.validation';

const router = express.Router();

router.route('/').get(ProfileControllers.getProfile).put(
    // auth(USER_ROLE.ADMIN),
    validateRequest(ProfileValidations.UpdateProfileSchema),
    ProfileControllers.updateProfile,
);

export const ProfileRoutes = router;
