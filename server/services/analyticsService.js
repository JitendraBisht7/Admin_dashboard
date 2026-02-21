import Activity from "../models/Activity.js";
import { getWeekStart, getDayStart, getPeriodStartDate } from "../utils/dateHelpers.js";

/**
 * Get weekly summary across all teachers
 * @returns {Promise<Array>} Array of weekly summary objects
 */
export async function getWeeklySummary() {
  const allActivities = await Activity.find().lean();
  const summaryMap = new Map();
  
  allActivities.forEach((activity) => {
    const weekStart = getWeekStart(activity.Created_at);
    const weekKey = weekStart.toISOString();
    
    if (!summaryMap.has(weekKey)) {
      summaryMap.set(weekKey, {
        weekStart: weekStart,
        lessonsCreated: 0,
        quizzesCreated: 0,
        assessmentsCreated: 0,
      });
    }
    
    const weekData = summaryMap.get(weekKey);
    incrementActivityCount(weekData, activity.Activity_type);
  });
  
  const result = Array.from(summaryMap.values()).sort(
    (a, b) => new Date(a.weekStart) - new Date(b.weekStart)
  );
  
  return result;
}

/**
 * Get daily activity for current week
 * @returns {Promise<Array>} Array of daily activity objects
 */
export async function getDailyActivity(period = "week", grade, subject) {
  // For week: return 7-day daily counts (Sun-Sat)
  // For month: return last 30 days daily counts
  // For year: return 12-month aggregated counts
  const today = new Date();
  let startDate;

  if (period === "month") {
    // Return 4 weeks of data aggregated weekly
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 27); // last ~4 weeks
    startDate.setHours(0, 0, 0, 0);

    // build query with optional filters
    const q = { Created_at: { $gte: startDate } };
    if (grade) {
      const parsedGrade = parseInt(String(grade).replace(/\D/g, ""), 10);
      if (!isNaN(parsedGrade)) q.Grade = parsedGrade;
    }
    if (subject && subject !== "All Subjects") q.Subject = subject;

    const activities = await Activity.find(q).lean();

    const weekMap = new Map();
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + i * 7);
      const key = `Week ${i + 1}`;
      weekMap.set(key, { day: key, date: weekStart, lessons: 0, quizzes: 0, assessments: 0 });
    }

    activities.forEach((activity) => {
      const actDate = new Date(activity.Created_at);
      const daysDiff = Math.floor((actDate - startDate) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.min(Math.floor(daysDiff / 7), 3);
      const key = `Week ${weekIndex + 1}`;
      if (weekMap.has(key)) {
        incrementActivityCount(weekMap.get(key), activity.Activity_type, 'daily');
      }
    });

    return Array.from(weekMap.values()).sort((a, b) => a.date - b.date);
  }

  if (period === "year") {
    // aggregate by month for the last 12 months
    startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    startDate.setHours(0, 0, 0, 0);

    const q = { Created_at: { $gte: startDate } };
    if (grade) {
      const parsedGrade = parseInt(String(grade).replace(/\D/g, ""), 10);
      if (!isNaN(parsedGrade)) q.Grade = parsedGrade;
    }
    if (subject && subject !== "All Subjects") q.Subject = subject;

    const activities = await Activity.find(q).lean();

    const monthMap = new Map();
    for (let i = 0; i < 12; i++) {
      const d = new Date(startDate);
      d.setMonth(startDate.getMonth() + i);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(monthKey, { day: monthKey, date: d, lessons: 0, quizzes: 0, assessments: 0 });
    }

    activities.forEach((activity) => {
      const d = new Date(activity.Created_at);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap.has(monthKey)) {
        incrementActivityCount(monthMap.get(monthKey), activity.Activity_type, 'daily');
      }
    });

    return Array.from(monthMap.values()).sort((a, b) => a.date - b.date);
  }

  // default: week (current week, Sun-Sat)
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const q = { Created_at: { $gte: startOfWeek, $lt: endOfWeek } };
  if (grade) {
    const parsedGrade = parseInt(String(grade).replace(/\D/g, ""), 10);
    if (!isNaN(parsedGrade)) q.Grade = parsedGrade;
  }
  if (subject && subject !== "All Subjects") q.Subject = subject;

  const activities = await Activity.find(q).lean();

  const dayMap = new Map();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Initialize all days
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    const dayKey = dayDate.toISOString().substring(0, 10);
    dayMap.set(dayKey, {
      day: dayNames[i],
      date: dayDate,
      lessons: 0,
      quizzes: 0,
      assessments: 0,
    });
  }

  activities.forEach((activity) => {
    const dayStart = getDayStart(activity.Created_at);
    const dayKey = dayStart.toISOString().substring(0, 10);

    if (dayMap.has(dayKey)) {
      const dayData = dayMap.get(dayKey);
      incrementActivityCount(dayData, activity.Activity_type, 'daily');
    }
  });

  const result = Array.from(dayMap.values()).sort(
    (a, b) => a.date - b.date
  );

  return result;
}

