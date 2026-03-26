import { Check, Layout } from "lucide-react";
import React from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview:
        "A clean, traditional resume template formatted with clear sections and professional typography.",
    },
    {
      id: "modern",
      name: "Modern",
      preview:
        "Sleek design with strategic use of colors and modern typography for a modern and professional appearance.",
    },
    {
      id: "minimal-image",
      name: "Minimal Image",
      preview:
        "A Minimal design with a single image and clean layout for clean typography.",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "Ultra-clean design that puts your content front and center.",
    },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm  bg-pink-700 hover:bg-pink-800 active:scale-95  text-white ring-offset-1 ring-1 ring-pink-400 transition-colors px-3 py-2 rounded-lg"
      >
        <Layout size={14} /> <span className="max-sm:hidden">Templates</span>
      </button>
      {isOpen && (
        <div className="absolute top-full w-xs p-3 mt-2 space-y-3 z-10 bg-slate-700 rounded-md border border-gray-200 shadow-sm">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }}
              className={`relative p-3 border rounded-md cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? "border-black-400 bg-black"
                  : "border-gray-300 hover:border-gray-400 hover:bg-black"
              }`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 ">
                  <div className="size-5 bg-pink-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <h4 className="font-medium text-white">{template.name}</h4>
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-black italic">{template.preview}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
