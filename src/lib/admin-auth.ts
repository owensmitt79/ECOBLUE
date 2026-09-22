import { NextRequest } from 'next/server';
import crypto from 'crypto';

export const COOKIE_NAME = 'ecoblue_admin_token';
export const SESSION_MAX_AGE_SEC = 8 * 60 * 60; // 8 hours

export function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('WARNING: ADMIN_SESSION_SECRET is not set in production. Using temporary fallback.');
    }
    return 'ecoblue-admin-temp-session-secret-change-in-env-production';
  }
  return secret;
}

// Generate an HMAC signed session token
export function createSignedToken(email: string): string {
  const payload = JSON.stringify({
    email,
    role: 'admin',
    exp: Date.now() + SESSION_MAX_AGE_SEC * 1000
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

// Verify HMAC signed session token
export function verifyToken(token: string): { valid: boolean; email?: string } {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return { valid: false };

    const expectedSignature = crypto
      .createHmac('sha256', getSessionSecret())
      .update(encodedPayload)
      .digest('base64url');

    // Timing-safe signature comparison
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Date.now()) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

// Helper to check authentication on any incoming NextRequest
export function isAdminAuthenticated(req: NextRequest): { authenticated: boolean; email?: string } {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return { authenticated: false };
  const verified = verifyToken(token);
  return { authenticated: verified.valid, email: verified.email };
}
