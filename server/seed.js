import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Room from './models/Room.js';
import Notice from './models/Notice.js';
import Gallery from './models/Gallery.js';
import Fee from './models/Fee.js';
import Complaint from './models/Complaint.js';
import Booking from './models/Booking.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vision-girls-hostel';

const residentsData = [
  { name: 'Aanya Sharma', email: 'aanya@vision.com', phone: '9876543210' },
  { name: 'Riya Patel', email: 'riya@vision.com', phone: '9876543211' },
  { name: 'Neha Singh', email: 'neha@vision.com', phone: '9876543212' },
  { name: 'Sana Khan', email: 'sana@vision.com', phone: '9876543213' },
  { name: 'Mira Joshi', email: 'mira@vision.com', phone: '9876543214' },
  { name: 'Tara Mehta', email: 'tara@vision.com', phone: '9876543215' },
  { name: 'Priya Nair', email: 'priya@vision.com', phone: '9876543216' },
  { name: 'Ina Malhotra', email: 'ina@vision.com', phone: '9876543217' },
  { name: 'Neelam Roy', email: 'neelam@vision.com', phone: '9876543218' },
  { name: 'Shreya Bose', email: 'shreya@vision.com', phone: '9876543219' },
];

const roomsData = [
  { roomNumber: '101', type: 'single', floor: 1, capacity: 1, price: 12000, amenities: ['WiFi', 'CCTV', 'Laundry'], images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80'], description: 'Cozy single room with warm lighting.', isAvailable: true },
  { roomNumber: '102', type: 'double', floor: 1, capacity: 2, price: 18000, amenities: ['WiFi', 'Study Room', 'Hot Water'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'], description: 'Spacious double room with premium bedding.', isAvailable: true },
  { roomNumber: '103', type: 'double', floor: 1, capacity: 2, price: 17500, amenities: ['CCTV', 'Kitchen', 'Power Backup'], images: ['https://images.unsplash.com/photo-1505692794403-2a35db21b2f9?auto=format&fit=crop&w=900&q=80'], description: 'Bright room with shared balcony.', isAvailable: false, occupied: 2 },
  { roomNumber: '201', type: 'triple', floor: 2, capacity: 3, price: 22000, amenities: ['WiFi', 'Mess', 'Laundry'], images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'], description: 'Comfortable triple room for small groups.', isAvailable: true },
  { roomNumber: '202', type: 'dormitory', floor: 2, capacity: 4, price: 15000, amenities: ['Hot Water', 'Study Room', 'CCTV'], images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], description: 'Shared dorm-style room with community vibe.', isAvailable: true },
  { roomNumber: '203', type: 'single', floor: 2, capacity: 1, price: 13000, amenities: ['WiFi', 'Parking', 'Power Backup'], images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'], description: 'Chic single room with modern decor.', isAvailable: true },
  { roomNumber: '301', type: 'double', floor: 3, capacity: 2, price: 19000, amenities: ['CCTV', 'Laundry', 'Kitchen'], images: ['https://images.unsplash.com/photo-1494528396228-6b4242e0cdc2?auto=format&fit=crop&w=900&q=80'], description: 'Elegant double room near the study lounge.', isAvailable: true },
  { roomNumber: '302', type: 'triple', floor: 3, capacity: 3, price: 21000, amenities: ['WiFi', 'Mess', 'Hot Water'], images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80'], description: 'Luxury triple room with private storage.', isAvailable: true },
  { roomNumber: '303', type: 'dormitory', floor: 3, capacity: 4, price: 15500, amenities: ['WiFi', 'Security', 'Power Backup'], images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80'], description: 'Sunny dormitory with community seating.', isAvailable: true },
  { roomNumber: '401', type: 'single', floor: 4, capacity: 1, price: 14000, amenities: ['WiFi', 'Gym Access', 'Air Conditioning'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'], description: 'Premium single room with city views.', isAvailable: true },
  { roomNumber: '402', type: 'double', floor: 4, capacity: 2, price: 18500, amenities: ['Laundry', 'Kitchen', 'Hot Water'], images: ['https://images.unsplash.com/photo-1505692794403-2a35db21b2f9?auto=format&fit=crop&w=900&q=80'], description: 'Warm double room for best friends.', isAvailable: true },
  { roomNumber: '403', type: 'triple', floor: 4, capacity: 3, price: 21500, amenities: ['WiFi', 'CCTV', 'Study Room'], images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'], description: 'Cozy triple room near the rooftop garden.', isAvailable: true },
  { roomNumber: '501', type: 'dormitory', floor: 5, capacity: 4, price: 16000, amenities: ['Power Backup', 'CCTV', 'Mess'], images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], description: 'Community dormitory with lounge access.', isAvailable: true },
  { roomNumber: '502', type: 'single', floor: 5, capacity: 1, price: 14500, amenities: ['WiFi', 'Laundry', 'Parking'], images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'], description: 'Quiet single room at the top floor.', isAvailable: true },
];

const noticesData = [
  { title: 'Monthly Rent Due', content: 'Please submit this month\'s rent by the 5th.', category: 'urgent', expiryDate: new Date(new Date().setDate(new Date().getDate() + 14)) },
  { title: 'Yoga Workshop', content: 'Join our free yoga session this Saturday at 5 PM.', category: 'event', expiryDate: new Date(new Date().setDate(new Date().getDate() + 10)) },
  { title: 'Water Shutdown', content: 'Water maintenance will occur on Tuesday from 10 AM to 2 PM.', category: 'maintenance', expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)) },
  { title: 'Guest Policy Updated', content: 'Please review the updated guest policy in the common room.', category: 'general', expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)) },
  { title: 'Housekeeping Schedule', content: 'Rooms will be cleaned every Wednesday and Friday.', category: 'general', expiryDate: new Date(new Date().setDate(new Date().getDate() + 21)) },
];

const galleryData = [
  { title: 'Welcome Lounge', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80', category: 'common-areas' },
  { title: 'Room Interior', image: 'https://images.unsplash.com/photo-1494528396228-6b4242e0cdc2?auto=format&fit=crop&w=900&q=80', category: 'rooms' },
  { title: 'Study Session', image: 'https://images.unsplash.com/photo-1505692794403-2a35db21b2f9?auto=format&fit=crop&w=900&q=80', category: 'amenities' },
  { title: 'Dining Hall', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', category: 'amenities' },
  { title: 'Event Night', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80', category: 'events' },
  { title: 'Common Garden', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b2b?auto=format&fit=crop&w=900&q=80', category: 'common-areas' },
  { title: 'Bedroom Corner', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80', category: 'rooms' },
  { title: 'Study Table', image: 'https://images.unsplash.com/photo-1434030216301-03692a66800b?auto=format&fit=crop&w=900&q=80', category: 'amenities' },
  { title: 'Kitchen', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80', category: 'amenities' },
  { title: 'Hallway', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80', category: 'common-areas' },
];

const runSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    await User.deleteMany();
    await Room.deleteMany();
    await Notice.deleteMany();
    await Gallery.deleteMany();
    await Fee.deleteMany();
    await Complaint.deleteMany();
    await Booking.deleteMany();

    const password = await bcrypt.hash('Admin@123', 12);
    const admin = await User.create({
      name: 'Vision Admin',
      email: 'admin@vision.com',
      password,
      phone: '9000000000',
      role: 'admin',
      isActive: true,
    });

    const createdRooms = await Room.insertMany(roomsData);

    const residents = await Promise.all(
      residentsData.map(async (resident, index) => {
        const hashed = await bcrypt.hash('Resident@123', 12);
        const room = createdRooms[index % createdRooms.length];
        return User.create({
          ...resident,
          password: hashed,
          role: 'resident',
          isActive: true,
          roomNumber: room.roomNumber,
          emergencyContact: { name: 'Parent', phone: '9000000001', relation: 'mother' },
        });
      })
    );

    await Notice.insertMany(noticesData.map((item) => ({ ...item, postedBy: admin._id })));
    await Gallery.insertMany(galleryData);

    await Promise.all(
      residents.slice(0, 5).map(async (resident, index) => {
        const room = createdRooms[index];
        await Fee.create({
          resident: resident._id,
          month: 'June',
          year: 2026,
          amount: room.price,
          rentAmount: room.price,
          additionalCharges: [{ description: 'Maintenance', amount: 500 }],
          status: index % 2 === 0 ? 'paid' : 'pending',
          paymentDate: index % 2 === 0 ? new Date() : null,
          paymentMethod: index % 2 === 0 ? 'UPI' : null,
          receiptNumber: index % 2 === 0 ? `RCPT${1000 + index}` : null,
        });
      })
    );

    await Complaint.create({
      resident: residents[0]._id,
      title: 'Room lighting issue',
      description: 'The bedside lamp is flickering and needs replacement.',
      category: 'maintenance',
      priority: 'medium',
      status: 'open',
    });

    await Booking.create({
      resident: residents[1]._id,
      room: createdRooms[1]._id,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 11)),
      status: 'approved',
      totalAmount: createdRooms[1].price * 12,
      advancePayment: 10000,
      approvedBy: admin._id,
    });

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error', error);
    process.exit(1);
  }
};

runSeed();
