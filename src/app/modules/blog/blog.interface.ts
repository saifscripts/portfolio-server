import mongoose from 'mongoose';

export interface IBlog {
    _id: mongoose.Types.ObjectId;
    title: string;
    summary: string;
    content: string;
    featuredImage: string;
    tags: string[];
    isDeleted: boolean;
}
