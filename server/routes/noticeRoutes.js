import express from 'express';
import {
  getNotices,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/noticeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getNotices);
router.get('/all', protect, admin, getAllNotices);
router.post('/', protect, admin, createNotice);
router.put('/:id', protect, admin, updateNotice);
router.delete('/:id', protect, admin, deleteNotice);

export default router;
