"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useSelector } from "react-redux";
import { ProjectState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { setProject, initialState } from "../../redux/project-slice";
import ProjectTable from "../../projects/table";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OrganizationPage() {
  const router = useRouter();
  const user = useSelector((state: ProjectState) => state.user);
  const project = useSelector((state: ProjectState) => state.project);
  const [orgName, setOrgName] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const pathname = usePathname().split("/");
  const locale = pathname[1];
  const org_id = pathname[3];

  const handleCreateProject = () => {
    const uuid = crypto.randomUUID();

    dispatch(
      setProject({
        ...initialState,
        uuid,
        org_id: org_id,
        user_id: user.id, // in case you want to save creator info
      })
    );

    router.push(`/${locale}/project/${uuid}`); // or `/details?uuid=${uuid}`
  };

  // Navigate to /project/[uuid] when a project is selected
  const handleSelectProject = async (uuid: string) => {
    const selected = projects.find((p) => p.uuid === uuid);
    if (selected) {
      dispatch(setProject(selected));
    } else {
      console.error("Project not found");
    }
    router.push(`/${locale}/project/${uuid}`);
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
      dispatch(setProject(initialState)); // Reset state if deleted
    }
  };

  useEffect(() => {
    const loadOrgData = async () => {
      if (!org_id || !user.id) return;

      // 1. Check membership
      const { data: membership, error: membershipError } = await supabase
        .from("org_members")
        .select("*")
        .eq("org_id", org_id)
        .eq("user_id", user.id)
        .single();

      if (!membership || membershipError) {
        alert("You are not a member of this organization.");
        router.push("/"); // or 404
        return;
      }

      // 2. Get org name
      const { data: orgData } = await supabase
        .from("orgs")
        .select("name")
        .eq("org_id", org_id)
        .single();

      setOrgName(orgData?.name ?? "Unknown Org");

      // 3. Get projects
      const { data: orgProjects } = await supabase
        .from("projects")
        .select("uuid, project_name")
        .eq("org_id", org_id);

      setProjects(orgProjects || []);
      setLoading(false);
    };

    loadOrgData();
  }, [org_id, user.id]);

  const handleShare = async () => {
    const shareURL = `${window.location.origin}/join/${org_id}`;
    await navigator.clipboard.writeText(shareURL);
    alert(`Invite link copied to clipboard:\n${shareURL}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{orgName}</h1>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCreateProject}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          New Project
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
        >
          Share Invite
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : projects.length > 0 ? (
        <ProjectTable
          projects={projects}
          onSelect={handleSelectProject}
          onDelete={handleDeleteProject}
        />
      ) : (
        <p className="text-gray-500">This organization has no projects yet.</p>
      )}
    </div>
  );
}
