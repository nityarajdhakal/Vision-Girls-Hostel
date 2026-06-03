import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, admin, getAllBookings);
router.get('/my', protect, getMyBookings);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

export default router;
