import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }
  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET environment variable is not set");
    }
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.userId);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
