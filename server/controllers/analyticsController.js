import * as analyticsService from "../services/analyticsService.js";

/**
 * Get weekly summary across all teachers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getWeeklySummary(req, res) {
  try {
    const summary = await analyticsService.getWeeklySummary();
    res.json(summary);
  } catch (err) {
    console.error("Error fetching weekly summary:", err);
    res.status(500).json({ message: "Failed to fetch weekly summary" });
  }
}

/**
 * Get daily activity for current week
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getDailyActivity(req, res) {
  try {
    const { period = "week", grade, subject } = req.query;
    const dailyActivity = await analyticsService.getDailyActivity(period, grade, subject);
    res.json(dailyActivity);
  } catch (err) {
    console.error("Error fetching daily activity:", err);
    res.status(500).json({ message: "Failed to fetch daily activity" });
  }
}

/**
 * Get insights summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getInsights(req, res) {
  try {
    const { period = "week", grade, subject } = req.query;
    const insights = await analyticsService.getInsights(period, grade, subject);
    res.json(insights);
  } catch (err) {
    console.error("Error fetching insights:", err);
    res.status(500).json({ message: "Failed to fetch insights" });
  }
}

/**
 * Get AI Pulse Summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getAIPulse(req, res) {
  try {
    const insights = await analyticsService.getAIPulse();
    res.json(insights);
  } catch (err) {
    console.error("Error fetching AI pulse:", err);
    res.status(500).json({ message: "Failed to fetch AI pulse" });
  }
}
