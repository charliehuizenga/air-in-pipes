"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { setProject } from "../../redux/project-slice";
import { setData } from "../../redux/report-slice";
import { getDesign } from "../../api/fetch-design";
import { useProjectLoader } from "../../reload_fetch";
import { ProjectState } from "../../redux/store";
import Details from "../../components/details";
import InputData from "../../components/input-data/input-data";
import TubeData from "../../components/tube-data/tube-data";
import Report from "../../report/page";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProjectTabs() {
  const [activeTab, setActiveTab] = useState("details");
  const dispatch = useDispatch();
  const project = useSelector((state: ProjectState) => state.project);
  const report = useSelector((state: ProjectState) => state.report);
  const user = useSelector((state: ProjectState) => state.user);
  const [showReport, toggleReport] = useState(false);
  const t = useTranslations("report");
  const tnav = useTranslations("nav-bar");
  const locale = usePathname().split("/")[1];
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backHref =
    from === "org" ? `/${locale}/org/${project.org_id}` : `/${locale}/projects`;
  const router = useRouter();

  useProjectLoader((proj) => {dispatch(setProject(proj)); console.log(proj);});

  async function calculate() {
    try {
      const res = await getDesign(project);
      dispatch(setData(res));
      if (res.design_summary !== undefined) {
        console.log("Successfully calculated!");
        toggleReport(true);
        dispatch(setProject({ ...project, report: res }));
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
      alert(t("missing-name"));
      return;
    }

    if (!project.uuid) {
      console.error("Project creation error");
      alert(t("creation-error"));
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
        report: report || null,
        library: project.library || null,
        pipe_design: project.pipe_design || null,
        sock_data: project.sock_data || null,
        valves: project.valves || null,
        user_id: project.user_id || user.id,
        org_id: project.org_id || null,
      };

      dispatch(setProject({ ...project }));

      const { data, error } = await supabase
        .from("projects")
        .upsert([{ ...newProject, uuid }], { onConflict: "uuid" });

      if (error) {
        console.error("Error inserting project:", error.message);
      } else {
        console.log("Project saved successfully:", project.uuid);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert(t("unexpected-error"));
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-start min-h-screen pt-10 w-full">
      <div className="w-full max-w-5xl mb-4">
        <button
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm font-medium"
          onClick={() => router.push(backHref)}
        >
          {t("back")}
        </button>
      </div>
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
            {t("details")}
          </button>
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "input_data"
                ? "border-b-2 border-sky-500 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("input_data")}
          >
            {tnav("input-data")}
          </button>
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "tube_data"
                ? "border-b-2 border-sky-500 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("tube_data")}
          >
            {tnav("tube-data")}
          </button>
        </div>
        <div className="p-4 w-full">
          {activeTab === "details" && <Details project={project}/>}
          {activeTab === "input_data" && <InputData project={project}/>}
          {activeTab === "tube_data" && <TubeData project={project}/>}
        </div>
      </div>
      {showReport ? (
        <Report calculate={calculate} saveProject={saveProject} />
      ) : (
        <div className="mt-3 flex flex-col sm:flex-row gap-3 max-w-sm">
          <button
            className="px-5 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 w-full"
            onClick={saveProject}
          >
            {t("save")}
          </button>

          <button
            className="px-5 py-3 bg-sky-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 w-full"
            onClick={() => {
              saveProject();
              calculate();
            }}
          >
            {t("calculate")}
          </button>
        </div>
      )}
    </div>
  );
}
