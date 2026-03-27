import express from "express";

import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
const app = express();
const port = process.env.PORT || 3000;

//Database
await connectDB();
import userRoutes from "./routes/user.routes.js";
import ResumeRoutes from "./routes/resume.routes.js";
import aiRoutes from "./routes/ai.routes.js";
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is Live and Running...");
});

app.use("/api/user", userRoutes);
app.use("/api/resume", ResumeRoutes);
app.use("/api/ai", aiRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

