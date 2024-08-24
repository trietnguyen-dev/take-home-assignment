import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, confirmPassword } = req.body;
    console.log('email:', req.body);
    try {
        let user: IUser | null = await User.findOne({ email });
        if (user) {
            res.status(400).json({ status: 'fail', msg: 'User already exists' });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ status: 'fail', msg: 'Passwords do not match' });
            return;
        }

        user = new User({ email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ status: 'success', msg: 'Registration successful', token });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'fail', msg: 'Server error' });
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    console.log('email:', req.body);

    try {
        let user: IUser | null = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ status: 'fail', msg: 'User does not exist' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ status: 'fail', msg: 'Password is incorrect' });
            return;
        }

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ status: 'success', msg: 'Login successful', token });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'fail', msg: 'Server error' });
    }
};

export { register, login };
