import express from "express";
import {
  getUserById,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";
const router = express.Router();
import { isAuthenticated } from "../middlewares/auth.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-by-id", isAuthenticated, getUserById);

export default router;
