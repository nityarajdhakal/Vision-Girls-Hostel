import asyncHandler from 'express-async-handler';
import Complaint from '../models/Complaint.js';
import {
  createComplaint as createDemoComplaint,
  getAllComplaints as getAllDemoComplaints,
  getMyComplaints as getMyDemoComplaints,
  updateComplaint as updateDemoComplaint,
  deleteComplaint as deleteDemoComplaint,
} from '../data/demoStore.js';

export const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category, priority } = req.body;
  const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

  if (!title || !description) {
    res.status(400);
    throw new Error('Title and description are required');
  }

  if (process.env.DEMO_MODE === 'true') {
    const complaint = createDemoComplaint({
      resident: req.user._id,
      title,
      description,
      category,
      priority,
      images,
      status: 'pending',
    });
    return res.status(201).json(complaint);
  }

  const complaint = await Complaint.create({
    resident: req.user._id,
    title,
    description,
    category,
    priority,
    images,
  });

  res.status(201).json(complaint);
});

export const getAllComplaints = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(getAllDemoComplaints());
  }
  const complaints = await Complaint.find().populate('resident', 'name email roomNumber');
  res.json(complaints);
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(getMyDemoComplaints(req.user._id));
  }
  const complaints = await Complaint.find({ resident: req.user._id });
  res.json(complaints);
});

export const updateComplaint = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const complaint = updateDemoComplaint(req.params.id, {
      status: req.body.status,
      adminReply: req.body.adminReply,
      resolvedAt: req.body.status === 'resolved' ? new Date() : undefined,
    });
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }
    return res.json(complaint);
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  complaint.status = req.body.status || complaint.status;
  complaint.adminReply = req.body.adminReply || complaint.adminReply;
  if (complaint.status === 'resolved') complaint.resolvedAt = Date.now();

  const updatedComplaint = await complaint.save();
  res.json(updatedComplaint);
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const removed = deleteDemoComplaint(req.params.id);
    if (!removed) {
      res.status(404);
      throw new Error('Complaint not found');
    }
    return res.json({ message: 'Complaint removed' });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }
  await complaint.remove();
  res.json({ message: 'Complaint removed' });
});
