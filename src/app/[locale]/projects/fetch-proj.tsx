import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const fetchProjects = async () => {
  const { data, error } = await supabase.from("projects").select("*");
  if (!error && data) {
    return data;
  }
};
