import asyncHandler from 'express-async-handler';
import Gallery from '../models/Gallery.js';
import {
  getGallery as getDemoGallery,
  createGalleryItem,
  deleteGalleryItem,
} from '../data/demoStore.js';

export const getGallery = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(getDemoGallery());
  }
  const images = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(images);
});

export const uploadImage = asyncHandler(async (req, res) => {
  const { title, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !imageUrl) {
    res.status(400);
    throw new Error('Title and image file are required');
  }

  if (process.env.DEMO_MODE === 'true') {
    const galleryItem = createGalleryItem({
      title,
      image: imageUrl,
      category,
      isActive: true,
    });
    return res.status(201).json(galleryItem);
  }

  const galleryItem = await Gallery.create({
    title,
    image: imageUrl,
    category,
  });

  res.status(201).json(galleryItem);
});

export const deleteImage = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const removed = deleteGalleryItem(req.params.id);
    if (!removed) {
      res.status(404);
      throw new Error('Gallery item not found');
    }
    return res.json({ message: 'Gallery item removed' });
  }

  const item = await Gallery.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Gallery item not found');
  }
  await item.remove();
  res.json({ message: 'Gallery item removed' });
});
