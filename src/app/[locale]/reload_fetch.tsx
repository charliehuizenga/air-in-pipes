"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation"; // ✅ not useSearchParams
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fetch project from Supabase
const reload = async (uuid: string, setProject: Function) => {
  if (!uuid) {
    console.warn("No UUID found in path.");
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

// Custom hook to load project from URL path param
const useProjectLoader = (setProject: Function) => {
  const params = useParams(); // ✅ gets route params like { uuid: 'abc123' }

  useEffect(() => {
    if (params?.uuid) {
      reload(params.uuid as string, setProject);
    }
  }, [params?.uuid]);
};

export { reload, useProjectLoader };
