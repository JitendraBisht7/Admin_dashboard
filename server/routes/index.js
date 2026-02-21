import express from "express";
import teacherRoutes from "./teacherRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

console.log("[Routes] Loading routes...");
console.log("[Routes] teacherRoutes:", typeof teacherRoutes);
console.log("[Routes] analyticsRoutes:", typeof analyticsRoutes);
console.log("[Routes] adminRoutes:", typeof adminRoutes);

// Health check route
router.get("/", (req, res) => {
  res.json({ status: "Teacher Insights API running" });
});

// Mount route handlers
router.use("/teachers", teacherRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/admin", adminRoutes);

console.log("[Routes] All routes mounted successfully");

export default router;
