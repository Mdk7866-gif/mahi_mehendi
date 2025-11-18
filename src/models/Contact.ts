// src/models/Contact.ts
// Contact model for the website
import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  emailOrPhone: string;
  occasion: 'bridal' | 'engagement' | 'babyshower' | 'sider' | string;
  preferredDate: string;
  message: string;
}

const ContactSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    emailOrPhone: { type: String, required: true },
    occasion: {
      type: String,
      required: true,
      enum: ['bridal', 'engagement', 'babyshower', 'sider'],
    },
    preferredDate: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'contacts', // Collection name
  }
);

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
