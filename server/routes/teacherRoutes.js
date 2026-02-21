import express from "express";
import * as teacherController from "../controllers/teacherController.js";

const router = express.Router();

// GET /api/teachers - Get all teachers
router.get("/", teacherController.getAllTeachers);

// GET /api/teachers/:id - Get single teacher by ID
router.get("/:id", teacherController.getTeacherById);

export default router;
