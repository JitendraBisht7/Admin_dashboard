/**
 * Get start of week (Monday) for a given date
 * @param {Date} date - The date to get week start for
 * @returns {Date} - Start of week (Monday) at 00:00:00
 */
export function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get start of day for a given date
 * @param {Date} date - The date to get day start for
 * @returns {Date} - Start of day at 00:00:00
 */
export function getDayStart(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get date range for a time period
 * @param {string} period - Time period: "week", "month", or "year"
 * @returns {Date} - Start date for the period
 */
export function getPeriodStartDate(period) {
  const startDate = new Date();
  
  if (period === "week") {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === "month") {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (period === "year") {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }
  
  startDate.setHours(0, 0, 0, 0);
  return startDate;
}
