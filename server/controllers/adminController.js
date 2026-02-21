import fs from "fs";

export function login(req, res) {
  const { adminId, password } = req.body || {};

  // Be extra careful with env vars - trim and fallback to defaults
  const expectedId = (process.env.ADMIN_ID || "admin").trim();
  const expectedPassword = (process.env.ADMIN_PASSWORD || "password").trim();

  const receivedId = (adminId || "").trim();
  const receivedPassword = (password || "").trim();

  // Log only the attempt (don't log password in production, but okay for this debug phase)
  const timestamp = new Date().toISOString();
  const logData = `[${timestamp}] Login attempt: id="${receivedId}" | Success: ${receivedId === expectedId && receivedPassword === expectedPassword}\n`;

  try {
    fs.appendFileSync("debug.log", logData);
  } catch (err) {
    console.error("Failed to write to debug.log", err);
  }

  if (!receivedId || !receivedPassword) {
    return res.status(400).json({ success: false, message: "Admin ID and Password are required" });
  }

  if (receivedId === expectedId && receivedPassword === expectedPassword) {
    return res.json({ success: true, message: "Login successful" });
  }

  // Generic message for security, but we know it's a mismatch
  return res.status(401).json({ success: false, message: "Invalid Admin ID or Password" });
}