/**
 * Get insights summary for a given period
 * @param {string} period - Time period: "week", "month", or "year"
 * @returns {Promise<Object>} Insights summary object
 */
export async function getInsights(period = "week", grade, subject) {
  const startDate = getPeriodStartDate(period);

  const q = { Created_at: { $gte: startDate } };
  if (grade) {
    const parsedGrade = parseInt(String(grade).replace(/\D/g, ""), 10);
    if (!isNaN(parsedGrade)) q.Grade = parsedGrade;
  }
  if (subject && subject !== "All Subjects") q.Subject = subject;

  const activities = await Activity.find(q).lean();
  
  const activeTeachers = new Set();
  let lessonsCreated = 0;
  let quizzesConducted = 0;
  let assessmentsMade = 0;
  
  activities.forEach((activity) => {
    activeTeachers.add(activity.Teacher_id);
    
    if (activity.Activity_type === "Lesson Plan") {
      lessonsCreated++;
    } else if (activity.Activity_type === "Quiz") {
      quizzesConducted++;
    } else if (activity.Activity_type === "Question Paper") {
      assessmentsMade++;
    }
  });
  
  return {
    activeTeachers: activeTeachers.size,
    lessonsCreated,
    quizzesConducted,
    assessmentsMade,
    submissionRate: 0, // Placeholder
  };
}

/**
 * Get AI Pulse Summary insights
 * @returns {Promise<Array>} Array of AI insight objects
 */
export async function getAIPulse() {
  const activities = await Activity.find().lean();
  
  // Find teacher with highest workload
  const teacherWorkload = new Map();
  const teacherSubjects = new Map();
  
  activities.forEach((activity) => {
    const teacherId = activity.Teacher_id;
    const teacherName = activity.Teacher_name;
    
    if (!teacherWorkload.has(teacherId)) {
      teacherWorkload.set(teacherId, { name: teacherName, count: 0 });
      teacherSubjects.set(teacherId, new Set());
    }
    
    teacherWorkload.get(teacherId).count++;
    teacherSubjects.get(teacherId).add(activity.Subject);
  });
  
  let maxWorkload = { name: "", count: 0, subjects: 0 };
  teacherWorkload.forEach((workload, teacherId) => {
    const subjects = teacherSubjects.get(teacherId).size;
    if (workload.count > maxWorkload.count) {
      maxWorkload = {
        name: workload.name,
        count: workload.count,
        subjects: subjects,
      };
    }
  });
  
  // Find grade with most activity
  const gradeActivity = new Map();
  activities.forEach((activity) => {
    const grade = activity.Grade;
    gradeActivity.set(grade, (gradeActivity.get(grade) || 0) + 1);
  });
  
  let maxGrade = { grade: "", count: 0 };
  gradeActivity.forEach((count, grade) => {
    if (count > maxGrade.count) {
      maxGrade = { grade: `Class ${grade} A`, count };
    }
  });
  
  const insights = [
    {
      type: "workload",
      icon: "👥",
      text: `${maxWorkload.name} has the highest workload with ${maxWorkload.count} activities and ${maxWorkload.subjects} subjects`,
      color: "purple",
    },
    {
      type: "enrollment",
      icon: "📈",
      text: `${maxGrade.grade} has the most activity with ${maxGrade.count} activities`,
      color: "green",
    },
    {
      type: "alert",
      icon: "⚠️",
      text: "Monitor teacher activity patterns for optimal resource allocation",
      color: "yellow",
    },
  ];
  
  return insights;
}

/**
 * Increment activity count based on activity type
 * @param {Object} dataObject - Object to increment counts in
 * @param {string} activityType - Type of activity
 * @param {string} format - Format: 'weekly', 'daily', or 'counts'
 */
function incrementActivityCount(dataObject, activityType, format = 'weekly') {
  if (format === 'daily') {
    if (activityType === "Lesson Plan") {
      dataObject.lessons++;
    } else if (activityType === "Quiz") {
      dataObject.quizzes++;
    } else if (activityType === "Question Paper") {
      dataObject.assessments++;
    }
  } else if (format === 'counts') {
    if (activityType === "Lesson Plan") {
      dataObject.lessonsCreated++;
    } else if (activityType === "Quiz") {
      dataObject.quizzesConducted++;
    } else if (activityType === "Question Paper") {
      dataObject.assessmentsMade++;
    }
  } else {
    // weekly format
    if (activityType === "Lesson Plan") {
      dataObject.lessonsCreated++;
    } else if (activityType === "Quiz") {
      dataObject.quizzesCreated++;
    } else if (activityType === "Question Paper") {
      dataObject.assessmentsCreated++;
    }
  }
}
