import express from "express";

const router = express.Router();
import { isAuthenticated } from "../middlewares/auth.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
} from "../controllers/ai.controller.js";

router.post("/enhance-pro-sum", isAuthenticated, enhanceProfessionalSummary);
router.post("/enhance-job-desc", isAuthenticated, enhanceJobDescription);
router.post("/upload-resume", isAuthenticated, uploadResume);

export default router;
