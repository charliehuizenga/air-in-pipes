/** The report page **/
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";

import { ProjectState } from "../redux/store";
import { Tab } from "../input-data/page";
import Summary from "./summary";
import Graph from "./graph";
import Detail from "./detail";
import { createClient } from "@supabase/supabase-js";

export default function Report() {
  const t = useTranslations("report");
  const report = useSelector((state: ProjectState) => state.report);
  const project = useSelector((state: ProjectState) => state.project);
  const dispatch = useDispatch();

  const reportTabs: Tab[] = [
    {
      name: t("summary"),
      current: true,
    },
    {
      name: t("graph"),
      current: false,
    },
    {
      name: t("detail"),
      current: false,
    },
  ];

  const [activeTab, setActiveTab] = useState(
    reportTabs.find((tab) => tab.current)?.name
  );

  function handleTabClick(tabName: string) {
    setActiveTab(tabName);
  }

  function classNames(...classes: any[]): string {
    return classes.filter(Boolean).join(" ");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const saveReportToProject = async () => {
    if (!project.project_name) {
      console.error("Project name is required");
      alert("Please enter a project name before saving.");
      return;
    }

    console.log(report);
    console.log(project);

    try {
      const newProject = {
        uuid: project.uuid,
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
        design: report.design || null,
        design_summary: report.design_summary || null,
        library: project.library || null,
        pipe_design: report.pipe_design || null,
        sock_data: report.sock_data || null,
        valves: report.valves || null,
      };

      const { data, error } = await supabase
        .from("projects")
        .update([newProject])
        .eq("uuid", project.uuid);

      if (error) {
        console.error("Error inserting project:", error.message);
        alert("Failed to save the project. Please try again.");
      } else {
        console.log("Project saved successfully:", data);
        alert("Project created successfully!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div className="hidden sm:block mx-auto max-w-5xl py-12 sm:px-6 lg:px-8">
        <nav className="flex space-x-4" aria-label="Tabs">
          {reportTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className={classNames(
                tab.name === activeTab
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-500 hover:text-gray-700",
                "rounded-md px-3 py-2 text-sm font-medium"
              )}
              aria-current={tab.name === activeTab ? "page" : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === t("summary") && (
        <Summary report={report} project={project}></Summary>
      )}

      {activeTab === t("graph") && (
        <Graph report={report} project={project}></Graph>
      )}

      {activeTab === t("detail") && (
        <Detail report={report} project={project}></Detail>
      )}
      <button
        type="button"
        onClick={saveReportToProject}
        className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
      >
        Save Project
      </button>
    </div>
  );
}
