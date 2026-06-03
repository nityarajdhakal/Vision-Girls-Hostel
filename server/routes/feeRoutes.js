import express from 'express';
import {
  getMyFees,
  getAllFees,
  generateFees,
  updateFee,
} from '../controllers/feeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMyFees);
router.get('/', protect, admin, getAllFees);
router.post('/', protect, admin, generateFees);
router.put('/:id', protect, admin, updateFee);

export default router;
