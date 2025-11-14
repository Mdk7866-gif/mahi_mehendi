import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  emailOrPhone: string;
  occasion: string;
  preferredDate: string;
  message: string;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  emailOrPhone: { type: String, required: true },
  occasion: { type: String, required: true },
  preferredDate: { type: String, required: true },
  message: { type: String, required: true },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  collection: 'contacts', // Collection name
});

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

