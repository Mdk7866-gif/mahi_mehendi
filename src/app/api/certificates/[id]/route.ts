import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Certificate from '@/models/Certificate';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Delete from Cloudinary if pdfUrl exists
    if (certificate.pdfUrl) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = certificate.pdfUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.replace(/\.pdf$/, '').split('.')[0];
        const folder = urlParts.slice(-2, -1)[0];
        const fullPublicId = folder ? `${folder}/${publicId}` : publicId;
        
        await cloudinary.uploader.destroy(fullPublicId, { resource_type: 'raw' });
      } catch (cloudErr) {
        console.warn('Cloudinary delete failed:', cloudErr);
        // Continue with DB delete even if Cloudinary delete fails
      }
    }

    await Certificate.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Delete certificate error:', err);
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}