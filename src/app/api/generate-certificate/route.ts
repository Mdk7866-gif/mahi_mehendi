import { NextResponse } from 'next/server';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import Certificate from '@/models/Certificate';
import mongoose from 'mongoose';
import path from 'path';
import { readFile } from 'fs/promises';
import type { UploadApiResponse } from 'cloudinary';

// Connect MongoDB (add your URI in .env)
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type AssetCache = {
  greatVibes: Uint8Array;
  playfair: Uint8Array;
  playfairBold: Uint8Array;
  borderImage: Uint8Array;
};

let cachedAssets: AssetCache | null = null;

const loadAssets = async (): Promise<AssetCache> => {
  if (cachedAssets) return cachedAssets;

  const fontsDir = path.join(process.cwd(), 'src', 'lib', 'fonts');
  const publicDir = path.join(process.cwd(), 'public');

  const [greatVibes, playfair, playfairBold, borderImage] = await Promise.all([
    readFile(path.join(fontsDir, 'GreatVibes-Regular.ttf')),
    readFile(path.join(fontsDir, 'PlayfairDisplay-Regular.ttf')),
    readFile(path.join(fontsDir, 'PlayfairDisplay-Bold.ttf')),
    readFile(path.join(publicDir, 'mehndi-border.png')),
  ]);

  cachedAssets = { greatVibes, playfair, playfairBold, borderImage };
  return cachedAssets;
};

const uploadCertificatePhoto = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'mehendi-certificates/students',
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary upload failed'));
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
};

