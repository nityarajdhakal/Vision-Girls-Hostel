import asyncHandler from 'express-async-handler';
import Notice from '../models/Notice.js';
import {
  getNotices as getDemoNotices,
  getAllNotices as getAllDemoNotices,
  createNotice as createDemoNotice,
  updateNotice as updateDemoNotice,
  deleteNotice as deleteDemoNotice,
} from '../data/demoStore.js';

export const getNotices = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(getDemoNotices());
  }

  const now = new Date();
  const notices = await Notice.find({ isActive: true, $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] })
    .sort({ createdAt: -1 })
    .populate('postedBy', 'name');
  res.json(notices);
});

export const getAllNotices = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(getAllDemoNotices());
  }

  const notices = await Notice.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
  res.json(notices);
});

export const createNotice = asyncHandler(async (req, res) => {
  const { title, content, category, expiryDate } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  if (process.env.DEMO_MODE === 'true') {
    const notice = createDemoNotice({
      title,
      content,
      category,
      expiryDate,
      postedBy: req.user._id,
    });
    return res.status(201).json(notice);
  }

  const notice = await Notice.create({
    title,
    content,
    category,
    expiryDate,
    postedBy: req.user._id,
  });

  res.status(201).json(notice);
});

export const updateNotice = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const notice = updateDemoNotice(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      expiryDate: req.body.expiryDate,
      isActive: req.body.isActive,
    });
    if (!notice) {
      res.status(404);
      throw new Error('Notice not found');
    }
    return res.json(notice);
  }

  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    res.status(404);
    throw new Error('Notice not found');
  }

  notice.title = req.body.title || notice.title;
  notice.content = req.body.content || notice.content;
  notice.category = req.body.category || notice.category;
  notice.expiryDate = req.body.expiryDate || notice.expiryDate;
  notice.isActive = req.body.isActive ?? notice.isActive;

  const updatedNotice = await notice.save();
  res.json(updatedNotice);
});

export const deleteNotice = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const removed = deleteDemoNotice(req.params.id);
    if (!removed) {
      res.status(404);
      throw new Error('Notice not found');
    }
    return res.json({ message: 'Notice removed' });
  }

  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    res.status(404);
    throw new Error('Notice not found');
  }
  await notice.remove();
  res.json({ message: 'Notice removed' });
});
