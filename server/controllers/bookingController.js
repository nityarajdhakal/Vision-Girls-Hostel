import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import {
  createBooking as createDemoBooking,
  findRoomById,
  getAllBookings as getAllDemoBookings,
  getMyBookings as getMyDemoBookings,
  updateBookingStatus as updateDemoBookingStatus,
  deleteBooking as deleteDemoBooking,
} from '../data/demoStore.js';

export const createBookingInquiry = asyncHandler(async (req, res) => {
  const { roomId, name, phone } = req.body;

  if (!roomId || !name || !phone) {
    res.status(400);
    throw new Error('Room, name and phone are required');
  }

  if (process.env.DEMO_MODE === 'true') {
    const room = findRoomById(roomId);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    const booking = createDemoBooking({
      room: room._id,
      guestName: name,
      guestPhone: phone,
      status: 'inquiry',
    });

    return res.status(201).json({
      message: 'We will contact you as soon as possible.',
      booking,
    });
  }

  res.status(503);
  throw new Error('Booking inquiry is not available');
});

export const createBooking = asyncHandler(async (req, res) => {
  const { roomId, startDate, endDate, totalAmount, advancePayment, notes } = req.body;

  if (!roomId || !startDate || !endDate) {
    res.status(400);
    throw new Error('Room and dates are required');
  }

  if (process.env.DEMO_MODE === 'true') {
    const room = findRoomById(roomId);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    const booking = createDemoBooking({
      resident: req.user._id,
      room: room._id,
      startDate,
      endDate,
      totalAmount,
      advancePayment,
      notes,
      status: 'pending',
    });

    return res.status(201).json(booking);
  }

  const room = await Room.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  const booking = await Booking.create({
    resident: req.user._id,
    room: room._id,
    startDate,
    endDate,
    totalAmount,
    advancePayment,
    notes,
  });

  res.status(201).json(booking);
});

export const getAllBookings = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(getAllDemoBookings());
  }
  const bookings = await Booking.find()
    .populate('resident', 'name email roomNumber')
    .populate('room', 'roomNumber type price');
  res.json(bookings);
});

export const getMyBookings = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(getMyDemoBookings(req.user._id));
  }

  const bookings = await Booking.find({ resident: req.user._id })
    .populate('room', 'roomNumber type price');
  res.json(bookings);
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (process.env.DEMO_MODE === 'true') {
    const booking = updateDemoBookingStatus(req.params.id, {
      status: status || 'pending',
      approvedBy: req.user._id,
    });
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }
    return res.json(booking);
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  booking.status = status || booking.status;
  booking.approvedBy = req.user._id;
  await booking.save();
  res.json(booking);
});

export const deleteBooking = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const bookingRecord = getAllDemoBookings().find((item) => item._id === req.params.id);
    if (!bookingRecord) {
      res.status(404);
      throw new Error('Booking not found');
    }
    if (bookingRecord.resident !== req.user._id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }
    deleteDemoBooking(req.params.id);
    return res.json({ message: 'Booking cancelled' });
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (booking.resident.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }
  await booking.remove();
  res.json({ message: 'Booking cancelled' });
});