export async function POST(req: Request) {
  await connectDB();

  const contentType = req.headers.get('content-type') ?? '';

  let name: string | null = null;
  let courseName: string | null = null;
  let completionDate: string | null = null;
  let photoUrl: string | null = null;
  let photoBuffer: Buffer | null = null;
  let photoMime: string | null = null;

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    name = (formData.get('name') as string | null)?.trim() ?? null;
    courseName = (formData.get('courseName') as string | null)?.trim() ?? null;
    completionDate = (formData.get('completionDate') as string | null)?.trim() ?? null;
    const file = formData.get('photo');
    if (file && file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      photoBuffer = Buffer.from(arrayBuffer);
      photoMime = file.type || 'image/jpeg';
      const uploaded = await uploadCertificatePhoto(photoBuffer);
      photoUrl = uploaded.secure_url ?? null;
    }
  } else {
    const body = await req.json();
    name = typeof body.name === 'string' ? body.name : null;
    courseName = typeof body.courseName === 'string' ? body.courseName : null;
    completionDate = typeof body.completionDate === 'string' ? body.completionDate : null;
    photoUrl = typeof body.photoUrl === 'string' ? body.photoUrl : null;
  }

  if (!name || !completionDate || (!photoUrl && !photoBuffer)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const assets = await loadAssets();

  const certificateNumber = uuidv4().slice(0, 8).toUpperCase();

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const greatVibesFont = await pdfDoc.embedFont(assets.greatVibes);
  const playfairFont = await pdfDoc.embedFont(assets.playfair);
  const playfairBoldFont = await pdfDoc.embedFont(assets.playfairBold);

  let photoBytes: Uint8Array;
  let detectedMime = photoMime ?? '';

  if (photoBuffer) {
    photoBytes = new Uint8Array(photoBuffer);
  } else {
    const photoResponse = await fetch(photoUrl!);
    if (!photoResponse.ok) {
      return NextResponse.json({ error: 'Unable to fetch photo' }, { status: 400 });
    }
    const photoArrayBuffer = await photoResponse.arrayBuffer();
    photoBytes = new Uint8Array(photoArrayBuffer);
    detectedMime = photoResponse.headers.get('content-type') ?? '';
  }

  const photoImage = detectedMime.includes('png')
    ? await pdfDoc.embedPng(photoBytes)
    : await pdfDoc.embedJpg(photoBytes);

  const borderImg = await pdfDoc.embedPng(assets.borderImage);

  const page = pdfDoc.addPage([842, 595]); // A4 landscape for premium feel
  const { width, height } = page.getSize();

  // Subtle beige background
  page.drawRectangle({
    x: 0, y: 0, width, height,
    color: rgb(0.98, 0.95, 0.90),
  });

  // Watermark mehendi pattern (very light)
  page.drawImage(borderImg, {
    x: width / 2 - 200,
    y: height / 2 - 200,
    width: 400,
    height: 400,
    opacity: 0.07,
  });

  // Mehendi corner borders (four corners)
  const cornerSize = 150;
  page.drawImage(borderImg, { x: 30, y: height - cornerSize - 30, width: cornerSize, height: cornerSize });
  page.drawImage(borderImg, { x: width - cornerSize - 30, y: height - cornerSize - 30, width: cornerSize, height: cornerSize, rotate: degrees(90) });
  page.drawImage(borderImg, { x: width - cornerSize - 30, y: 30, width: cornerSize, height: cornerSize, rotate: degrees(180) });
  page.drawImage(borderImg, { x: 30, y: 30, width: cornerSize, height: cornerSize, rotate: degrees(270) });

  // Title
  page.drawText('Certificate of Completion', {
    x: width / 2 - 220,
    y: height - 140,
    size: 48,
    font: greatVibesFont,
    color: rgb(0.6, 0.3, 0.1), // maroon-brown
  });

  // Proudly Awarded To
  page.drawText('This is to certify that', {
    x: width / 2 - 140,
    y: height - 210,
    size: 24,
    font: playfairFont,
    color: rgb(0.4, 0.2, 0),
  });

  // Learner's Name - BIG & CURSIVE
  page.drawText(name, {
    x: width / 2 - greatVibesFont.widthOfTextAtSize(name, 72) / 2,
    y: height - 280,
    size: 72,
    font: greatVibesFont,
    color: rgb(0.72, 0.45, 0.20), // golden-maroon
  });

  // Course
  page.drawText(`has successfully completed the`, {
    x: width / 2 - 160,
    y: height - 340,
    size: 20,
    font: playfairFont,
    color: rgb(0.3, 0.1, 0.1),
  });

  page.drawText(courseName || 'Professional Mehendi Artistry Course', {
    x: width / 2 - 220,
    y: height - 380,
    size: 28,
    font: playfairBoldFont,
    color: rgb(0.6, 0.3, 0.1),
  });

  page.drawText(`on ${new Date(completionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, {
    x: width / 2 - 160,
    y: height - 430,
    size: 20,
    font: playfairFont,
    color: rgb(0.3, 0.1, 0.1),
  });

  // Circular Photo with golden border
  const photoSize = 150;
  page.drawEllipse({
    x: width / 2,
    y: height / 2 + 50,
    xScale: photoSize / 2,
    yScale: photoSize / 2,
    borderColor: rgb(0.8, 0.6, 0.2),
    borderWidth: 8,
  });
  page.drawImage(photoImage, {
    x: width / 2 - photoSize / 2,
    y: height / 2 + 50 - photoSize / 2,
    width: photoSize,
    height: photoSize,
  });

  // Signature
  page.drawText('Mahi Mehendi Artistry', {
    x: width / 2 + 100,
    y: height / 2 - 120,
    size: 36,
    font: greatVibesFont,
    color: rgb(0.6, 0.3, 0.1),
  });
  page.drawLine({
    start: { x: width / 2 + 80, y: height / 2 - 130 },
    end: { x: width / 2 + 300, y: height / 2 - 130 },
    thickness: 2,
    color: rgb(0.4, 0.2, 0.1),
  });

  // Certificate Number
  page.drawText(`Certificate No: ${certificateNumber}`, {
    x: 60,
    y: 60,
    size: 14,
    font: playfairFont,
    color: rgb(0.5, 0.3, 0.1),
  });

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);

  // Bonus: Upload PDF to Cloudinary + Save to DB
  const pdfBase64 = pdfBuffer.toString('base64');
  const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;
  const uploadRes = await cloudinary.uploader.upload(pdfDataUri, {
    folder: 'mehendi-certificates',
    public_id: `certificate-${certificateNumber}`,
    resource_type: 'raw',
  });

  await Certificate.create({
    certificateNumber,
    name,
    courseName: courseName || 'Professional Mehendi Course',
    completionDate,
    photoUrl: photoUrl ?? '',
    pdfUrl: uploadRes.secure_url,
  });

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Mahi-Mehendi-Certificate-${name.replace(/\s+/g, '-')}.pdf"`,
    },
  });
}