import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Image from '@/models/Image';

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all images, newest first
    const images = await Image.find({}).sort({ createdAt: -1 });

    console.log(`Fetched ${Array.isArray(images) ? images.length : 'unknown number of'} images from gallery collection`);

    return NextResponse.json(images);
  } catch (error) {
    // Safe TypeScript narrowing
    console.error('Error fetching images:', error);

    const errMessage =
      error instanceof Error
        ? error.message
        : 'Failed to fetch images';

    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
