import express from 'express';
import { verifyToken, checkAdmin } from '../middleware/authMiddleware';
import { addOffers, deleteOffers, updateOffers, getOffers, login } from '../controllers/adminController';

const router = express.Router();

router.post('/login', login);
router.get('/offers', verifyToken, checkAdmin, getOffers);
router.post('/addOffers', verifyToken, checkAdmin, addOffers);
router.put('/updateOffers/:id', verifyToken, checkAdmin, updateOffers);
router.delete('/deleteOffers/:id', verifyToken, checkAdmin, deleteOffers);

export default router;
