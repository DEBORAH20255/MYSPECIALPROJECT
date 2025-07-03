export default function handler(req, res) {
  if (req.method === "POST") {
    // You can access req.body for the posted data
    const { email, password, provider } = req.body;
    // Replace this with your real authentication logic!
    if (email && password && provider) {
      // Simulate login success
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      res.status(400).json({ success: false, message: "Missing fields" });
    }
  } else {
    // Method Not Allowed
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}