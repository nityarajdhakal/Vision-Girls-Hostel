import express from 'express';
import { getGallery, uploadImage, deleteImage } from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', protect, admin, upload.single('image'), uploadImage);
router.delete('/:id', protect, admin, deleteImage);

export default router;
