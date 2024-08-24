import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import User from '../models/User';

interface ExtendedRequest extends Request {
    user?: {
        id: string;
        isAdmin: boolean;
    };
}

interface JwtPayload {
    user: {
        id: string;
        isAdmin: boolean;
    };
}

export const verifyToken = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ status: 'fail', msg: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, async (err: VerifyErrors | null, decoded?: JwtPayload | {}) => {
        if (err) {
            return res.status(401).json({ status: 'fail', msg: 'Invalid token' });
        }

        if (decoded && 'user' in decoded) {
            try {
                const user = await User.findById(decoded.user.id);
                if (!user) {
                    return res.status(401).json({ status: 'fail', msg: 'User not found' });
                }
                req.user = {
                    id: user.id.toString(),
                    isAdmin: user.isAdmin || false,
                };
                next();
            } catch (error) {
                res.status(500).json({ status: 'fail', msg: 'Server error' });
            }
        } else {
            res.status(401).json({ status: 'fail', msg: 'Invalid token' });
        }
    });
};
export const checkAdmin = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (req.user?.isAdmin) {
        next();
    } else {
        res.status(403).json({ status: 'fail', msg: 'Access denied' });
    }
};
