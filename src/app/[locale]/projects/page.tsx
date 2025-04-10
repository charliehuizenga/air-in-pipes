"use client";

import { useRouter, usePathname } from "next/navigation";
import { setProject, fileToState } from "../redux/project-slice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { AppDispatch, ProjectState } from "../redux/store";
import { useState, useEffect, useRef } from "react";
import { initialState } from "../redux/project-slice";
import { fetchProjects, fetchMembershipOrgs } from "./fetch-proj";
import { createClient } from "@supabase/supabase-js";
import ProjectTable from "./table";
import Organizations from "./organizations";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations("projects");
  const user = useSelector((state: ProjectState) => state.user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const allProjects = await fetchProjects();
      const personal = allProjects.filter(
        (p) => p.user_id === user.id && p.org_id == null
      );
      setProjects(personal);

      const userOrgs = await fetchMembershipOrgs(user.id);
      setOrgs(userOrgs);
      setLoading(false);
    };
    load();
  }, [user.id]);

  const handleSelectProject = async (uuid: string) => {
    if (uuid === "create") {
      uuid = crypto.randomUUID();
      dispatch(
        setProject({
          ...initialState,
          uuid,
          user_id: user.id,
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
    router.push(`/${locale}/project/${uuid}`);
  };

  const handleCreateOrganization = async () => {
    const name = prompt("Enter the name of your new organization:");
    if (!name) return;
    const orgId = crypto.randomUUID();

    const { error: orgError } = await supabase.from("orgs").insert({
      org_id: orgId,
      name,
    });

    if (orgError) {
      console.error("Error creating organization:", orgError);
      alert("Failed to create organization.");
      return;
    }

    const { error: memberError } = await supabase.from("org_members").insert({
      user_id: user.id,
      org_id: orgId,
      role: "admin",
    });

    if (memberError) {
      console.error("Error adding to members:", memberError);
      alert("Organization created but failed to add membership.");
      return;
    }

    alert(`Organization "${name}" created!`);
    router.push(`/${locale}/org/${orgId}`);
  };

  const handleDeleteProject = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("uuid", uuid);
    if (error) {
      console.error("Error deleting project:", error.message);
      alert("Failed to delete project.");
    } else {
      setProjects((prev) => prev.filter((p) => p.uuid !== uuid));
      alert("Project deleted successfully.");
      dispatch(setProject(initialState));
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const resultAction = await dispatch(fileToState(file));

      if (fileToState.fulfilled.match(resultAction)) {
        const importedProject = resultAction.payload;

        const uuid = crypto.randomUUID();

        const updatedProject = {
          ...importedProject,
          uuid,
          user_id: user.id,
        };

        dispatch(setProject(updatedProject));

        const path = `/${locale}/project/${uuid}`;
        router.push(path);
      } else {
        alert("Failed to import project file.");
      }
    } else {
      console.warn("[handleFileChange] No file selected.");
    }
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 pt-10 pb-12 min-h-screen">
      <div className="w-full max-w-5xl">
        {/* Optional Back Button */}
        {/* <div className="mb-4">
          <button
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm font-medium"
            onClick={() => router.push(`/${locale}`)}
          >
            ← Back to Home
          </button>
        </div> */}

        <h2 className="text-base font-semibold leading-7 text-gray-900 mb-6">
          {t("dashboard")}
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("personal-projects")}
            </h3>
            <div className="mt-4 mb-6 flex justify-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => handleSelectProject("create")}
                className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
              >
                {t("create")}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-sky-500 text-white rounded-md shadow-sm hover:bg-sky-600"
              >
                {t("import")}
              </button>
            </div>
            <ProjectTable
              projects={projects}
              onSelect={handleSelectProject}
              onDelete={handleDeleteProject}
            />

            <h3 className="text-lg font-semibold text-gray-800 mt-10 mb-2">
              {t("organizations")}
            </h3>
            <div className="mt-4 mb-6 flex justify-end">
              <button
                onClick={handleCreateOrganization}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
              >
                {t("new-organization")}
              </button>
            </div>
            <Organizations orgs={orgs} />
          </>
        )}
      </div>
    </div>
  );
}
