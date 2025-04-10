"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useSelector, useDispatch } from "react-redux";
import { ProjectState } from "../../redux/store";
import { setProject, initialState } from "../../redux/project-slice";
import ProjectTable from "../../projects/table";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("organization");

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
      alert(t("not-admin"));
      return;
    }
    if (!confirm(t("confirm-delete-project"))) return;
    const { error } = await supabase.from("projects").delete().eq("uuid", uuid);
    if (error) {
      console.error("Error deleting project:", error.message);
      alert(t("delete-failed"));
    } else {
      setProjects((prev) => prev.filter((p) => p.uuid !== uuid));
      alert(t("project-deleted"));
      dispatch(setProject(initialState));
    }
  };

  const handleRemoveMember = async (userIdToRemove: string) => {
    if (!isAdmin) {
      alert(t("not-admin"));
      return;
    }
    if (!confirm(t("remove-member-confirm"))) return;
    const { error } = await supabase
      .from("org_members")
      .delete()
      .eq("org_id", org_id)
      .eq("user_id", userIdToRemove);
    if (error) {
      console.error("Error removing member:", error.message);
      alert(t("delete-failed"));
    } else {
      setMembers((prev) => prev.filter((m) => m.user_id !== userIdToRemove));
      alert(t("remove-member-success"));
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    const confirmed = confirm(t("promote-confirm"));
    if (!confirmed) return;
    const { error } = await supabase
      .from("org_members")
      .update({ role: "admin" })
      .eq("org_id", org_id)
      .eq("user_id", userId);
    if (error) {
      alert(t("delete-failed"));
    } else {
      alert(t("promote-success"));
      setMembers((prev) =>
        prev.map((m) => (m.user_id === userId ? { ...m, role: "admin" } : m))
      );
    }
  };

  const handleLeaveOrganization = async () => {
    const confirmed = confirm(t("leave-org-confirm"));
    if (!confirmed) return;

    const isLastMember = members.length === 1 && members[0].user_id === user.id;

    if (isLastMember) {
      const confirmed = confirm(t("leave-org-final"));
      if (!confirmed) return;

      const { error: deleteError } = await supabase
        .from("orgs")
        .delete()
        .eq("org_id", org_id);
      if (deleteError) {
        alert(t("delete-failed"));
        return;
      }

      alert(t("org-deleted"));
      router.push(`/${locale}/projects`);
    } else {
      const { error } = await supabase
        .from("org_members")
        .delete()
        .eq("org_id", org_id)
        .eq("user_id", user.id);
      if (error) {
        alert(t("delete-failed"));
      } else {
        alert(t("leave-org-success"));
        router.push(`/${locale}/projects`);
      }
    }
  };

  const handleDeleteOrganization = async () => {
    const confirmed = confirm(t("delete-org-confirm"));
    if (!confirmed) return;

    await supabase.from("org_members").delete().eq("org_id", org_id);
    await supabase.from("projects").delete().eq("org_id", org_id);
    await supabase.from("org_invites").delete().eq("org_id", org_id);

    const { error } = await supabase.from("orgs").delete().eq("org_id", org_id);
    if (error) {
      alert(t("delete-failed"));
      console.error("Org delete error:", error);
    } else {
      alert(t("org-deleted"));
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
      alert(t("invite-error"));
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
        alert(t("invite-create-failed"));
        return;
      }
    }

    const inviteURL = `${window.location.origin}/${locale}/join/${token}`;

    try {
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(inviteURL);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = inviteURL;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      alert(`${t("invite-copied")}\n${inviteURL}`);
    } catch (err) {
      alert(`${t("invite-copy-manual")}\n${inviteURL}`);
    }
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
        alert(t("not-member"));
        router.push("/");
        return;
      }

      setIsAdmin(membership.role === "admin");

      const { data: orgData } = await supabase
        .from("orgs")
        .select("name")
        .eq("org_id", org_id)
        .single();
      setOrgName(orgData?.name ?? t("unknown-org"));

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
        <div className="mb-4">
          <button
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm font-medium"
            onClick={() => router.push(`/${locale}/projects`)}
          >
            {t("back")}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{orgName}</h1>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">{t("members-heading")}</h2>
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.user_id}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
              >
                <div>
                  <p className="font-medium">{member.email}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {member.role}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && member.user_id !== user.id && (
                    <>
                      {member.role !== "admin" && (
                        <button
                          onClick={() => handlePromoteToAdmin(member.user_id)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                        >
                          {t("make-admin")}
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        {t("remove")}
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
              {t("create-project")}
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
            >
              {t("share-invite")}
            </button>
            <button
              onClick={handleLeaveOrganization}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {t("leave-org")}
            </button>
            {isAdmin && (
              <button
                onClick={handleDeleteOrganization}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              >
                {t("delete-org")}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">{t("loading-projects")}</p>
        ) : projects.length > 0 ? (
          <ProjectTable
            projects={projects}
            onSelect={handleSelectProject}
            onDelete={handleDeleteProject}
          />
        ) : (
          <p className="text-gray-500">{t("no-projects")}</p>
        )}
      </div>
    </div>
  );
}
