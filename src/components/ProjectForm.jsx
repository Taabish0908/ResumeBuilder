import { Plus, Trash2, Globe, Github, Edit2 } from "lucide-react";
import React from "react";

const ProjectForm = ({ data, onChange }) => {
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
      links: [],
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    const updatedProjects = data.filter((_, i) => i !== index);
    onChange(updatedProjects);
  };

  const updateProject = (index, field, value) => {
    const updatedProjects = [...data];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };
    onChange(updatedProjects);
  };

  const addLink = (projectIndex) => {
    const updatedProjects = [...data];
    if (!updatedProjects[projectIndex].links) updatedProjects[projectIndex].links = [];
    updatedProjects[projectIndex].links.push({ name: "", url: "" });
    onChange(updatedProjects);
  };

  const removeLink = (projectIndex, linkIndex) => {
    const updatedProjects = [...data];
    updatedProjects[projectIndex].links = updatedProjects[projectIndex].links.filter(
      (_, i) => i !== linkIndex
    );
    onChange(updatedProjects);
  };

  const updateLink = (projectIndex, linkIndex, field, value) => {
    const updatedProjects = [...data];
    updatedProjects[projectIndex].links[linkIndex] = {
      ...updatedProjects[projectIndex].links[linkIndex],
      [field]: value,
    };
    onChange(updatedProjects);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            Projects
          </h3>
          <p className="text-sm text-white">Add your projects and related links</p>
        </div>
        <button
          onClick={addProject}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-pink-700 text-white rounded-lg hover:bg-pink-800 transition-colors"
          type="button"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-4 mt-6">
        {data.map((project, index) => (
          <div key={index} className="p-4 border border-white rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium">Project #{index + 1}</h4>
              <button
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
                type="button"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="grid gap-3">
              <input
                value={project.name || ""}
                onChange={(e) => updateProject(index, "name", e.target.value)}
                type="text"
                placeholder="Project Name"
                className="px-3 py-2 text-sm rounded-lg border border-gray-200"
              />
              <input
                value={project.type || ""}
                onChange={(e) => updateProject(index, "type", e.target.value)}
                type="text"
                placeholder="Project Type"
                className="px-3 py-2 text-sm rounded-lg border border-gray-200"
              />
              <textarea
                rows={4}
                value={project.description || ""}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                placeholder="Project Description"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 resize-none"
              />
            </div>

            {/* Links Section */}
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-white">Project Links</h5>
                <button
                  onClick={() => addLink(index)}
                  className="inline-flex items-center gap-1 text-xs text-white hover:text-pink-600 transition-colors"
                  type="button"
                >
                  <Plus size={12} /> Add Link
                </button>
              </div>

              {/* Link inputs (stacked inputs for editing) */}
              <div className="mt-2 space-y-2">
                {(project.links || []).map((link, linkIndex) => (
                  <div
                    key={linkIndex}
                    className="flex gap-2 items-center border border-gray-200 p-2 rounded-lg"
                  >
                    {/* Name */}
                    <input
                      value={link.name || ""}
                      onChange={(e) =>
                        updateLink(index, linkIndex, "name", e.target.value)
                      }
                      placeholder="Link Name (e.g. GitHub)"
                      className="min-w-0 flex-1 px-2 py-1 text-sm rounded border border-gray-200"
                    />

                    {/* URL */}
                    <input
                      value={link.url || ""}
                      onChange={(e) =>
                        updateLink(index, linkIndex, "url", e.target.value)
                      }
                      placeholder="URL (https://...)"
                      className="min-w-0 flex-1 px-2 py-1 text-sm rounded border border-gray-200"
                    />

                    {/* Delete */}
                    <button
                      onClick={() => removeLink(index, linkIndex)}
                      className="flex-shrink-0 inline-flex items-center p-1 text-red-500 hover:bg-red-50 rounded"
                      type="button"
                      title="Remove link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;
