import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['single', 'double', 'triple', 'dormitory'], required: true },
    floor: { type: Number, required: true },
    capacity: { type: Number, required: true },
    occupied: { type: Number, default: 0 },
    occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    price: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
