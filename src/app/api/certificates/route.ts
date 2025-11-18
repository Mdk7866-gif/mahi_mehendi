import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Certificate from '@/models/Certificate';

export async function GET() {
  try {
    await connectDB();
    const certificates = await Certificate.find({})
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    // Transform to ensure consistent format
    const formatted = certificates.map((cert: Record<string, unknown>) => ({
      _id: (cert._id as { toString: () => string }).toString(),
      name: String(cert.name || ''),
      courseName: String(cert.courseName || 'Professional Mehendi Course'),
      completionDate: cert.completionDate instanceof Date 
        ? cert.completionDate.toISOString().split('T')[0]
        : String(cert.completionDate || ''),
      pdfUrl: String(cert.pdfUrl || ''),
      certificateNumber: String(cert.certificateNumber || ''),
      createdAt: cert.createdAt ? new Date(cert.createdAt as Date | string).toISOString() : new Date().toISOString(),
    }));
    
    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error('Fetch certificates error:', err);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}