// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { sendTelegramMessageHTML } from '@/lib/telegram';

// escape for HTML parse_mode
function escapeHtml(s?: string) {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// simple occasion -> emoji map
const occasionEmojiMap: Record<string, string> = {
  bridal: '💍 Bridal',
  engagement: '💞 Engagement',
  babyshower: '🤰 Baby Shower',
  sider: '🎉 Sider',
  'karwa chauth': '🌙 Karwa Chauth',
};

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = (await request.json()) as Record<string, unknown>;

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const emailOrPhone = typeof body.emailOrPhone === 'string' ? body.emailOrPhone.trim() : '';
    const occasion = typeof body.occasion === 'string' ? body.occasion.trim() : '';
    const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !emailOrPhone || !occasion || !preferredDate || !message) {
      return NextResponse.json(
        { error: 'All fields are required: name, email/phone, occasion, preferred date, and message' },
        { status: 400 }
      );
    }

    const newContact = new Contact({
      name,
      emailOrPhone,
      occasion,
      preferredDate,
      message,
    });

    await newContact.save();

    // Build attractive HTML message
    const emojiOccasion = occasionEmojiMap[occasion] ?? escapeHtml(occasion);
    const createdAt = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    });

    const lines = [
      '✨ <b>New contact submitted</b> ✨',
      '',
      `<b>Name:</b> ${escapeHtml(name)}`,
      `<b>Contact:</b> ${escapeHtml(emailOrPhone)}`,
      `<b>Occasion:</b> ${escapeHtml(emojiOccasion)}`,
      `<b>Preferred Date:</b> ${escapeHtml(preferredDate)}`,
      `<b>Message:</b>\n<pre>${escapeHtml(message)}</pre>`,
      '',
      `— Received: <i>${escapeHtml(createdAt)}</i>`,
      `ID: <code>${escapeHtml(String(newContact._id))}</code>`,
    ];
    const text = lines.join('\n');

    // Inline button: Viewer link to admin (set ADMIN_URL env to your admin base URL)
    const adminBase = process.env.ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_URL || '';
    const viewUrl = adminBase ? `${adminBase.replace(/\/$/, '')}/contacts/${newContact._id}` : '';

    const keyboard = viewUrl
      ? [[{ text: '🔎 View in Admin', url: viewUrl }], [{ text: '✅ Mark processed (open admin)', url: viewUrl }]]
      : undefined;

    try {
      await sendTelegramMessageHTML({ text, replyKeyboard: keyboard });
    } catch (err) {
      console.error('Telegram send error', err);
    }

    return NextResponse.json(
      {
        message: 'Contact form submitted successfully! We will get back to you soon.',
        contact: {
          _id: newContact._id,
          name: newContact.name,
          occasion: newContact.occasion,
          createdAt: newContact.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    const errMsg = error instanceof Error ? error.message : 'Failed to submit contact form. Please try again.';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
