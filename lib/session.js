import { randomUUID } from "crypto";
import redis from "./redis";

const SESSION_PREFIX = "session:";

export async function createSession(email) {
  const sessionId = randomUUID();
  await redis.set(`${SESSION_PREFIX}${sessionId}`, email, { ex: 60 * 60 * 24 * 30 }); // 30 days
  return sessionId;
}

export async function getSession(sessionId) {
  if (!sessionId) return null;
  return await redis.get(`${SESSION_PREFIX}${sessionId}`);
}