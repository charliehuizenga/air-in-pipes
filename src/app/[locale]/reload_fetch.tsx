import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";


const reload = async (setProject) => {
  const searchParams = new URLSearchParams(window.location.search);
  const uuid = searchParams.get("uuid");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (!uuid) {
    console.warn("No UUID found in query params.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("uuid", uuid)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      return;
    }

    if (data) {
      setProject(data);
    } else {
      console.warn("No project found for the given UUID.");
    }
  } catch (err) {
    console.error("Unexpected error fetching project:", err);
  }
};

// Auto-fetch project on component mount
const useProjectLoader = async (setProject) => {
  useEffect(() => {
    reload(setProject);
  }, []);
};

export { reload, useProjectLoader };
