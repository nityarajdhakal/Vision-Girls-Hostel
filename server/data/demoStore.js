import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const generateId = () => randomUUID();

const users = [
  {
    _id: 'admin-1',
    name: 'Hostel Admin',
    email: 'admin@hostel.com',
    password: bcrypt.hashSync('admin123', 12),
    phone: '9999999999',
    role: 'admin',
    roomNumber: '',
    joinDate: new Date(),
    isActive: true,
    emergencyContact: { name: 'Office', phone: '9999999999', relation: 'Admin' },
  },
  {
    _id: 'resident-1',
    name: 'Demo Resident',
    email: 'demo@hostel.com',
    password: bcrypt.hashSync('demo123', 12),
    phone: '8888888888',
    role: 'resident',
    roomNumber: '101',
    joinDate: new Date(),
    isActive: true,
    emergencyContact: { name: 'Parent', phone: '7777777777', relation: 'Mother' },
  },
];

const rooms = [
  {
    _id: 'room-101',
    roomNumber: '101',
    type: 'single',
    floor: 1,
    capacity: 1,
    occupied: 1,
    occupants: ['resident-1'],
    price: 12000,
    amenities: ['Private Bed', 'Wardrobe', 'Study Table'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    ],
    isAvailable: false,
    description: 'Cozy single occupancy room with comfy bed and personal study area.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'room-102',
    roomNumber: '102',
    type: 'double',
    floor: 1,
    capacity: 2,
    occupied: 0,
    occupants: [],
    price: 9500,
    amenities: ['Shared Living Area', 'Wi-Fi', 'Laundry'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    ],
    isAvailable: true,
    description: 'Comfortable double room with shared lounge and complimentary utilities.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'room-103',
    roomNumber: '103',
    type: 'triple',
    floor: 2,
    capacity: 3,
    occupied: 1,
    occupants: ['resident-1'],
    price: 7800,
    amenities: ['Large Windows', 'Storage', 'Study Nook'],
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    ],
    isAvailable: true,
    description: 'Bright triple sharing room ideal for students and friends.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const bookings = [];
const notices = [
  {
    _id: 'notice-1',
    title: 'Monthly Mess Menu Updated',
    content: 'Check the updated menu for this month in the dining area and the app.',
    category: 'announcements',
    expiryDate: null,
    isActive: true,
    postedBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const fees = [
  {
    _id: 'fee-1',
    resident: 'resident-1',
    month: 6,
    year: 2026,
    amount: 12000,
    rentAmount: 12000,
    additionalCharges: [],
    status: 'pending',
    paymentDate: null,
    receiptNumber: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const gallery = [
  {
    _id: 'gallery-1',
    title: 'Welcome Lounge',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80',
    category: 'common-areas',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'gallery-2',
    title: 'Study Session',
    image: 'https://images.unsplash.com/photo-1505692794403-2a35db21b2f9?auto=format&fit=crop&w=900&q=80',
    category: 'amenities',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'gallery-3',
    title: 'Event Night',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    category: 'events',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'gallery-4',
    title: 'Common Garden',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b2b?auto=format&fit=crop&w=900&q=80',
    category: 'common-areas',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'gallery-5',
    title: 'Dining Hall',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    category: 'amenities',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'gallery-6',
    title: 'Bedroom Corner',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    category: 'rooms',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const complaints = [];
const contacts = [];

const createItem = (collection, item) => {
  const newItem = { ...item, _id: item._id || generateId(), createdAt: new Date(), updatedAt: new Date() };
  collection.push(newItem);
  return newItem;
};

const findOne = (collection, query) => {
  return collection.find((item) => Object.entries(query).every(([key, value]) => item[key] === value));
};

const findById = (collection, id) => collection.find((item) => item._id === id);

const filterItems = (collection, filter = {}) => {
  return collection.filter((item) =>
    Object.entries(filter).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      if (typeof value === 'boolean') return item[key] === value;
      if (typeof value === 'number') return item[key] === value;
      return item[key] === value;
    })
  );
};

const updateItem = (collection, id, update) => {
  const item = findById(collection, id);
  if (!item) return null;
  Object.entries(update || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      item[key] = value;
    }
  });
  item.updatedAt = new Date();
  return item;
};

const deleteItem = (collection, id) => {
  const index = collection.findIndex((item) => item._id === id);
  if (index === -1) return false;
  collection.splice(index, 1);
  return true;
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

const populateBooking = (booking) => {
  return {
    ...booking,
    resident: sanitizeUser(findById(users, booking.resident) || null),
    room: findById(rooms, booking.room) || null,
  };
};

const populateComplaint = (complaint) => ({
  ...complaint,
  resident: sanitizeUser(findById(users, complaint.resident) || null),
});

export const initDemoStore = async () => {
  return {
    users,
    rooms,
    bookings,
    notices,
    fees,
    complaints,
    contacts,
    gallery,
  };
};

export const findUserByEmail = (email) => findOne(users, { email });
export const findUserById = (id) => findById(users, id);
export const createUser = (data) => {
  const existing = findOne(users, { email: data.email });
  if (existing) return null;
  const user = createItem(users, {
    ...data,
    password: bcrypt.hashSync(data.password, 12),
    role: 'resident',
    isActive: false,
  });
  return user;
};
export const updateUser = (id, updates) => updateItem(users, id, updates);
export const getResidents = () => users.filter((user) => user.role === 'resident').map(sanitizeUser);

export const createRoom = (roomData) => createItem(rooms, roomData);
export const getGallery = () => gallery;
export const createGalleryItem = (data) => createItem(gallery, data);
export const deleteGalleryItem = (id) => deleteItem(gallery, id);
export const getRooms = (query) => {
  const filter = {};
  if (query.type) filter.type = query.type;
  if (query.floor !== undefined) filter.floor = Number(query.floor);
  if (query.available === 'true') filter.isAvailable = true;
  if (query.available === 'false') filter.isAvailable = false;
  return rooms.filter((room) => {
    return Object.entries(filter).every(([key, value]) => room[key] === value);
  }).sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }));
};
export const findRoomById = (id) => findById(rooms, id);
export const findRoomByNumber = (roomNumber) => rooms.find((room) => room.roomNumber === roomNumber);
export const updateRoom = (id, updates) => updateItem(rooms, id, updates);
export const deleteRoom = (id) => deleteItem(rooms, id);

export const createBooking = (bookingData) => createItem(bookings, bookingData);
export const getAllBookings = () => bookings.map(populateBooking);
export const getMyBookings = (residentId) => bookings.filter((booking) => booking.resident === residentId).map(populateBooking);
export const updateBookingStatus = (id, updates) => updateItem(bookings, id, updates);
export const deleteBooking = (id) => deleteItem(bookings, id);

export const getNotices = () => {
  const now = new Date();
  return notices.filter((item) => item.isActive && (!item.expiryDate || new Date(item.expiryDate) >= now));
};
export const getAllNotices = () => notices;
export const createNotice = (data) => createItem(notices, { ...data, postedBy: data.postedBy });
export const updateNotice = (id, updates) => updateItem(notices, id, updates);
export const deleteNotice = (id) => deleteItem(notices, id);

export const getMyFees = (residentId) => fees.filter((fee) => fee.resident === residentId);
export const getAllFees = () => fees.map((fee) => ({
  ...fee,
  resident: sanitizeUser(findById(users, fee.resident) || null),
}));
export const generateFees = ({ month, year, additionalCharge, additionalAmount }) => {
  const created = [];
  users.filter((user) => user.role === 'resident' && user.isActive).forEach((resident) => {
    const existing = fees.find((fee) => fee.resident === resident._id && fee.month === month && fee.year === year);
    if (existing) return;
    const room = rooms.find((room) => room.roomNumber === resident.roomNumber);
    const rentAmount = room ? room.price : 0;
    const fee = createItem(fees, {
      resident: resident._id,
      month,
      year,
      amount: rentAmount + Number(additionalAmount || 0),
      rentAmount,
      additionalCharges: additionalCharge ? [{ description: additionalCharge, amount: Number(additionalAmount || 0) }] : [],
      status: 'pending',
      paymentDate: null,
      receiptNumber: null,
    });
    created.push(fee);
  });
  return created;
};
export const updateFee = (id, updates) => updateItem(fees, id, updates);

export const createComplaint = (data) => createItem(complaints, data);
export const getMyComplaints = (residentId) => complaints.filter((complaint) => complaint.resident === residentId).map(populateComplaint);
export const getAllComplaints = () => complaints.map(populateComplaint);
export const updateComplaint = (id, updates) => updateItem(complaints, id, updates);
export const deleteComplaint = (id) => deleteItem(complaints, id);

export const submitContact = (data) => createItem(contacts, data);

export const comparePasswords = (raw, hashed) => bcrypt.compareSync(raw, hashed);
