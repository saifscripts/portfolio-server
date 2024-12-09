import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const verifyToken = catchAsync(async (req, _res, next) => {
    const token = req.headers?.authorization?.split?.(' ')?.[1];

    if (!token) {
        next();
        return;
    }

    // decode the token
    try {
        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
        ) as JwtPayload;

        const { _id } = decoded;

        const user = await User.findById(_id);

        // check if user exists
        if (!user) {
            next();
            return;
        }

        // check if the user is deleted
        if (user.isDeleted) {
            next();
            return;
        }

        req.user = user;
        next();
    } catch {
        next();
    }
});

export default verifyToken;
