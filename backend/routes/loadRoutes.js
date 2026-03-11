import express from 'express';
import { controlLoad, getLoadHistory, getLoads } from '../controllers/loadController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getLoads);
router.post('/control', protect, adminOnly, controlLoad);
router.get('/history', protect, getLoadHistory);

export default router;
