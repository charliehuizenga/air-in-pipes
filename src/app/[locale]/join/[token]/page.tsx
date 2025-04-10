"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useSelector } from "react-redux";
import { ProjectState } from "../../redux/store";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function JoinOrgPage() {
  const { token } = useParams();
  const router = useRouter();
  const user = useSelector((state: ProjectState) => state.user);
  const [status, setStatus] = useState("Joining organization...");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  useEffect(() => {
    const joinOrganization = async () => {
      if (!token || !user?.id) {
        setStatus("Invalid invite or not logged in.");
        return;
      }

      // 1. Look up the invite
      const { data: invite, error: inviteError } = await supabase
        .from("org_invites")
        .select("org_id")
        .eq("token", token)
        .single();

      if (!invite || inviteError) {
        setStatus("Invalid or expired invite link.");
        return;
      }

      const org_id = invite.org_id;

      // 2. Check if the user is already a member
      const { data: existingMembership } = await supabase
        .from("org_members")
        .select("*")
        .eq("org_id", org_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingMembership) {
        // 3. Add user to org_members
        const { error: insertError } = await supabase.from("org_members").insert({
          user_id: user.id,
          org_id,
          role: "member",
        });

        if (insertError) {
          console.error("Failed to join organization:", insertError.message);
          setStatus("Failed to join organization.");
          return;
        }
      }

      // 4. Redirect to the organization's page
      router.push(`/${locale}/org/${org_id}`);
    };

    joinOrganization();
  }, [token, user?.id]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
      {status}
    </div>
  );
}
