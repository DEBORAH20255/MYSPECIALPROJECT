import { setSession } from '../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { email, password, provider } = req.body;

  // TODO: Add your authentication logic here
  if (email === 'user@example.com' && password === 'password123' && provider) {
    // Save session (set a cookie and store session in Redis)
    await setSession(res, { email });
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
}