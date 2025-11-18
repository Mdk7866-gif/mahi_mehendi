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
    const formatted = certificates.map((cert: any) => ({
      _id: cert._id.toString(),
      name: cert.name,
      courseName: cert.courseName || 'Professional Mehendi Course',
      completionDate: cert.completionDate instanceof Date 
        ? cert.completionDate.toISOString().split('T')[0]
        : cert.completionDate,
      pdfUrl: cert.pdfUrl || '',
      certificateNumber: cert.certificateNumber || '',
      createdAt: cert.createdAt ? new Date(cert.createdAt).toISOString() : new Date().toISOString(),
    }));
    
    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error('Fetch certificates error:', err);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}