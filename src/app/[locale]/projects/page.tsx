"use client";

import { setProject } from "../redux/project-slice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { ProjectState } from "../redux/store";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Principal from "../components/principal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function App() {
  const dispatch = useDispatch();
  const t = useTranslations("principal");
  const project = useSelector((state: ProjectState) => state.project);
  const [newProject, setNewProject] = useState("");
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("name");
      if (!error && data) {
        setProjects(data.map((project) => project.name));
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    dispatch(
      setProject({
        ...project,
        [name]: name === "qmax" || name === "qmin" ? parseFloat(value) : value,
      })
    );
  };

  const handleNewProject = () => {
    if (newProject) {
      console.log("Creating new project:", newProject);
      setNewProject("");
    }
  };

  const handleNext = () => {
    console.log("Logging into project:", project.project);
  };

  return (
    <main>
      <div className="mx-auto max-w-4xl py-12 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Existing Projects
            </h2>
            <div className="mt-4 flex gap-x-4 w-full">
              <select
                name="project"
                id="project"
                value={project.project || ""}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
              >
                <option value="">-- Select a Project --</option>
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-sky-500 text-white rounded-md shadow-sm hover:bg-sky-600"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Create New Project
            </h2>
            <Principal />
          </div>
        </div>
      </div>
    </main>
  );
}
