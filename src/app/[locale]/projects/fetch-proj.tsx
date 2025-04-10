import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchProjects() {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data;
}

export async function fetchMembershipOrgs(userId: string) {
  const { data: memberships, error: memberError } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", userId);

  if (memberError || !memberships) {
    console.error("Error fetching org memberships:", memberError);
    return [];
  }

  console.log(memberships);

  const orgIds = memberships.map((m) => m.org_id);

  if (orgIds.length === 0) return [];

  const { data: orgs, error: orgError } = await supabase
    .from("orgs")
    .select("org_id, name")
    .in("org_id", orgIds); // manual join

  if (orgError || !orgs) {
    console.error("Error fetching orgs:", orgError);
    return [];
  }

  return orgs.map((org) => ({
    id: org.org_id,
    name: org.name,
  }));
}
