import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Logging middleware
app.use((req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
  fs.appendFileSync("debug.log", log);
  next();
});

// Middleware
app.use(cors());
console.log("[App] CORS middleware added");
app.use(express.json());
console.log("[App] JSON middleware added");

// Routes
console.log("[App] About to mount routes, routes type:", typeof routes);
app.use("/api", routes);
console.log("[App] Routes mounted successfully");

// Admin login route (direct)
app.post("/api/admin/login", (req, res) => {
  const { adminId, password } = req.body || {};

  const expectedId = (process.env.ADMIN_ID || "admin").trim();
  const expectedPassword = (process.env.ADMIN_PASSWORD || "password").trim();

  const receivedId = (adminId || "").trim();
  const receivedPassword = (password || "").trim();

  if (!receivedId || !receivedPassword) {
    return res.status(400).json({ success: false, message: "Admin ID and Password are required" });
  }

  if (receivedId === expectedId && receivedPassword === expectedPassword) {
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid Admin ID or Password" });
});

// simple health route for admin auth check
app.get("/api/admin/login/ping", (req, res) => res.json({ ok: true }));
console.log("[App] Ping route added");

// Database connection and server startup
async function start() {
  try {
    const mongoUri = process.env.MONGO_URL;
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
