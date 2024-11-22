import { RequestHandler } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject): RequestHandler => {
    return catchAsync(async (req, _res, next) => {
        const parsed = await schema.parseAsync({
            body: req.body.body ? JSON.parse(req.body.body) : req.body,
            cookies: req.cookies,
        });

        req.body = parsed.body; // set request body from the parsed data
        req.cookies = parsed.cookies; // set request cookies from the parsed data
        next();
    });
};

export default validateRequest;
