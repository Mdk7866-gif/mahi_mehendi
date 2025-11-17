import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Image from '@/models/Image';

// Define interface OUTSIDE to avoid redefinition inside route
interface ImageDocument {
  _id: string;
  url: string;
  category: string;
  price: number;
}

export async function GET() {
  try {
    await connectDB();

    // Type return of lean() using generic
    const images = await Image.find({})
      .select('_id url category price')
      .sort({ createdAt: -1 })
      .lean<ImageDocument[]>();  // ⭐ No "any" anymore

    const imagesArray: ImageDocument[] = images.map((img) => ({
      _id: img._id.toString(),
      url: img.url,
      category: img.category,
      price: img.price,
    }));

    const categories = [...new Set(imagesArray.map((img) => img.category))];

    console.log(`Fetched ${imagesArray.length} images from gallery collection`);
    console.log(`Available categories:`, categories);

    console.log(
      `Category breakdown:`,
      imagesArray.reduce((acc: Record<string, number>, img) => {
        acc[img.category] = (acc[img.category] || 0) + 1;
        return acc;
      }, {})
    );

    return NextResponse.json(imagesArray, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error fetching images:', error);

    const errMessage =
      error instanceof Error ? error.message : 'Failed to fetch images';

    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
