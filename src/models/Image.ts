import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  url: string;
  category: 'bridal' | 'engagement' | 'babyshower' | 'sider' | 'karwa chauth';
  price: number;
  publicId?: string;
}

const ImageSchema: Schema = new Schema({
  url: { type: String, required: true },
  category: { type: String, enum: ['bridal', 'engagement', 'babyshower', 'sider', 'karwa chauth'], required: true },
  price: { type: Number, required: true },
  publicId: { type: String },
}, {
  timestamps: true,
  collection: 'gallery',
});

// Delete the cached model if it exists to ensure schema updates are applied
if (mongoose.models.Image) {
  delete mongoose.models.Image;
}

export default mongoose.model<IImage>('Image', ImageSchema);