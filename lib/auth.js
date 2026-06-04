import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'vilmagourmet_session';

function secret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'troque-essa-chave';
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export function createSessionValue(email) {
  const payload = JSON.stringify({ email, time: Date.now() });
  const encoded = Buffer.from(payload).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionValue(value) {
  if (!value || !value.includes('.')) return false;

  const [encoded, signature] = value.split('.');
  const expected = sign(encoded);

  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!crypto.timingSafeEqual(a, b)) return false;

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    const maxAge = 1000 * 60 * 60 * 12;
    return Date.now() - payload.time < maxAge;
  } catch {
    return false;
  }
}

export function isAuthenticated() {
  const session = cookies().get(COOKIE_NAME)?.value;
  return verifySessionValue(session);
}

export function cookieName() {
  return COOKIE_NAME;
}
