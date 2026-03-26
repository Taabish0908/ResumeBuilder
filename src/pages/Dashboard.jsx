import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { use, useEffect } from "react";
import { dummyResumeData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const colors = [
    "#9333ea",
    "#d97706",
    "#dc2626",
    "#0284c7",
    "#16a34a", // actual here
    "#3b82f6",
    "#ef4444",
    "#f59e0b",
    "#fcd34d",
    "#8b5cf6",
    "#22c55e",
    "#3b82f6",
    "#ef4444",
    "#fcd34d",
    "#8b5cf6",
    "#22c55e",
    "#3b82f6",
    "#ef4444",
    "#fcd34d",
    "#8b5cf6",
    "#22c55e",
  ];
  const [allResumes, setAllResumes] = React.useState([]);
  const [showCreateResume, setShowCreateResume] = React.useState(false);
  const [showUploadResume, setShowUploadResume] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [resume, setResume] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [editResumeId, setEditResumeId] = React.useState("");
  const navigate = useNavigate();
  const authToken = token?.token || token;

  const loadAllResume = async () => {
    // setAllResumes(dummyResumeData);
    try {
      const { data } = await api.get(`/api/resume/resumes`, {
        headers: {
          Authorization: authToken,
        },
      });
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const createResume = async (event) => {
    // event.preventDefault();
    // setShowCreateResume(false);
    // navigate(`/app/builder/res123}`);
    try {
      event.preventDefault();
      const { data } = await api.post(
        `/api/resume/create`,
        { title },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const uploadResume = async (event) => {
    event.preventDefault();
    // setShowUploadResume(false);
    // navigate(`/app/builder/res123}`);
    setLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        `/api/ai/upload-resume`,
        { resumeText, title },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      setLoading(false);
    }
  };
  const editTitle = async (event) => {
    // event.preventDefault();
    // navigate(`/app/builder/${editResumeId}`);
    try {
      event.preventDefault();
      const { data } = await api.put(
        `/api/resume/update/`,
        { resumeId: editResumeId, resumeData: { title } },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAllResumes(
        allResumes.map((resume) =>
          resume._id === editResumeId ? { ...resume, title } : resume
        )
      );
      setTitle("");
      setEditResumeId("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume?"
      );
      if (confirm) {
        const { data } = await api.delete(`/api/resume/delete/${resumeId}`, {
          headers: {
            Authorization: authToken,
          },
        });
        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    loadAllResume();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0014] via-[#120016] to-[#1a001f] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 ">
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, John Doe
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResume(true)}
            // Adjusted: Background is dark (like the card). Border is now orange/amber.
            className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-white border border-dashed border-amber-500/50 group hover:border-amber-500 hover:shadow-lg transition-all duration-300 cursor-pointer bg-neutral-900"
          >
            <PlusIcon
              // Adjusted: Gradient changed to use a warm orange/amber scheme.
              className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-amber-300 to-orange-500 text-white rounded-full"
            />
            <p
              // Adjusted: Hover text color is now a warm orange/amber.
              className="text-sm group-hover:text-amber-500 transition-all text-amber-500"
            >
              Create Resume
            </p>
          </button>
          <button
            onClick={() => setShowUploadResume(true)}
            // Adjusted: Background is dark. Border is now red/magenta.
            className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-white border border-dashed border-red-500/50 group hover:border-red-500 hover:shadow-lg transition-all duration-300 cursor-pointer bg-neutral-900"
          >
            <UploadCloud
              // Adjusted: Gradient changed to use a red/magenta scheme.
              className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-red-400 to-pink-600 text-white rounded-full"
            />
            <p
              // Adjusted: Hover text color is now red/magenta.
              className="text-sm group-hover:text-red-500 transition-all text-red-500"
            >
              Upload the existing
            </p>
          </button>
        </div>
        <hr className="border-slate-300 my-6 sm:w-[305px]" />
        <div className="grid drid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button
                key={index}
                onClick={() => navigate(`/app/builder/${resume?._id}`)}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale:105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume?.title}
                </p>
                <p
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume?.updatedAt).toLocaleDateString()}
                </p>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 group-hover:flex items-center hidden"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id);
                      setTitle(resume?.title);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-green/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative  border shadow-md rounded-lg w-full max-w-sm p-6  border-amber-500/50 group hover:border-amber-500 hover:shadow-lg transition-all duration-300 cursor-pointer bg-neutral-900"
            >
              <h2 className="text-xl font-bold mb-4 bg">Create a Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="w-full px-4 py-2 mb-4 focus:border-greenn-600 ring-greenn-600"
                required
              />
              <button className="w-full py-2 bg-pink-600 text-white rounded hover:bg-greenn-700 transition-colors">
                Create Resume
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors "
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-green/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-neutral-900 text-white border border-red-500/50 group hover:border-red-500 hover:shadow-lg transition-all duration-300 shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload a Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="w-full px-4 py-2 mb-4 focus:border-pink-600 ring-pink-600"
                required
              />
              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-white"
                >
                  Select resume file
                  <div className="flex flex-col items-center justify-center gap-2 text-white border border-dashed border-red-500/50 group hover:border-red-500 hover:shadow-lg transition-all duration-300 rounded-md p-4 py-10 my-4  hover:text-greenn-700 cursor-pointer">
                    {resume ? (
                      <p className="text-greenn-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <p >Upload Resume</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>
              <button
                disabled={loading}
                className="w-full py-2 bg-pink-600 text-white rounded hover:bg-greenn-700 transition-colors flex items-center justify-center"
              >
                {loading && (
                  <LoaderCircleIcon className="animate-spin size-4 text-white" />
                )}
                {loading ? "Uploading..." : "Upload Resume"}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors "
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId("")}
            className="fixed inset-0 bg-green/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="w-full px-4 py-2 mb-4 focus:border-greenn-600 ring-greenn-600"
                required
              />
              <button className="w-full py-2 bg-greenn-600 text-white rounded hover:bg-greenn-700 transition-colors">
                Update
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors "
                onClick={() => {
                  setEditResumeId("");
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
