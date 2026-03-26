import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import { api } from "../configs/api";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const authToken = token.token || token;
  const [resumeData, setResumeData] = React.useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });
  const loadExisitingResume = async () => {
    // const resume = dummyResumeData.find((resume) => resume._id === resumeId);
    // if (resume) {
    //   setResumeData(resume);
    //   document.title = resume.title;
    // }
    try {
      const { data } = await api.get(`/api/resume/get/` + resumeId, {
        headers: {
          Authorization: authToken,
        },
      });
      if (data) {
        setResumeData(data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);
  const [removeBackground, setRemoveBackground] = React.useState(false);
  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    loadExisitingResume();
  }, []);

  const changeResumeVisibility = async () => {
    // setResumeData({
    //   ...resumeData,
    //   public: !resumeData.public,
    // });
    try {
      const formSData = new FormData();
      formSData.append("resumeId", resumeId);
      formSData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public })
      );
      const { data } = await api.put("/api/resume/update", formSData, {
        headers: {
          Authorization: authToken,
        },
      });
      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;
    if (navigator.share) {
      navigator.share({
        text: "My Resume",
        url: resumeUrl,
      });
    } else {
      alert("Share not supported on this browser.");
    }
  };

  const downloadResume = () => {
    window.print();
  };

  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData);
      // remove image from updatedResumeData
      if (typeof resumeData.personal_info.image === "object") {
        delete updatedResumeData.personal_info.image;
      }
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === "object" &&
        formData.append("image", resumeData.personal_info.image);

      const { data } = await api.put("/api/resume/update", formData, {
        headers: {
          Authorization: authToken,
        },
      });
      setResumeData(data.resume);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0014] via-[#120016] to-[#1a001f] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6  ">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-white hover:text-pink-600 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {
            // Left Panel form
          }
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-black rounded-lg shadow-sm border border-gray-200 p-6 pt-1 text-white">
              {/* progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-pink-600 border-none transition-all duration-2000"
                style={{
                  width: `${
                    (activeSectionIndex * 100) / (sections.length - 1)
                  }%`,
                }}
              />
              {/* Section navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({
                        ...prev,
                        template,
                      }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0)
                        )
                      }
                      className=" flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-pink-600 bg-black hover:text-white hover:bg-pink-600 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1)
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-pink-600 bg-black hover:text-white hover:bg-pink-600 transition-all ${
                      activeSectionIndex === sections.length - 1 && "opacity-50"
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              {/* Form Content */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                    // setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                    // setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.projects}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        projects: data,
                      }))
                    }
                    // setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                    // setResumeData={setResumeData}
                  />
                )}
              </div>

              <button
                onClick={() => {
                  toast.promise(saveResume, { loading: "saving..." });
                }}
                className="bg-pink-700 hover:bg-pink-800 active:scale-95 text-white ring-offset-1 ring-1 ring-pink-400  items-center transition-colors rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
          {/* Right Panel */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData?.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600 ring-pink-300 rounded-lg hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4" /> Share
                  </button>
                )}
                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600 ring-pink-300 rounded-lg hover:ring transition-colors"
                  style={{}}
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>

                <>
                  <style>{`
    @keyframes rotate {
      100% {
        transform: rotate(1turn);
      }
    }

    .rainbow-pink::before {
      content: '';
      position: absolute;
      z-index: -2;
      left: -50%;
      top: -50%;
      width: 200%;
      height: 200%;
      background-position: 100% 50%;
      background-repeat: no-repeat;
      background-size: 50% 50%;
      filter: blur(15px);
      background-image: linear-gradient(
        45deg,
        #ff0080,
        #ff0040,
        #ff00bf,
        #7928ca,
        #ff0080,
        #ff0040
      );
      animation: rotate 3s linear infinite;
      opacity: 1;
    }

    .rainbow-pink::after {
      content: '';
      position: absolute;
      z-index: -1;
      left: -50%;
      top: -50%;
      width: 200%;
      height: 200%;
      background-position: 100% 50%;
      background-repeat: no-repeat;
      background-size: 50% 50%;
      filter: blur(5px);
      background-image: linear-gradient(
        45deg,
        #ff0080,
        #ff0040,
        #ff00bf,
        #7928ca,
        #ff0080,
        #ff0040
      );
      animation: rotate 3s linear infinite;
      opacity: 0.5;
    }
  `}</style>

                  <div className="rainbow-pink relative z-0 overflow-hidden p-[3px] flex items-center justify-center rounded-lg hover:scale-105 transition duration-300 active:scale-100">
                    <button
                      onClick={downloadResume}
                      className="flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600 rounded-lg hover:from-pink-200 hover:to-pink-300 transition-colors relative z-10"
                    >
                      <DownloadIcon className="size-4" /> Download
                    </button>
                  </div>
                </>
              </div>
              {/* buttons */}
            </div>
            {/* Resume Preview */}

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
