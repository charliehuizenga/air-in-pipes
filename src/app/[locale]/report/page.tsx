"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import { setProject } from "../redux/project-slice";
import { ProjectState } from "../redux/store";
import Summary from "./summary";
import Graph from "./graph";
import Detail from "./detail";
import { createClient } from "@supabase/supabase-js";
import { useProjectLoader } from "../reload_fetch";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Report(props) {
  const { calculate } = props;
  const t = useTranslations("report");
  const report = useSelector((state: ProjectState) => state.report);
  const project = useSelector((state: ProjectState) => state.project);
  const dispatch = useDispatch();

  useProjectLoader((proj) => {
    dispatch(setProject(proj));
  });

  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="p-4 flex flex-col items-center justify-start min-h-screen w-full">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl">
        <h1 className="text-center text-2xl font-bold mb-4">Report</h1>
        <div className="flex justify-around border-b w-full">
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "summary"
                ? "border-b-2 border-sky-500 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("summary")}
          >
            {t("summary")}
          </button>
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "graph"
                ? "border-b-2 border-sky-500 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("graph")}
          >
            {t("graph")}
          </button>
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "detail"
                ? "border-b-2 border-sky-500 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("detail")}
          >
            {t("detail")}
          </button>
        </div>
        <div className="p-4 w-full">
          {activeTab === "summary" && <Summary report={report} project={project} />}
          {activeTab === "graph" && <Graph report={report} project={project} />}
          {activeTab === "detail" && <Detail report={report} project={project} />}
        </div>
        <div className="mt-3 flex justify-end space-x-4">
          <button
            type="button"
            className="px-5 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Re-Calculate
          </button>
          <button
            type="button"
            className="px-5 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
}
