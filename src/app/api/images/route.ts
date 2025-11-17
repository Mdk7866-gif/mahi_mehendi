import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Image from '@/models/Image';

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all images, newest first - only select necessary fields for faster queries
    const images = await Image.find({})
      .select('_id url category price')
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for faster queries (returns plain JS objects)

    // Ensure we return an array and log categories for debugging
    const imagesArray = Array.isArray(images) ? images : [];
    const categories = [...new Set(imagesArray.map((img: any) => img?.category).filter(Boolean))];
    
    console.log(`Fetched ${imagesArray.length} images from gallery collection`);
    console.log(`Available categories:`, categories);
    console.log(`Category breakdown:`, imagesArray.reduce((acc: any, img: any) => {
      const cat = img?.category || 'unknown';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {}));

    // Add cache headers for better performance (reduced cache time for faster updates)
    return NextResponse.json(imagesArray, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    });
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
