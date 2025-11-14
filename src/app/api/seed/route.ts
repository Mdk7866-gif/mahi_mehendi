import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Image from '@/models/Image';

const dummyImages = [
  // Normal Mehendi
  { url: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/dummy/normal1.jpg', category: 'normal' as const, price: 500 },
  { url: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/dummy/normal2.jpg', category: 'normal' as const, price: 600 },
  // Bridal Mehendi
  { url: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/dummy/bridal1.jpg', category: 'bridal' as const, price: 2000 },
  { url: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/dummy/bridal2.jpg', category: 'bridal' as const, price: 2500 },
  // Add more dummies; replace URLs with real Cloudinary ones after upload
];

export async function POST() {
  await connectDB();
  await Image.deleteMany({}); // Clear existing
  await Image.insertMany(dummyImages);
  return NextResponse.json({ message: 'Seeded!' });
}