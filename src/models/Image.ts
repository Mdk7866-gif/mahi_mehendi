import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  url: string;
  category: 'normal' | 'bridal';
  price: number;
  publicId?: string;
}

const ImageSchema: Schema = new Schema({
  url: { type: String, required: true },
  category: { type: String, enum: ['normal', 'bridal'], required: true },
  price: { type: Number, required: true },
  publicId: { type: String },
}, {
  timestamps: true,
  collection: 'gallery',
});

export default mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);