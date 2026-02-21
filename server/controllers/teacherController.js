import * as teacherService from "../services/teacherService.js";

/**
 * Get all teachers with aggregated statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getAllTeachers(req, res) {
  try {
    const teachers = await teacherService.getAllTeachers();
    res.json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
}

/**
 * Get single teacher by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getTeacherById(req, res) {
  try {
    const teacherId = req.params.id;
    const teacher = await teacherService.getTeacherById(teacherId);
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    res.json(teacher);
  } catch (err) {
    console.error("Error fetching teacher:", err);
    res.status(500).json({ message: "Failed to fetch teacher" });
  }
}
