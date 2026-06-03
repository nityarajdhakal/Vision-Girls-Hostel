import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { findUserById } from '../data/demoStore.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (process.env.DEMO_MODE === 'true') {
      const user = findUserById(decoded.id);
      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }
      req.user = { ...user };
      delete req.user.password;
      return next();
    }

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});
