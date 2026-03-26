import { Loader2, Sparkles } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { api } from "../configs/api";
import toast from "react-hot-toast";

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const authToken = token.token || token;
  const [isGenerating, setIsGenerating] = React.useState(false);
  const generateSummary = async () => {
    try {
      setIsGenerating(true);
      const prompt = `Enhance my professional summary: ${data}`;
      const response = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: prompt },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setResumeData((prev) => ({
        ...prev,
        professional_summary: response.data.enhancedSummary,
      }));
      // setIsGenerating(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            Professional Summary
          </h3>
          <p className="text-sm text-white">
            Add summary for your resume here
          </p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-pink-600 text-white rounded hover:bg-pink-700 active:scale-95 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="animate-spin size-4" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {
            isGenerating ? "Enhancing..." : "Enhance with AI"
          }
         
        </button>
      </div>
      <div className="mt-6">
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          placeholder="Write a compelling professional summary that highlights your key strengths and carrer objectives..."
        />
        <p className="text-sm text-white max-w-4/5 mx-auto text-center">
          Tip: Keep it concise in (3-4 semtences) and focus on your most
          relevant achievments and skills
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
