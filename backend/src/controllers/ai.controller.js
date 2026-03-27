import openai from "../configs/openAi.js";
import Resume from "../models/resume.model.js";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ error: "Missing user content" });
    }
    const contentForAi =
      "You are an expert in resume writing. Your task is to enhance the profesional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experiences, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.";
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: contentForAi },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhancedSummary = response.choices[0].message.content;
    return res.status(200).json({ success: true, enhancedSummary });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ error: "Missing user content" });
    }
    const contentForAi =
      "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key responsibilities and achievements. Use actions verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.";
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: contentForAi },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhancedSummary = response.choices[0].message.content;
    return res.status(200).json({ success: true, enhancedSummary });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const currentLoggedInUser = req.user;
    if (!currentLoggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!resumeText) {
      return res.status(400).json({ error: "Missing resume text" });
    }
    const systemPrompt =
      "You are an expert AI Agent to extract data from resume.";
    const userPrompt = `Extract data from this resume: ${resumeText}
    Provide data in the following JSON format with no additional text before or after:
    {
    professional_summary: { type: String, default: "" },
    skills: { type: [String], default: [] },
     personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    experience: [
      {
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        start_date: { type: String, default: "" },
        end_date: { type: String, default: "" },
        description: { type: String, default: "" },
        is_current: { type: Boolean, default: false },
      },
    ],
    projects: [
      {
        name: { type: String, default: "" },
        type: { type: String, default: "" },
        description: { type: String, default: "" },
        links: [
          {
            name: { type: String, default: "" },
            url: { type: String, default: "" },
          },
        ],
      },
    ],
    education: [
      {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        field: { type: String, default: "" },
        graduation_date: { type: String, default: "" },
        gpa: { type: String, default: "" },
      },
    ],}
    `;
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });
    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    const resume = await Resume.create({
      userId: currentLoggedInUser._id,
      title,
      ...parsedData,
    });
    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resumeId: resume._id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
