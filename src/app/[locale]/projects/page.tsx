"use client";

import { useRouter, usePathname } from "next/navigation"; // Import Next.js router
import { setProject } from "../redux/project-slice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { ProjectState } from "../redux/store";
import { useState, useEffect } from "react";
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
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize router
  const t = useTranslations("projects");
  const user = useSelector((state: ProjectState) => state.user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const allProjects = await fetchProjects();
      const personal = allProjects.filter(
        (p) => p.user_id === user.id && p.org_id == null
      );
      setProjects(personal);

      // 🎯 Fetch orgs user is a member of
      const userOrgs = await fetchMembershipOrgs(user.id);
      setOrgs(userOrgs);

      setLoading(false);
    };

    load();
  }, [user.id]);

  const handleSelectProject = async (uuid: string) => {
    if (uuid === "") {
      uuid = crypto.randomUUID();
      dispatch(
        setProject({
          ...initialState,
          uuid: uuid,
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
      role: "admin", // init creator as admin
    });

    if (memberError) {
      console.error("Error adding to members:", memberError);
      alert("Organization created but failed to add membership.");
      return;
    }

    alert(`Organization "${name}" created!`);
    location.reload(); // re-fetch org projects/members
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

  return (
    <main className="mx-auto max-w-4xl py-12 sm:px-6 lg:px-8">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          {t("dashboard")}
        </h2>

        {loading ? (
          <p className="text-gray-500 mt-4">Loading projects...</p>
        ) : (
          <>
            {/* Personal Projects */}
            <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-2">
              {t("personal-projects")}
            </h3>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleSelectProject("")}
                className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
              >
                {t("create")}
              </button>
            </div>
            <ProjectTable
              projects={projects}
              onSelect={handleSelectProject}
              onDelete={handleDeleteProject}
            />

            {/* Organization Memberships */}
            <h3 className="text-lg font-semibold text-gray-800 mt-10 mb-2">
              {t("organizations")}
            </h3>
            <div className="mt-6 flex gap-4 justify-end">
              {/* Make New Organization */}
              <button
                onClick={handleCreateOrganization}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
              >
                New Organization
              </button>
            </div>
            <Organizations orgs={orgs} />
          </>
        )}
      </div>
    </main>
  );
}
