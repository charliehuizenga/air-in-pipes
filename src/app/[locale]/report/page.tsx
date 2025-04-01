"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import { setProject } from "../redux/project-slice";
import { ProjectState } from "../redux/store";
import Summary from "./summary";
import Graph from "./graph";
import Detail from "./detail";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function Report(props) {
  const { calculate, saveProject } = props;
  const t = useTranslations("report");
  const report = useSelector((state: ProjectState) => state.report);
  const project = useSelector((state: ProjectState) => state.project);

  const [activeTab, setActiveTab] = useState("summary");

  const firstPageRef = useRef(null);
  const secondPageRef = useRef(null);

  async function exportReportToPDF() {
    const pdf = new jsPDF("p", "mm", "a4");
    const marginX = 10;
    const marginY = 10;

    if (firstPageRef.current) {
      const canvas = await html2canvas(firstPageRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210 - 2 * marginX;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);
    }

    if (secondPageRef.current) {
      pdf.addPage();

      const canvas = await html2canvas(secondPageRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210 - 2 * marginX;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);
    }

    pdf.save("report.pdf");
  }

  return (
    <div className="p-4 flex flex-col items-center justify-start min-h-screen w-full">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl">
        <h1 className="text-center text-2xl font-bold mb-4">Report</h1>

        {/* Tabs */}
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
          <div style={{ display: activeTab === "summary" ? "block" : "none" }}>
            <Summary report={report} project={project} />
          </div>
          <div style={{ display: activeTab === "graph" ? "block" : "none" }}>
            <Graph report={report} project={project} />
          </div>
          <div style={{ display: activeTab === "detail" ? "block" : "none" }}>
            <Detail report={report} project={project} />
          </div>
        </div>

        <div style={{ position: "absolute", top: "-9999px", left: "-9999px", width: "1000px" }}>
          <div ref={firstPageRef}>
            <h1 className="text-xl font-bold mb-2">Report</h1>
            <h2 className="text-m font-bold mb-2">Summary</h2>
            <Summary report={report} project={project} />

            <h2 className="text-m font-bold mt-5 mb-2">Graph</h2>
            <Graph report={report} project={project} />
          </div>

          <div ref={secondPageRef}>
            <h2 className="text-m font-bold mt-5 mb-2">Detail</h2>
            <Detail report={report} project={project} />
          </div>
        </div>

        <div className="mt-3 flex justify-end space-x-4">
          <button
            type="button"
            className="px-5 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={() => {
              calculate();
              saveProject();
            }}
          >
            Re-Calculate
          </button>
          <button
            type="button"
            className="px-5 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            onClick={exportReportToPDF}
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
}
