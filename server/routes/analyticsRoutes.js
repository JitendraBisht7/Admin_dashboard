import express from "express";
import * as analyticsController from "../controllers/analyticsController.js";

const router = express.Router();

// GET /api/analytics/weekly-summary - Get weekly summary
router.get("/weekly-summary", analyticsController.getWeeklySummary);

// GET /api/analytics/daily-activity - Get daily activity
router.get("/daily-activity", analyticsController.getDailyActivity);

// GET /api/analytics/insights - Get insights summary
router.get("/insights", analyticsController.getInsights);

// GET /api/analytics/ai-pulse - Get AI Pulse Summary
router.get("/ai-pulse", analyticsController.getAIPulse);

export default router;
