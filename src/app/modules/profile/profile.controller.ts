import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProfileServices } from './profile.service';

// GET: /api/profile/
const getProfile = catchAsync(async (_req, res) => {
    const result = await ProfileServices.getProfile();
    sendResponse(res, result);
});

// PUT: /api/profile/
const updateProfile = catchAsync(async (req, res) => {
    const result = await ProfileServices.updateProfile(req.body);
    sendResponse(res, result);
});

export const ProfileControllers = {
    getProfile,
    updateProfile,
};
