// src/app/api/generate-certificate/route.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp'; // For auto-correcting image orientation

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Parse incoming multipart/form-data
    const form = await req.formData();
    const name = (form.get('name') as string) || 'Learner Name';
    const courseName = (form.get('courseName') as string) || 'Course Name';
    const completionDate = (form.get('completionDate') as string) || new Date().toLocaleDateString();

    // Photo from formData (may be null)
    const photo = form.get('photo') as Blob | null;

    // Create a new PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([1224, 792]); // Landscape A4-like dimensions (px)
    const { width, height } = page.getSize();

    // Background (soft cream)
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.99, 0.97, 0.95),
    });

    // Draw decorative border
    const borderPadding = 36;
    page.drawRectangle({
      x: borderPadding,
      y: borderPadding,
      width: width - borderPadding * 2,
      height: height - borderPadding * 2,
      borderColor: rgb(0.9, 0.6, 0.1),
      borderWidth: 6,
      color: undefined,
    });

    // Inner decorative border
    page.drawRectangle({
      x: borderPadding + 12,
      y: borderPadding + 12,
      width: width - (borderPadding + 12) * 2,
      height: height - (borderPadding + 12) * 2,
      borderColor: rgb(0.85, 0.7, 0.3),
      borderWidth: 2,
      color: undefined,
    });

    // Load fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Title: Certificate of Completion
    const title = 'Certificate of Completion';
    const titleSize = 42;
    const titleWidth = fontBold.widthOfTextAtSize(title, titleSize);
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y: height - 130,
      size: titleSize,
      font: fontBold,
      color: rgb(0.42, 0.16, 0.08),
    });

    // Decorative line under title
    page.drawLine({
      start: { x: width / 2 - 150, y: height - 145 },
      end: { x: width / 2 + 150, y: height - 145 },
      thickness: 2,
      color: rgb(0.9, 0.6, 0.1),
    });

    // Subtitle / awarding line
    const awardedLine = 'This certificate is proudly presented to';
    const awardedSize = 14;
    const awardedWidth = font.widthOfTextAtSize(awardedLine, awardedSize);
    page.drawText(awardedLine, {
      x: (width - awardedWidth) / 2,
      y: height - 190,
      size: awardedSize,
      font,
      color: rgb(0.25, 0.13, 0.06),
    });

    // Learner name (prominent)
    const nameSize = 32;
    const nameWidth = fontBold.widthOfTextAtSize(name, nameSize);
    page.drawText(name, {
      x: (width - nameWidth) / 2,
      y: height - 240,
      size: nameSize,
      font: fontBold,
      color: rgb(0.12, 0.08, 0.04),
    });

    // Name underline
    page.drawLine({
      start: { x: width / 2 - nameWidth / 2 - 20, y: height - 250 },
      end: { x: width / 2 + nameWidth / 2 + 20, y: height - 250 },
      thickness: 1.5,
      color: rgb(0.85, 0.7, 0.3),
    });

    // Course completion text
    const courseText = `For successfully completing the`;
    const courseSize = 13;
    const courseWidth = font.widthOfTextAtSize(courseText, courseSize);
    page.drawText(courseText, {
      x: (width - courseWidth) / 2,
      y: height - 290,
      size: courseSize,
      font,
      color: rgb(0.2, 0.1, 0.05),
    });

    // Course name (prominent)
    const courseNameSize = 18;
    const courseNameWidth = fontBold.widthOfTextAtSize(courseName, courseNameSize);
    page.drawText(courseName, {
      x: (width - courseNameWidth) / 2,
      y: height - 320,
      size: courseNameSize,
      font: fontBold,
      color: rgb(0.42, 0.16, 0.08),
    });

    // Achievement text
    const achievementText = 'Demonstrating dedication, creativity, and mastery';
    const achievementSize = 12;
    const achievementWidth = fontItalic.widthOfTextAtSize(achievementText, achievementSize);
    page.drawText(achievementText, {
      x: (width - achievementWidth) / 2,
      y: height - 350,
      size: achievementSize,
      font: fontItalic,
      color: rgb(0.3, 0.15, 0.07),
    });

    // Additional achievement line
    const achievement2 = 'in the art of elegant henna design';
    const achievement2Width = fontItalic.widthOfTextAtSize(achievement2, achievementSize);
    page.drawText(achievement2, {
      x: (width - achievement2Width) / 2,
      y: height - 370,
      size: achievementSize,
      font: fontItalic,
      color: rgb(0.3, 0.15, 0.07),
    });

    // Recognition statement
    const recognitionText = 'This achievement represents hours of dedicated practice, attention to detail,';
    const recognitionSize = 10;
    const recognitionWidth = font.widthOfTextAtSize(recognitionText, recognitionSize);
    page.drawText(recognitionText, {
      x: (width - recognitionWidth) / 2,
      y: height - 410,
      size: recognitionSize,
      font,
      color: rgb(0.35, 0.17, 0.08),
    });

    const recognition2 = 'and a commitment to preserving the timeless tradition of mehendi artistry.';
    const recognition2Width = font.widthOfTextAtSize(recognition2, recognitionSize);
    page.drawText(recognition2, {
      x: (width - recognition2Width) / 2,
      y: height - 425,
      size: recognitionSize,
      font,
      color: rgb(0.35, 0.17, 0.08),
    });

    // Completion date (bottom-left)
    const dateLabel = 'Date of Completion';
    page.drawText(dateLabel, {
      x: borderPadding + 40,
      y: borderPadding + 75,
      size: 10,
      font,
      color: rgb(0.3, 0.15, 0.07),
    });

    const dateText = completionDate;
    page.drawText(dateText, {
      x: borderPadding + 40,
      y: borderPadding + 50,
      size: 13,
      font: fontBold,
      color: rgb(0.15, 0.07, 0.03),
    });

    // Date signature line
    page.drawLine({
      start: { x: borderPadding + 36, y: borderPadding + 45 },
      end: { x: borderPadding + 180, y: borderPadding + 45 },
      thickness: 1,
      color: rgb(0.2, 0.1, 0.05),
    });

    // Instructor signature section (bottom-right)
    const sigLabel = 'Instructor Signature';
    const sigLabelSize = 10;
    page.drawText(sigLabel, {
      x: width - borderPadding - 190,
      y: borderPadding + 75,
      size: sigLabelSize,
      font,
      color: rgb(0.3, 0.15, 0.07),
    });

    const instructorName = 'Mahi Mehendi';
    const instructorSize = 13;
    const instructorWidth = fontBold.widthOfTextAtSize(instructorName, instructorSize);
    page.drawText(instructorName, {
      x: width - borderPadding - 40 - instructorWidth,
      y: borderPadding + 50,
      size: instructorSize,
      font: fontBold,
      color: rgb(0.15, 0.07, 0.03),
    });

    // Signature line
    page.drawLine({
      start: { x: width - borderPadding - 200, y: borderPadding + 45 },
      end: { x: width - borderPadding - 36, y: borderPadding + 45 },
      thickness: 1,
      color: rgb(0.2, 0.1, 0.05),
    });

    // If a photo was uploaded, process it with Sharp to auto-correct orientation, then embed
    if (photo && (photo.size ?? 0) > 0) {
      const arrayBuffer = await photo.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      let embeddedImage;
      try {
        // Use Sharp to auto-rotate based on EXIF (removes orientation tag after correction)
        const correctedBuffer = await sharp(bytes)
          .rotate() // Auto-corrects orientation
          .toBuffer();

        const mime = (photo as Blob).type || '';
        if (mime.includes('png')) {
          embeddedImage = await pdfDoc.embedPng(correctedBuffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(correctedBuffer);
        }
      } catch (err) {
        console.warn('Image processing failed:', err);
        embeddedImage = undefined;
      }

      if (embeddedImage) {
        const imgDims = embeddedImage.scale(1);

        // Base target dimensions (now with corrected image, no need for rotation logic)
        const targetW = 180;
        const targetH = (imgDims.height / imgDims.width) * targetW;

        // Position for frame (fixed, no orientation adjustments needed)
        const frameX = width - borderPadding - targetW - 50;
        const frameY = height - borderPadding - targetH - 130;
        const frameW = targetW;
        const frameH = targetH;

        // Draw decorative frame around photo
        page.drawRectangle({
          x: frameX - 6,
          y: frameY - 6,
          width: frameW + 12,
          height: frameH + 12,
          borderColor: rgb(0.9, 0.6, 0.1),
          borderWidth: 3,
        });

        // Draw the image (no rotation needed – Sharp fixed it)
        page.drawImage(embeddedImage, {
          x: frameX,
          y: frameY,
          width: targetW,
          height: targetH,
        });

        // Label under image
        const label = 'Certificate Holder';
        const labelW = font.widthOfTextAtSize(label, 10);
        page.drawText(label, {
          x: frameX + (frameW - labelW) / 2,
          y: frameY - 20,
          size: 10,
          font,
          color: rgb(0.2, 0.1, 0.05),
        });
      }
    } else {
      // Draw placeholder box for photo
      const targetW = 180;
      const targetH = 180;
      const imgX = width - borderPadding - targetW - 50;
      const imgY = height - borderPadding - targetH - 130;

      // Decorative frame
      page.drawRectangle({
        x: imgX - 6,
        y: imgY - 6,
        width: targetW + 12,
        height: targetH + 12,
        borderColor: rgb(0.9, 0.6, 0.1),
        borderWidth: 3,
      });

      page.drawRectangle({
        x: imgX,
        y: imgY,
        width: targetW,
        height: targetH,
        borderColor: rgb(0.85, 0.82, 0.8),
        borderWidth: 2,
        color: rgb(0.98, 0.96, 0.94),
      });

      const hint = 'Photo';
      const hintW = font.widthOfTextAtSize(hint, 14);
      page.drawText(hint, {
        x: imgX + (targetW - hintW) / 2,
        y: imgY + targetH / 2 - 7,
        size: 14,
        font,
        color: rgb(0.6, 0.55, 0.5),
      });
    }

    // Brand footer with enhanced styling
    const brand = 'Mahi Mehendi - Elegant Henna Designs for Every Occasion';
    const brandSize = 10;
    const brandW = font.widthOfTextAtSize(brand, brandSize);
    page.drawText(brand, {
      x: (width - brandW) / 2,
      y: borderPadding + 18,
      size: brandSize,
      font: fontBold,
      color: rgb(0.42, 0.16, 0.08),
    });

    const contact = 'mahi.mehendi@gmail.com';
    const contactW = font.widthOfTextAtSize(contact, 9);
    page.drawText(contact, {
      x: (width - contactW) / 2,
      y: borderPadding + 5,
      size: 9,
      font,
      color: rgb(0.4, 0.2, 0.1),
    });

    // Finalize PDF
    const pdfBytes = await pdfDoc.save();

    // Set filename (safe sanitized)
    const safeName = name.replace(/[^a-z0-9_\- ]/gi, '').replace(/\s+/g, '-');
    const filename = `Mahi-Mehendi-Certificate-${safeName || 'certificate'}.pdf`;

    return new Response(pdfBytes as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(pdfBytes.length),
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('Certificate generation error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate certificate', detail: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}