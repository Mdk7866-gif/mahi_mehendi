// src/models/Contact.ts
// Contact model for the website
import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  emailOrPhone: string;
  occasion: 'bridal' | 'engagement' | 'babyshower' | 'sider' | 'karwa chauth' | string;
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
      enum: ['bridal', 'engagement', 'babyshower', 'sider', 'karwa chauth'],
    },
    preferredDate: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'contacts', // Collection name
  }
);

// Delete the cached model if it exists to ensure schema updates are applied
if (mongoose.models.Contact) {
  delete mongoose.models.Contact;
}

export default mongoose.model<IContact>('Contact', ContactSchema);
