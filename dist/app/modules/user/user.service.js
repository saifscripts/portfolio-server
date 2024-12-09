"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const replaceText_1 = require("../../utils/replaceText");
const sendMail_1 = require("../../utils/sendMail");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const getUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id)
        .populate({
        path: 'posts',
        populate: {
            path: 'comments',
            populate: { path: 'author', select: 'name email avatarURL' },
        },
    })
        .populate('followers')
        .populate('following');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'User retrieved successfully',
        data: Object.assign(Object.assign({}, user.toObject()), { role: undefined, status: undefined, userType: undefined, updatedAt: undefined }),
    };
});
const getMeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id)
        .populate({
        path: 'posts',
        populate: {
            path: 'comments',
            populate: { path: 'author', select: 'name email avatarURL' },
        },
    })
        .populate('followers')
        .populate('following');
    return {
        statusCode: http_status_1.default.OK,
        message: 'User profile retrieved successfully',
        data: user,
    };
});
const updateProfileIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return {
        statusCode: http_status_1.default.OK,
        message: 'Profile updated successfully',
        data: updatedUser,
    };
});
const contactUsViaMail = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const emailBody = (0, replaceText_1.replaceText)(user_constant_1.CONTACT_FORM_MESSAGE, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
    });
    const result = yield (0, sendMail_1.sendMail)({
        from: payload.email,
        to: config_1.default.mail_auth_user,
        subject: `Contact Us Form Submission from ${payload.name}`,
        html: emailBody,
    });
    if (!result.messageId) {
        throw new AppError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Fail to send email!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Email sent successfully',
        data: null,
    };
});
const updateAvatar = (id, avatarURL) => __awaiter(void 0, void 0, void 0, function* () {
    if (!avatarURL) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Avatar is required');
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, { avatarURL }, {
        new: true,
    });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Avatar uploaded successfully',
        data: updatedUser,
    };
});
exports.UserServices = {
    getUserFromDB,
    getMeFromDB,
    updateProfileIntoDB,
    contactUsViaMail,
    updateAvatar,
};
