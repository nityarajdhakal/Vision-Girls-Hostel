import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ['rooms', 'amenities', 'events', 'common-areas'],
      default: 'rooms',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
