import express from 'express';
import {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaint,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.array('images', 4), createComplaint);
router.get('/', protect, admin, getAllComplaints);
router.get('/my', protect, getMyComplaints);
router.put('/:id', protect, admin, updateComplaint);
router.delete('/:id', protect, deleteComplaint);

export default router;
