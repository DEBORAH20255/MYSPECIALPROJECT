import redis from './redis';
import { serialize, parse } from 'cookie';
import crypto from 'crypto';

const SESSION_NAME = 'sid';
const SESSION_TTL = 60 * 60 * 24; // 1 day in seconds

function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

export async function setSession(res, sessionData) {
  const sid = generateSessionId();
  await redis.setex(`sess:${sid}`, SESSION_TTL, JSON.stringify(sessionData));
  res.setHeader('Set-Cookie', serialize(SESSION_NAME, sid, {
    httpOnly: true,
    path: '/',
    maxAge: SESSION_TTL,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }));
}

export async function getSession(req) {
  const cookies = parse(req.headers.cookie || '');
  const sid = cookies[SESSION_NAME];
  if (!sid) return null;
  const data = await redis.get(`sess:${sid}`);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function clearSession(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const sid = cookies[SESSION_NAME];
  if (sid) {
    await redis.del(`sess:${sid}`);
  }
  res.setHeader('Set-Cookie', serialize(SESSION_NAME, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }));
}