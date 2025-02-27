"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { setProject } from "../redux/project-slice";
import { setData } from "../redux/report-slice";
import { getDesign } from "../api/fetch-design";
import { useProjectLoader } from "../reload_fetch";
import { ProjectState } from "../redux/store";
import Details from "../components/details";
import InputData from "../components/input-data/input-data";
import TubeData from "../components/tube-data/tube-data";
import Report from "../report/page";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProjectTabs() {
  const [activeTab, setActiveTab] = useState("details");
  const dispatch = useDispatch();
  const project = useSelector((state: ProjectState) => state.project);
  const user =  useSelector((state: ProjectState) => state.user);
  const [showReport, toggleReport] = useState(false);

  useProjectLoader((proj) => dispatch(setProject(proj)));

  async function calculate() {
    try {
      const report = await getDesign(project);
      dispatch(setData(report));
      if (report.design_summary !== undefined) {
        console.log("Successfully calculated!");
        toggleReport(true);
      } else {
        console.log("Cannot calculate with current input data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const saveProject = async () => {
    if (!project.project_name) {
      console.error("Project name is required");
      alert("Please enter a project name before saving.");
      return;
    }

    if (!project.uuid) {
      console.error("Project creation error");
      alert("Error in creating project");
      return;
    }
    const uuid = project.uuid;
    try {
      const newProject = {
        uuid,
        project_name: project.project_name,
        template: project.template || null,
        designer: project.designer || null,
        description: project.description || null,
        qmin: project.qmin ?? null,
        qmax: project.qmax ?? null,
        airvalve_selection: project.airvalve_selection || null,
        notes: project.notes || null,
        created_at: project.created_at || new Date().toISOString(),
        topo: project.topo || null,
        nSocks: project.nSocks || 0,
        valveFlags: project.valveFlags || null,
        design: project.design || null,
        design_summary: project.design_summary || null,
        library: project.library || null,
        pipe_design: project.pipe_design || null,
        sock_data: project.sock_data || null,
        valves: project.valves || null,
        user_id: project.user_id || user.id,
      };

      dispatch(setProject({ ...project }));

      const { data, error } = await supabase
        .from("projects")
        .upsert([{ ...newProject, uuid }], { onConflict: ["uuid"] });

      if (error) {
        console.error("Error inserting project:", error.message);
      } else {
        console.log("Project saved successfully:", project.uuid);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-start min-h-screen pt-10 w-full">
      <h1 className="text-2xl font-bold mb-4">{project.project_name}</h1>
      <div className="w-full max-w-5xl">
        <div className="flex justify-around border-b w-full">
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "details"
                ? "border-b-2 border-sky-500 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "input_data"
                ? "border-b-2 border-sky-500 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("input_data")}
          >
            Input Data
          </button>
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "tube_data"
                ? "border-b-2 border-sky-500 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("tube_data")}
          >
            Tube Data
          </button>
        </div>
        <div className="p-4 w-full">
          {activeTab === "details" && <Details />}
          {activeTab === "input_data" && <InputData />}
          {activeTab === "tube_data" && <TubeData />}
        </div>
      </div>
      {showReport ? (
        <Report calculate={calculate}/>
      ) : (
        <button
          className="mt-3 px-5 py-3 bg-sky-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 max-w-sm"
          onClick={async () => {
            await saveProject();
            await calculate();
          }}
        >
          Calculate Report
        </button>
      )}
    </div>
  );
}
