import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Image from '@/models/Image';

export async function GET() {
  try {
    // Connect to MongoDB database 'mahi_mehendi'
    await connectDB();
    
    // Fetch all images from 'gallery' collection
    const images = await Image.find({}).sort({ createdAt: -1 }); // Sort by newest first
    
    console.log(`Fetched ${images.length} images from gallery collection`);
    
    return NextResponse.json(images);
  } catch (error: any) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch images' },
      { status: 500 }
    );
  }
}