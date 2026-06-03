import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  relation: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profilePhoto: { type: String },
    role: { type: String, enum: ['resident', 'admin'], default: 'resident' },
    roomNumber: { type: String },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    emergencyContact: contactSchema,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
