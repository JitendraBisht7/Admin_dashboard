import express from "express";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", adminController.login);

export default router;
