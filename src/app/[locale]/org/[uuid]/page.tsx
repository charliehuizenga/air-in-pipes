"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useSelector, useDispatch } from "react-redux";
import { ProjectState } from "../../redux/store";
import { setProject, initialState } from "../../redux/project-slice";
import ProjectTable from "../../projects/table";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OrganizationPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: ProjectState) => state.user);
  const [orgName, setOrgName] = useState("");
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState<
    { user_id: string; email: string; role: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname().split("/");
  const locale = pathname[1];
  const org_id = pathname[3];

  const handleCreateProject = () => {
    const uuid = crypto.randomUUID();
    dispatch(
      setProject({
        ...initialState,
        uuid,
        org_id,
        user_id: user.id,
      })
    );
    router.push(`/${locale}/project/${uuid}?from=org`);
  };

  const handleSelectProject = async (uuid: string) => {
    const selected = projects.find((p) => p.uuid === uuid);
    if (selected) {
      dispatch(setProject(selected));
    } else {
      console.error("Project not found");
    }
    router.push(`/${locale}/project/${uuid}?from=org`);
  };

  const handleDeleteProject = async (uuid: string) => {
    if (!isAdmin) {
      alert("You must be an admin to delete projects in this organization.");
      return;
    }
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

  const handleRemoveMember = async (userIdToRemove: string) => {
    if (!isAdmin) {
      alert("Only admins can remove members.");
      return;
    }
    if (!confirm("Are you sure you want to remove this member?")) return;
    const { error } = await supabase
      .from("org_members")
      .delete()
      .eq("org_id", org_id)
      .eq("user_id", userIdToRemove);
    if (error) {
      console.error("Error removing member:", error.message);
      alert("Failed to remove member.");
    } else {
      setMembers((prev) => prev.filter((m) => m.user_id !== userIdToRemove));
      alert("Member removed successfully.");
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    const confirmed = confirm("Promote this member to admin?");
    if (!confirmed) return;
    const { error } = await supabase
      .from("org_members")
      .update({ role: "admin" })
      .eq("org_id", org_id)
      .eq("user_id", userId);
    if (error) {
      alert("Failed to promote member.");
    } else {
      alert("Member promoted.");
      setMembers((prev) =>
        prev.map((m) => (m.user_id === userId ? { ...m, role: "admin" } : m))
      );
    }
  };

  const handleLeaveOrganization = async () => {
    const confirmed = confirm("Are you sure you want to leave this organization?");
    if (!confirmed) return;

    const isLastMember = members.length === 1 && members[0].user_id === user.id;

    if (isLastMember) {
      const confirmed = confirm(
        "You are the last member. Organization will be deleted. Continue?"
      );
      if (!confirmed) return;

      const { error: deleteError } = await supabase
        .from("orgs")
        .delete()
        .eq("org_id", org_id);
      if (deleteError) {
        alert("Failed to delete organization.");
        return;
      }

      alert("Organization has been deleted.");
      router.push(`/${locale}/projects`);
    } else {
      const { error } = await supabase
        .from("org_members")
        .delete()
        .eq("org_id", org_id)
        .eq("user_id", user.id);
      if (error) {
        alert("Error leaving organization.");
      } else {
        alert("You have left the organization.");
        router.push(`/${locale}/projects`);
      }
    }
  };

  const handleDeleteOrganization = async () => {
    const confirmed = confirm("Delete this organization? This cannot be undone.");
    if (!confirmed) return;

    await supabase.from("org_members").delete().eq("org_id", org_id);
    await supabase.from("projects").delete().eq("org_id", org_id);
    await supabase.from("org_invites").delete().eq("org_id", org_id);

    const { error } = await supabase.from("orgs").delete().eq("org_id", org_id);
    if (error) {
      alert("Failed to delete organization.");
      console.error("Org delete error:", error);
    } else {
      alert("Organization deleted.");
      router.push(`/${locale}/projects`);
    }
  };

  const handleShare = async () => {
    const { data: existingInvite, error: fetchError } = await supabase
      .from("org_invites")
      .select("token")
      .eq("org_id", org_id)
      .maybeSingle();
    if (fetchError) {
      alert("Failed to retrieve invite.");
      return;
    }

    let token = existingInvite?.token;
    if (!token) {
      token = crypto.randomUUID();
      const { error: insertError } = await supabase.from("org_invites").insert({
        token,
        org_id,
        invite_id: crypto.randomUUID(),
      });
      if (insertError) {
        alert("Failed to create invite.");
        return;
      }
    }

    const inviteURL = `${window.location.origin}/${locale}/join/${token}`;
    await navigator.clipboard.writeText(inviteURL);
    alert(`Invite link copied:\n${inviteURL}`);
  };

  useEffect(() => {
    const loadOrgData = async () => {
      if (!org_id || !user.id) return;

      const { data: membership, error: membershipError } = await supabase
        .from("org_members")
        .select("*")
        .eq("org_id", org_id)
        .eq("user_id", user.id)
        .single();

      if (!membership || membershipError) {
        alert("You are not a member of this organization.");
        router.push("/");
        return;
      }

      setIsAdmin(membership.role === "admin");

      const { data: orgData } = await supabase
        .from("orgs")
        .select("name")
        .eq("org_id", org_id)
        .single();
      setOrgName(orgData?.name ?? "Unknown Org");

      const { data: orgProjects } = await supabase
        .from("projects")
        .select("uuid, project_name")
        .eq("org_id", org_id);
      setProjects(orgProjects || []);

      const { data, error } = await supabase.functions.invoke(
        "list-org-members",
        { body: { org_id } }
      );
      if (error) {
        console.error("Error loading members:", error.message);
        setMembers([]);
      } else {
        setMembers(data?.members ?? []);
      }

      setLoading(false);
    };

    loadOrgData();
  }, [org_id, user.id]);

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 pt-10 pb-12 min-h-screen">
      <div className="w-full max-w-5xl">
        {/* Back Button */}
        <div className="mb-4">
          <button
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm font-medium"
            onClick={() => router.push(`/${locale}/projects`)}
          >
            ← Back
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{orgName}</h1>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Organization Members</h2>
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.user_id}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
              >
                <div>
                  <p className="font-medium">{member.email}</p>
                  <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && member.user_id !== user.id && (
                    <>
                      {member.role !== "admin" && (
                        <button
                          onClick={() => handlePromoteToAdmin(member.user_id)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 mb-6 flex flex-wrap gap-4">
            <button
              onClick={handleCreateProject}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create New Project
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
            >
              Share Invite Link
            </button>
            <button
              onClick={handleLeaveOrganization}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Leave Organization
            </button>
            {isAdmin && (
              <button
                onClick={handleDeleteOrganization}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              >
                Delete Organization
              </button>
            )}
          </div>
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
    </div>
  );
}
