import { getSession } from "../../lib/session";

export default async function handler(req, res) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/session=([a-zA-Z0-9-]+)/);
  if (!match) {
    return res.status(401).json({ success: false, message: "No session" });
  }
  const sessionId = match[1];
  const email = await getSession(sessionId);
  if (!email) {
    return res.status(401).json({ success: false, message: "Invalid session" });
  }
  return res.status(200).json({ success: true, email });
}