import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });
    let db = process.env.MONGODB_URI;
    const projectName = "resume-builder";
    if (!db) throw new Error("MONGODB_URI environment variable is not set");
    if (db.endsWith("/")) db = db.slice(0, -1);
    await mongoose.connect(`${db}/${projectName}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
