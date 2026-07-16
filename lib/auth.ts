// A lightweight, dependency-free admin session system using signed cookies.
// Works both in Next.js API routes and in Edge middleware because it only
// uses the standard Web Crypto API (available in both environments).

const encoder = new TextEncoder();

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.SESSION_SECRET || 'change-this-secret';
  const expires = Date.now() + 1000 * 60 * 60 * 8; // 8 hours
  const payload = `admin:${expires}`;
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return `${payload}:${toHex(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(':');
  if (parts.length !== 3) return false;
  const [role, expires, signatureHex] = parts;
  if (Date.now() > Number(expires)) return false;
  const secret = process.env.SESSION_SECRET || 'change-this-secret';
  const payload = `${role}:${expires}`;
  const key = await getKey(secret);
  const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toHex(expectedSignature) === signatureHex;
}
