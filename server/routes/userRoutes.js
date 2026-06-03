import express from 'express';
import { getResidents, updateResident } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/residents', protect, admin, getResidents);
router.put('/:id', protect, admin, updateResident);

export default router;
