import asyncHandler from 'express-async-handler';
import Fee from '../models/Fee.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import {
  getMyFees as getMyDemoFees,
  getAllFees as getAllDemoFees,
  generateFees as generateDemoFees,
  updateFee as updateDemoFee,
} from '../data/demoStore.js';

export const getMyFees = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(getMyDemoFees(req.user._id));
  }

  const fees = await Fee.find({ resident: req.user._id }).sort({ year: -1, month: -1 });
  res.json(fees);
});

export const getAllFees = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(getAllDemoFees());
  }

  const fees = await Fee.find().populate('resident', 'name email roomNumber');
  res.json(fees);
});

export const generateFees = asyncHandler(async (req, res) => {
  const { month, year, additionalCharge, additionalAmount } = req.body;

  if (process.env.DEMO_MODE === 'true') {
    const createdFees = generateDemoFees({ month, year, additionalCharge, additionalAmount });
    return res.status(201).json({ message: 'Fees generated', count: createdFees.length });
  }

  const residents = await User.find({ role: 'resident', isActive: true });
  const createdFees = [];

  for (const resident of residents) {
    const existing = await Fee.findOne({ resident: resident._id, month, year });
    if (existing) continue;
    const room = await Room.findOne({ roomNumber: resident.roomNumber });
    const rentAmount = room ? room.price : 0;
    const fee = await Fee.create({
      resident: resident._id,
      month,
      year,
      amount: rentAmount + Number(additionalAmount || 0),
      rentAmount,
      additionalCharges: additionalCharge ? [{ description: additionalCharge, amount: Number(additionalAmount || 0) }] : [],
      status: 'pending',
    });
    createdFees.push(fee);
  }

  res.status(201).json({ message: 'Fees generated', count: createdFees.length });
});

export const updateFee = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const fee = updateDemoFee(req.params.id, {
      status: req.body.status,
      paymentDate: req.body.paymentDate,
      paymentMethod: req.body.paymentMethod,
      receiptNumber: req.body.receiptNumber,
    });
    if (!fee) {
      res.status(404);
      throw new Error('Fee record not found');
    }
    return res.json(fee);
  }

  const fee = await Fee.findById(req.params.id);
  if (!fee) {
    res.status(404);
    throw new Error('Fee record not found');
  }

  fee.status = req.body.status || fee.status;
  fee.paymentDate = req.body.paymentDate || fee.paymentDate;
  fee.paymentMethod = req.body.paymentMethod || fee.paymentMethod;
  fee.receiptNumber = req.body.receiptNumber || fee.receiptNumber;
  const updated = await fee.save();

  res.json(updated);
});
