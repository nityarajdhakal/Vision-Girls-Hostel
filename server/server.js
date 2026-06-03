import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { initDemoStore } from './data/demoStore.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 5000);
const DEMO_MODE = process.env.DEMO_MODE === 'true';

// Configure CORS to allow the frontend during development and production
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = [clientUrl, 'http://localhost:5173', 'http://localhost:5178'].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, server-to-server) when origin is undefined
    if (!origin) return callback(null, true);
    // Allow listed origins or any localhost origin during development
    if (allowedOrigins.includes(origin) || /localhost/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Vision Girls Hostel API is running' });
});

app.use(notFound);
app.use(errorHandler);

const startServer = (port) => {
  const server = app.listen(port, () => console.log(`Server running on port ${port}`));
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Trying port ${nextPort} instead.`);
      startServer(nextPort);
    } else {
      console.error(error);
      process.exit(1);
    }
  });
};

async function start() {
  if (DEMO_MODE) {
    console.log('Demo mode enabled: database disabled');
    await initDemoStore();
  } else {
    try {
      const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vision-girls-hostel';
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.warn('MongoDB unavailable, switching to demo mode');
      process.env.DEMO_MODE = 'true';
      await initDemoStore();
    }
  }

  startServer(PORT);
}

start();
