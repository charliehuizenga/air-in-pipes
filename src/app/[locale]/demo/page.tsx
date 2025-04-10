"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { setData } from "../redux/report-slice";
import { getDesign } from "../api/fetch-design";
import { ProjectState } from "../redux/store";
import Details from "../components/details";
import InputData from "../components/input-data/input-data";
import TubeData from "../components/tube-data/tube-data";
import Report from "../report/page";
import { setProject } from "../redux/project-slice";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProjectTabs() {
  const [activeTab, setActiveTab] = useState("details");
  const dispatch = useDispatch();
  const project = useSelector((state: ProjectState) => state.project);
  const [showReport, toggleReport] = useState(false);
  const t = useTranslations("report");
  const tnav = useTranslations("nav-bar");

  async function calculate() {
    try {
      const res = await getDesign(project);
      dispatch(setData(res));
      if (res.design_summary !== undefined) {
        console.log("Successfully calculated!");
        dispatch(setProject({ ...project, report: res }));
        toggleReport(true);
      } else {
        console.log("Cannot calculate with current input data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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
          {activeTab === "details" && <Details />}
          {activeTab === "input_data" && <InputData />}
          {activeTab === "tube_data" && <TubeData />}
        </div>
      </div>
      {showReport ? (
        <Report calculate={calculate} saveProject={() => {console.log("saved");}}/>
      ) : (
        <button
          className="mt-3 px-5 py-3 bg-sky-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 max-w-sm"
          onClick={async () => {
            await calculate();
          }}
        >
          {tnav("calculate")}
        </button>
      )}
    </div>
  );
}
