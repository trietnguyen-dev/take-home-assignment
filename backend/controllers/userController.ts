import { Request, Response } from 'express';
import Offer from '../models/Offer';

const getOffers = async (req: Request, res: Response) => {
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
};

const buyOffer = async (req: Request, res: Response) => {
    try {
        const { offerId } = req.body;
        console.log('offerId:', offerId);
        const offer = await Offer.findById(offerId);
        if (!offer) {
            res.status(404).json({
                status: 'fail',
                msg: 'Offer not found'
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            msg: 'Offer retrieved successfully',
            data: offer
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            msg: 'Failed to retrieve offer',
        });
    }
};

export { getOffers, buyOffer };
