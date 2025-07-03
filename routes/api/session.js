import redis from "../../redis-client.js";

function getSessionKey(token) {
  return `session:${token}`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  if (!redis) {
    return res.status(500).json({
      success: false,
      message: "Redis client not initialized",
    });
  }

  // Parse cookies from the request headers
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => {
        const index = c.indexOf("=");
        if (index < 0) return [];
        return [c.slice(0, index).trim(), c.slice(index + 1).trim()];
      })
      .filter((pair) => pair.length === 2)
  );

  const sessionToken = cookies.session;

  if (!sessionToken) {
    return res.status(401).json({
      success: false,
      message: "No session cookie found",
    });
  }

  try {
    const email = await redis.get(getSessionKey(sessionToken));

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session",
      });
    }

    return res.status(200).json({
      success: true,
      email,
    });
  } catch (err) {
    console.error("Redis error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}