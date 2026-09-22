import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { COOKIE_NAME, SESSION_MAX_AGE_SEC, createSignedToken, verifyToken } from '@/lib/admin-auth';

// In-memory rate limiting tracker (per IP)
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return '127.0.0.1';
}

// Constant-time string equality check to mitigate timing side-channel attacks
function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * GET: Check if the current requester has a valid signed admin session cookie
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const { valid, email } = verifyToken(token);
  if (!valid) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email,
      role: 'admin',
    },
  });
}

/**
 * POST: Authenticate staff credentials with rate limiting and timing-attack resistance
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();

  const record = rateLimitMap.get(ip) || { attempts: 0, lockedUntil: 0 };

  // Check lockout
  if (record.lockedUntil > now) {
    const minutesLeft = Math.ceil((record.lockedUntil - now) / 60000);
    return NextResponse.json(
      {
        success: false,
        error: `Account temporarily locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`
      },
      { status: 429 }
    );
  }

  // If lockout expired, reset
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    record.attempts = 0;
    record.lockedUntil = 0;
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const configuredEmail = (process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || 'ecoblueenvironmentalservice@gmail.com').trim().toLowerCase();
    const configuredPassword = process.env.ADMIN_PASSWORD || '2012105086CiViL@';

    const inputEmail = String(email).trim().toLowerCase();
    const inputPassword = String(password);

    const emailMatch = timingSafeCompare(inputEmail, configuredEmail);
    const passwordMatch = timingSafeCompare(inputPassword, configuredPassword);

    if (!emailMatch || !passwordMatch) {
      record.attempts += 1;
      if (record.attempts >= MAX_ATTEMPTS) {
        record.lockedUntil = now + LOCKOUT_MS;
        rateLimitMap.set(ip, record);
        return NextResponse.json(
          {
            success: false,
            error: `Maximum login attempts exceeded. Access locked for 15 minutes.`
          },
          { status: 429 }
        );
      }
      rateLimitMap.set(ip, record);
      const remaining = MAX_ATTEMPTS - record.attempts;
      return NextResponse.json(
        {
          success: false,
          error: `Invalid credentials. ${remaining} attempt(s) remaining before security lockout.`
        },
        { status: 401 }
      );
    }

    // 2. Successful Login -> Clear Rate Limiting
    rateLimitMap.delete(ip);

    // 3. Issue Signed Token
    const token = createSignedToken(configuredEmail);
    const response = NextResponse.json(
      {
        success: true,
        message: 'Authentication successful.',
        user: { email: configuredEmail, role: 'admin' }
      },
      { status: 200 }
    );

    // Set secure, httpOnly cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_MAX_AGE_SEC
    });

    return response;
  } catch (error: any) {
    console.error('[Admin Auth Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error processing authentication.' },
      { status: error instanceof SyntaxError ? 400 : 500 }
    );
  }
}

/**
 * DELETE: Terminate administrative session and clear cookie
 */
export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully.' },
    { status: 200 }
  );

  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });

  return response;
}
