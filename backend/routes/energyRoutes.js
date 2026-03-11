import express from 'express';
import { getHistory, getLiveEnergy } from '../controllers/energyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/live', protect, getLiveEnergy);
router.get('/history', protect, getHistory);

export default router;
