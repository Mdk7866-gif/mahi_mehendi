import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/db';
import ImageModel from '@/models/Image';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const doc = await ImageModel.findById(id);
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch image';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const existing = await ImageModel.findById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const categoryRaw = formData.get('category');
      const priceRaw = formData.get('price');
      const file = formData.get('image') as File | null;

      const category = typeof categoryRaw === 'string' ? categoryRaw : existing.category;
      const priceStr = typeof priceRaw === 'string' ? priceRaw : String(existing.price);
      const priceNum = parseFloat(priceStr);
      if (isNaN(priceNum) || priceNum < 0) {
        return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
      }
      if (category !== 'bridal' && category !== 'engagement' && category !== 'babyshower' && category !== 'sider' && category !== 'karwa chauth') {
        return NextResponse.json({ error: 'Invalid category. Must be "bridal", "engagement", "babyshower", "sider", or "karwa chauth"' }, { status: 400 });
      }

      let newUrl = existing.url;
      let newPublicId = existing.publicId;

      if (file) {
        if (typeof file.type !== 'string' || !file.type.startsWith('image/')) {
          return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResult = await new Promise<unknown>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'mahi_mehendi',
              allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
              quality: 'auto:good',
              fetch_format: 'auto',
              transformation: [
                {
                  width: 1920,
                  height: 1920,
                  crop: 'limit',
                  quality: 'auto:good',
                  fetch_format: 'auto',
                }
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });

        const record = uploadResult && typeof uploadResult === 'object' ? (uploadResult as Record<string, unknown>) : null;
        const secureUrl = record && typeof record['secure_url'] === 'string' ? (record['secure_url'] as string) : null;
        const publicId = record && typeof record['public_id'] === 'string' ? (record['public_id'] as string) : null;
        if (!secureUrl) return NextResponse.json({ error: 'Upload failed' }, { status: 500 });

        newUrl = secureUrl;
        newPublicId = publicId ?? undefined;

        if (existing.publicId) {
          try {
            await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'image' });
          } catch {}
        }
      }

      existing.url = newUrl;
      existing.publicId = newPublicId;
      existing.category = category as 'bridal' | 'engagement' | 'babyshower' | 'sider' | 'karwa chauth';
      existing.price = priceNum;
      await existing.save();

      return NextResponse.json({
        message: 'Updated',
        image: {
          _id: existing._id,
          url: existing.url,
          category: existing.category,
          price: existing.price,
          publicId: existing.publicId,
        },
      });
    } else {
      const body = (await request.json()) as Record<string, unknown>;
      const category = typeof body.category === 'string' ? body.category : existing.category;
      const priceStr = typeof body.price === 'string' || typeof body.price === 'number' ? String(body.price) : String(existing.price);
      const priceNum = parseFloat(priceStr);
      if (isNaN(priceNum) || priceNum < 0) {
        return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
      }
      if (category !== 'bridal' && category !== 'engagement' && category !== 'babyshower' && category !== 'sider' && category !== 'karwa chauth') {
        return NextResponse.json({ error: 'Invalid category. Must be "bridal", "engagement", "babyshower", "sider", or "karwa chauth"' }, { status: 400 });
      }
      existing.category = category as 'bridal' | 'engagement' | 'babyshower' | 'sider' | 'karwa chauth';
      existing.price = priceNum;
      await existing.save();
      return NextResponse.json({
        message: 'Updated',
        image: {
          _id: existing._id,
          url: existing.url,
          category: existing.category,
          price: existing.price,
          publicId: existing.publicId,
        },
      });
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to update image';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const existing = await ImageModel.findById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (existing.publicId) {
      try {
        await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'image' });
      } catch {}
    }

    await ImageModel.deleteOne({ _id: existing._id });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to delete image';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}