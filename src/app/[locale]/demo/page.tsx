"use client";

import { useEffect, useState } from "react";
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
import { initialState, setProject } from "../redux/project-slice";

export default function Demo({ initial = initialState }) {
  const [activeTab, setActiveTab] = useState("details");
  const [projectVersion, setProjectVersion] = useState(0);
  const [lastCalculatedVersion, setLastCalculatedVersion] = useState(-1);
  const dispatch = useDispatch();
  const project = useSelector((state: ProjectState) => state.project);
  const t = useTranslations("report");
  const tnav = useTranslations("nav-bar");

  useEffect(() => {
    dispatch(setProject(initial));
  }, [dispatch, initial]);

  function invalidateReport() {
    setProjectVersion((v) => v + 1);
  }

  async function calculate() {
    console.log(project);
    try {
      const remappedPipes = project.library.pipe_data.filter(pipe => pipe.available);

      const res = await getDesign({
        ...project,
        library: {
          ...project.library,
          pipe_data: remappedPipes,
        },
      });

      dispatch(setData(res));
      if (res.design_summary !== undefined) {
        console.log("Successfully calculated!");
        dispatch(setProject({ ...project, report: res }));
        setLastCalculatedVersion(projectVersion);
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
          {activeTab === "details" && <Details project={project} invalidateReport={invalidateReport}/>}
          {activeTab === "input_data" && <InputData project={project} invalidateReport={invalidateReport}/>}
          {activeTab === "tube_data" && <TubeData project={project} invalidateReport={invalidateReport}/>}
        </div>
      </div>
      {projectVersion === lastCalculatedVersion ? (
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
