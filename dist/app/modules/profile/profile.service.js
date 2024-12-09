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
exports.ProfileServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const profile_model_1 = require("./profile.model");
const getProfile = () => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield profile_model_1.Profile.findOne();
    if (!profile) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Profile info not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Profile info retrieved successfully',
        data: profile,
    };
});
const updateProfile = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProfile = yield profile_model_1.Profile.findOneAndUpdate({}, payload, {
        new: true,
        upsert: true,
    });
    if (!updatedProfile) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update profile!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Profile info updated successfully',
        data: updatedProfile,
    };
});
exports.ProfileServices = {
    getProfile,
    updateProfile,
};
