import Activity from "../models/Activity.js";
import { getWeekStart } from "../utils/dateHelpers.js";

/**
 * Get aggregated data for all teachers
 * @returns {Promise<Array>} Array of teacher objects with aggregated statistics
 */
export async function getAllTeachers() {
  const teachers = await Activity.distinct("Teacher_id");
  
  const teacherData = await Promise.all(
    teachers.map(async (teacherId) => {
      const activities = await Activity.find({ Teacher_id: teacherId }).lean();
      
      if (activities.length === 0) return null;
      
      return aggregateTeacherData(teacherId, activities);
    })
  );
  
  const filtered = teacherData.filter((t) => t !== null);
  filtered.sort((a, b) => a.name.localeCompare(b.name));
  
  return filtered;
}

/**
 * Get aggregated data for a single teacher
 * @param {string} teacherId - Teacher ID
 * @returns {Promise<Object|null>} Teacher object with aggregated statistics or null if not found
 */
export async function getTeacherById(teacherId) {
  const activities = await Activity.find({ Teacher_id: teacherId }).lean();
  
  if (activities.length === 0) {
    return null;
  }
  
  return aggregateTeacherData(teacherId, activities);
}

/**
 * Aggregate teacher data from activities
 * @param {string} teacherId - Teacher ID
 * @param {Array} activities - Array of activity documents
 * @returns {Object} Aggregated teacher data
 */
function aggregateTeacherData(teacherId, activities) {
  const firstActivity = activities[0];
  const teacherName = firstActivity.Teacher_name;
  const subject = firstActivity.Subject;
  
  // Count activities by type
  let totalLessons = 0;
  let totalQuizzes = 0;
  let totalAssessments = 0;
  
  // Group by week for weekly activity
  const weeklyMap = new Map();
  
  activities.forEach((activity) => {
    // Count totals
    if (activity.Activity_type === "Lesson Plan") {
      totalLessons++;
    } else if (activity.Activity_type === "Quiz") {
      totalQuizzes++;
    } else if (activity.Activity_type === "Question Paper") {
      totalAssessments++;
    }
    
    // Group by week
    const weekStart = getWeekStart(activity.Created_at);
    const weekKey = weekStart.toISOString();
    
    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, {
        weekStart: weekStart,
        lessonsCreated: 0,
        quizzesCreated: 0,
        assessmentsCreated: 0,
      });
    }
    
    const weekData = weeklyMap.get(weekKey);
    if (activity.Activity_type === "Lesson Plan") {
      weekData.lessonsCreated++;
    } else if (activity.Activity_type === "Quiz") {
      weekData.quizzesCreated++;
    } else if (activity.Activity_type === "Question Paper") {
      weekData.assessmentsCreated++;
    }
  });
  
  const weeklyActivity = Array.from(weeklyMap.values()).sort(
    (a, b) => new Date(a.weekStart) - new Date(b.weekStart)
  );
  
  return {
    _id: teacherId,
    name: teacherName,
    subject: subject,
    totalLessons,
    totalQuizzes,
    totalAssessments,
    weeklyActivity,
  };
}
