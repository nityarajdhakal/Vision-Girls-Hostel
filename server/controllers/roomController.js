import asyncHandler from 'express-async-handler';
import Room from '../models/Room.js';
import {
  getRooms as getDemoRooms,
  findRoomById,
  findRoomByNumber,
  createRoom as createDemoRoom,
  updateRoom as updateDemoRoom,
  deleteRoom as deleteDemoRoom,
} from '../data/demoStore.js';

export const getRooms = asyncHandler(async (req, res) => {
  const { type, floor, available } = req.query;
  const filters = {};

  if (type) filters.type = type;
  if (floor) filters.floor = Number(floor);
  if (available === 'true') filters.isAvailable = true;
  if (available === 'false') filters.isAvailable = false;

  if (process.env.DEMO_MODE === 'true') {
    return res.json(getDemoRooms({ type, floor, available }));
  }

  const rooms = await Room.find(filters).sort({ roomNumber: 1 });
  res.json(rooms);
});

export const getRoomById = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const room = findRoomById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }
    return res.json(room);
  }

  const room = await Room.findById(req.params.id).populate('occupants', 'name email roomNumber');
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }
  res.json(room);
});

export const createRoom = asyncHandler(async (req, res) => {
  const { roomNumber, type, floor, capacity, price, amenities, description, images, isAvailable } = req.body;
  if (process.env.DEMO_MODE === 'true') {
    const existing = findRoomByNumber(roomNumber);
    if (existing) {
      res.status(400);
      throw new Error('Room number already exists');
    }

    const room = createDemoRoom({
      roomNumber,
      type,
      floor,
      capacity,
      price,
      amenities: amenities || [],
      description,
      images: images || [],
      isAvailable: isAvailable ?? true,
    });

    return res.status(201).json(room);
  }

  const existing = await Room.findOne({ roomNumber });
  if (existing) {
    res.status(400);
    throw new Error('Room number already exists');
  }

  const room = await Room.create({
    roomNumber,
    type,
    floor,
    capacity,
    price,
    amenities: amenities || [],
    description,
    images: images || [],
    isAvailable: isAvailable ?? true,
  });

  res.status(201).json(room);
});

export const updateRoom = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const room = updateDemoRoom(req.params.id, req.body);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }
    return res.json(room);
  }

  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  Object.assign(room, req.body);
  const updatedRoom = await room.save();
  res.json(updatedRoom);
});

export const deleteRoom = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const removed = deleteDemoRoom(req.params.id);
    if (!removed) {
      res.status(404);
      throw new Error('Room not found');
    }
    return res.json({ message: 'Room removed' });
  }

  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }
  await room.remove();
  res.json({ message: 'Room removed' });
});
