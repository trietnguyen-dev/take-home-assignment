import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import Offer from '../models/Offer';
import User from '../models/User';

const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ "email": email });
        if (!user) {
            res.status(400).json({ status: 'fail', msg: 'User does not exist' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ status: 'fail', msg: 'Password is incorrect' });
            return;
        }
        const isAdmin = user.isAdmin;
        if (!isAdmin) {
            res.status(400).json({ status: 'fail', msg: 'User does not have admin access' });
            return;
        }
        const payload = { user: { id: user.id, admin: isAdmin } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ status: 'success', msg: 'Login successful', token });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', msg: 'Server error' });
    }
}
const getOffers = async (req: Request, res: Response): Promise<void> => {
    try {
        const offers = await Offer.find();
        res.status(200).json({
            status: 'success',
            msg: 'Offers fetched successfully',
            data: offers
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            msg: 'Failed to fetch offers',
        });
    }
}

const addOffers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, originalPrice, discount } = req.body;
        const discountedPrice = originalPrice - (originalPrice * discount / 100);

        const newOffer = new Offer({ title, description, originalPrice, discount, discountedPrice });
        const savedOffer = await newOffer.save();

        res.status(201).json({
            status: 'success',
            msg: 'Offer created successfully',
            data: savedOffer
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            msg: 'Failed to create offer',
        });
    }
};

const updateOffers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { originalPrice, discount } = req.body;

        const discountedPrice = originalPrice - (originalPrice * discount / 100);

        const updatedOffer = await Offer.findByIdAndUpdate(id, { ...req.body, discountedPrice }, { new: true });
        if (!updatedOffer) {
            res.status(404).json({
                status: 'fail',
                msg: 'Offer not found'
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            msg: 'Offer updated successfully',
            data: updatedOffer
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            msg: 'Failed to update offer',
        });
    }
};

const deleteOffers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedOffer = await Offer.findByIdAndDelete(id);
        if (!deletedOffer) {
            res.status(404).json({
                status: 'fail',
                msg: 'Offer not found'
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            msg: 'Offer deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            msg: 'Failed to delete offer',
        });
    }
};

export { addOffers, deleteOffers, getOffers, updateOffers, login };

