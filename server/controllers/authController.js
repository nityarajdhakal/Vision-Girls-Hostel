import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { findUserByEmail, createUser, findUserById, updateUser, comparePasswords } from '../data/demoStore.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, emergencyContact } = req.body;

  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  if (process.env.DEMO_MODE === 'true') {
    const userExists = findUserByEmail(email);
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = createUser({
      name,
      email,
      password,
      phone,
      emergencyContact,
    });

    return res.status(201).json({
      message: 'Registration successful, pending admin approval',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    emergencyContact,
    role: 'resident',
    isActive: false,
  });

  res.status(201).json({
    message: 'Registration successful, pending admin approval',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user;
  if (process.env.DEMO_MODE === 'true') {
    user = findUserByEmail(email);
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const passwordMatch = comparePasswords(password, user.password);
    if (!passwordMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error('Account pending approval');
    }
  } else {
    user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error('Account pending approval');
    }
  }

  const token = generateToken(user._id);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    roomNumber: user.roomNumber,
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', { maxAge: 0 });
  res.json({ message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    return res.json(req.user);
  }

  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  if (process.env.DEMO_MODE === 'true') {
    const updatedUser = updateUser(req.user._id, {
      name: req.body.name,
      phone: req.body.phone,
      emergencyContact: req.body.emergencyContact,
      profilePhoto: req.body.profilePhoto,
      ...(req.body.password ? { password: bcrypt.hashSync(req.body.password, 12) } : {}),
    });

    if (!updatedUser) {
      res.status(404);
      throw new Error('User not found');
    }

    return res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      emergencyContact: updatedUser.emergencyContact,
      profilePhoto: updatedUser.profilePhoto,
    });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.emergencyContact = req.body.emergencyContact || user.emergencyContact;
  user.profilePhoto = req.body.profilePhoto || user.profilePhoto;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await user.save();
  res.json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    emergencyContact: updatedUser.emergencyContact,
    profilePhoto: updatedUser.profilePhoto,
  });
});
