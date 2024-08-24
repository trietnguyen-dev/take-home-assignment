import express from 'express';
import { buyOffer, getOffers } from '../controllers/userController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/getOffers', verifyToken, getOffers);
router.post('/buyOffers', verifyToken, buyOffer);

export default router;
