import { getSession } from '../../lib/session';

export default async function handler(req, res) {
  const session = await getSession(req);
  if (session && session.email) {
    res.json({ success: true, email: session.email });
  } else {
    res.json({ success: false });
  }
}