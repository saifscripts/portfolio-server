import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

// POST: /api/auth/login
const login = catchAsync(async (req, res) => {
    const result = await AuthServices.login(req.body);
    sendResponse(res, result);
});

// POST: /api/auth/refresh-token
const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
    sendResponse(res, result);
});

// PUT: /api/auth/change-password
const changePassword = catchAsync(async (req, res) => {
    const result = await AuthServices.changePassword(req.user._id, req.body);
    sendResponse(res, result);
});

// POST: /api/auth/forget-password
const forgetPassword = catchAsync(async (req, res) => {
    const result = await AuthServices.forgetPassword(req.body.email);
    sendResponse(res, result);
});

// PUT: /api/auth/reset-password
const resetPassword = catchAsync(async (req, res) => {
    const result = await AuthServices.resetPassword(req.body);
    sendResponse(res, result);
});

export const AuthControllers = {
    login,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
