import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  certificateNumber: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  courseName: { type: String },
  completionDate: { type: Date, required: true },
  photoUrl: { type: String, required: true },
  pdfUrl: { type: String }, // Cloudinary URL
}, { timestamps: true });

export default mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);