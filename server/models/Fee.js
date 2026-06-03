import mongoose from 'mongoose';

const chargeSchema = new mongoose.Schema({
  description: { type: String },
  amount: { type: Number },
});

const feeSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
    rentAmount: { type: Number, required: true },
    additionalCharges: [chargeSchema],
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
    paymentDate: { type: Date },
    paymentMethod: { type: String },
    receiptNumber: { type: String },
  },
  { timestamps: true }
);

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
