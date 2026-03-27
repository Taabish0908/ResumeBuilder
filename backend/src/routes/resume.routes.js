import express from "express";
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  getUserResumes,
  updateResume,
} from "../controllers/resume.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();
import { isAuthenticated } from "../middlewares/auth.js";

router.get("/resumes", isAuthenticated, getUserResumes);
router.post("/create", isAuthenticated, createResume);
router.put("/update", upload.single("image"), isAuthenticated, updateResume);
router.delete("/delete/:resumeId", isAuthenticated, deleteResume);
router.get("/get/:resumeId", isAuthenticated, getResumeById);
router.get("/public/:resumeId", getPublicResumeById);

export default router;
