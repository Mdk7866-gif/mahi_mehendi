import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_COOKIE_NAME = 'mahi_admin_token';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '174216';
const COOKIE_SALT = process.env.ADMIN_COOKIE_SALT || 'mahi_mehendi_salt';
const isProd = process.env.NODE_ENV === 'production';

const expectedToken = crypto.createHash('sha256').update(`${ADMIN_PASSWORD}:${COOKIE_SALT}`).digest('hex');

const isValidSession = (value: string | undefined): boolean => {
  if (!value) return false;
  return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expectedToken));
};

export async function GET() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return NextResponse.json({ authenticated: isValidSession(token) });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = typeof body?.password === 'string' ? body.password : '';

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const res = NextResponse.json({ authenticated: true });
    res.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: expectedToken,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: isProd,
      maxAge: 60 * 60 * 6, // 6 hours
    });
    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Unable to process request' }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    expires: new Date(0),
    path: '/',
  });
  return res;
}

