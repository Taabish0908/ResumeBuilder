import { imageKit } from "../configs/imageKit.js";
import Resume from "../models/resume.model.js";
import fs from "fs";

export const getUserResumes = async (req, res) => {
  try {
    const currentLoggedInUser = req.user;
    if (!currentLoggedInUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const resumes = await Resume.find({ userId: currentLoggedInUser._id });
    res.status(200).json({
      success: true,
      message: "Resumes fetched successfully",
      resumes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createResume = async (req, res) => {
  try {
    const currentLoggedInUser = req.user;
    if (!currentLoggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const { title } = req.body;
    const resume = await Resume.create({
      userId: currentLoggedInUser._id,
      title,
    });
    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const currentLoggedInUser = req.user;
    const resumeId = req.params.resumeId;
    if (!currentLoggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const resume = await Resume.findByIdAndDelete(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const currentLoggedInUser = req.user;
    const resumeId = req.params.resumeId;
    if (!currentLoggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;
    return res.status(200).json({
      success: true,
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    const resume = await Resume.findOne({ _id: resumeId, public: true });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;
    return res.status(200).json({
      success: true,
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const currentLoggedInUser = req.user;
    if (!currentLoggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file ? req.file.path : "";
    
    let resumeDataCopy 
    if(typeof resumeData === 'string'){
        resumeDataCopy = await JSON.parse(resumeData)
    }else{
        resumeDataCopy = structuredClone(resumeData)
    }
    if(image){
    
        const imageBufferData = fs.createReadStream(image);
        const response =  await imageKit.files.upload({
            file: imageBufferData,
            fileName: 'resume.png',
            folder: 'user/resumes',
            transformation: {
                pre: 'w-300,h-300, fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
            }
        });
        resumeDataCopy.personal_info.image = response.url;
        // fs.unlink(image.path, (err) => {
        //     if (err) {
        //         console.log(err);
        //     }
        // });
    }
    const resume = await Resume.findByIdAndUpdate(resumeId, resumeDataCopy, { new: true });
    return res.status(200).json({
      success: true,
      message: "saved successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
