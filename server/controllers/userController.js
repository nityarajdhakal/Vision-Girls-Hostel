import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { getResidents as getDemoResidents, findUserById, updateUser } from '../data/demoStore.js';

export const getResidents = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(getDemoResidents());
  }

  const residents = await User.find({ role: 'resident' }).select('-password').sort({ createdAt: -1 });
  res.json(residents);
});

export const updateResident = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const resident = findUserById(req.params.id);
    if (!resident) {
      res.status(404);
      throw new Error('Resident not found');
    }

    const updatedResident = updateUser(req.params.id, {
      name: req.body.name,
      phone: req.body.phone,
      roomNumber: req.body.roomNumber,
      isActive: req.body.isActive,
      ...(req.body.password ? { password: bcrypt.hashSync(req.body.password, 12) } : {}),
    });

    return res.json({
      id: updatedResident._id,
      name: updatedResident.name,
      email: updatedResident.email,
      phone: updatedResident.phone,
      roomNumber: updatedResident.roomNumber,
      isActive: updatedResident.isActive,
    });
  }

  const resident = await User.findById(req.params.id);
  if (!resident) {
    res.status(404);
    throw new Error('Resident not found');
  }

  resident.name = req.body.name || resident.name;
  resident.phone = req.body.phone || resident.phone;
  resident.roomNumber = req.body.roomNumber || resident.roomNumber;
  resident.isActive = req.body.isActive ?? resident.isActive;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(12);
    resident.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedResident = await resident.save();
  res.json({
    id: updatedResident._id,
    name: updatedResident.name,
    email: updatedResident.email,
    phone: updatedResident.phone,
    roomNumber: updatedResident.roomNumber,
    isActive: updatedResident.isActive,
  });
});
