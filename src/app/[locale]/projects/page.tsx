"use client";

import { useRouter, usePathname } from "next/navigation"; // Import Next.js router
import { setProject } from "../redux/project-slice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { ProjectState } from "../redux/store";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { initialState } from "../redux/project-slice";
import { TrashIcon } from "@heroicons/react/24/outline";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App() {
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize router
  const t = useTranslations("principal");
  const user = useSelector((state: ProjectState) => state.user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  useEffect(() => {
    if (!user.id || !user.email) {
      router.push(`/`);
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("projects").select("*");
      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Navigate to /details when a project is selected
  const handleSelectProject = async (uuid: string) => {
    if (uuid === "") {
      console.log(user.id);
      uuid = crypto.randomUUID();
      dispatch(
        setProject({
          ...initialState,
          uuid: uuid, // Generate a new random UUID
          user_id: user.id
        })
      );
    } else {
      const selected = projects.find((p) => p.uuid === uuid);
      if (selected) {
        dispatch(setProject(selected));
      } else {
        console.error("Project not found");
      }
    }
    router.push(`/${locale}/details?uuid=${uuid}`);
  };

  // Delete a project from Supabase
  const handleDeleteProject = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("uuid", uuid);
    if (error) {
      console.error("Error deleting project:", error.message);
      alert("Failed to delete project.");
    } else {
      setProjects((prev) => prev.filter((p) => p.uuid !== uuid));
      alert("Project deleted successfully.");
      dispatch(setProject(initialState)); // Reset state if deleted
    }
  };

  return (
    <main className="mx-auto max-w-4xl py-12 sm:px-6 lg:px-8">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Project Dashboard
        </h2>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSelectProject("")}
            className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
          >
            Create New Project
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 mt-4">Loading projects...</p>
        ) : (
          <table className="min-w-full mt-6 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Project Name
                </th>
                <th className="border border-gray-300 px-2 py-2 text-center w-12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((p) => (
                  <tr key={p.uuid} className="hover:bg-gray-50">
                    <td
                      className="border border-gray-300 px-4 py-2 cursor-pointer text-sky-600"
                      onClick={() => handleSelectProject(p.uuid)}
                    >
                      {p.project_name}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center w-12">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click from triggering navigation
                          handleDeleteProject(p.uuid);
                        }}
                        className="p-1 rounded-md text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center text-gray-500 py-4">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
