import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/db';
import Image from '@/models/Image';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Step 1: Connect to MongoDB database 'mahi_mehendi'
    console.log('Connecting to MongoDB database: mahi_mehendi');
    await connectDB();
    console.log('Connected to MongoDB successfully');

    // Step 2: Get form data
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const categoryRaw = formData.get('category');
    const priceRaw = formData.get('price');

    const category = typeof categoryRaw === 'string' ? categoryRaw : '';
    const price = typeof priceRaw === 'string' ? priceRaw : '';

    // Step 3: Validate input
    if (!file || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: image, category, and price are required' },
        { status: 400 }
      );
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json({ error: 'Invalid price. Please provide a valid number.' }, { status: 400 });
    }

    // Validate file type (web File)
    if (typeof file.type !== 'string' || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate category
    if (category !== 'normal' && category !== 'bridal') {
      return NextResponse.json({ error: 'Invalid category. Must be "normal" or "bridal"' }, { status: 400 });
    }

    // Step 4: Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(`Uploading image to Cloudinary: ${file.name} (${file.size} bytes)`);

    // Step 5: Upload to Cloudinary (wrap in Promise<unknown> and narrow later)
    const uploadResult = await new Promise<unknown>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'mahi_mehendi',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Image uploaded to Cloudinary successfully');
            resolve(result);
          }
        }
      ).end(buffer);
    });

    // Narrow the upload result shape safely
    const uploadRecord = (uploadResult && typeof uploadResult === 'object' ? uploadResult as Record<string, unknown> : null);
    const secureUrl =
      uploadRecord && typeof uploadRecord['secure_url'] === 'string'
        ? uploadRecord['secure_url']
        : null;

    if (!secureUrl) {
      console.error('Cloudinary returned unexpected result:', uploadResult);
      return NextResponse.json({ error: 'Cloudinary upload failed or returned unexpected response' }, { status: 500 });
    }

    console.log('Cloudinary URL:', secureUrl);

    // Step 6: Save URL to MongoDB collection 'gallery' in database 'mahi_mehendi'
    console.log('Saving image to MongoDB collection: gallery');
    const newImage = new Image({
      url: secureUrl,
      category: category as 'normal' | 'bridal',
      price: priceNum,
    });
    await newImage.save();
    console.log('Image saved to MongoDB successfully:', newImage._id);

    return NextResponse.json(
      {
        message: 'Image uploaded successfully!',
        image: {
          _id: newImage._id,
          url: newImage.url,
          category: newImage.category,
          price: newImage.price,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Safe error narrowing without `any`
    console.error('Upload error:', error);
    const errMsg = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
