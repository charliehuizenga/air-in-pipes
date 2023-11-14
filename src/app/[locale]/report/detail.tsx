/** The detail page **/
"use client";
import { useTranslations } from "next-intl";
import { Project } from "../redux/project-slice";
import { Report } from "../redux/report-slice";
import React from "react";
interface SummaryProps {
  report: Report;
  project: Project;
}

export default function Detail({ report, project }: SummaryProps) {
  const t = useTranslations("report");

  // Access design_summary from the data
  const pipeDesign = report.pipe_design;

  // Example automatic valve locations array, replace with actual data if needed
  const valveLocations = Array.isArray(report.valves) ? report.valves : []; // Add your actual automatic valve locations here
  console.log(JSON.stringify(report));
  return (
    <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                {t("position")}
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                {t("length-detail")}
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                {t("description")}
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                {t("automatic-valve-location")}
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pipeDesign.map((pipe, index) => (
              <tr key={pipe.hgl}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                  {pipe.start_pos.toFixed(1)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {pipe.length.toFixed(1)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {`${pipe.nominal_size} SDR ${pipe.sdr}`}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {index < valveLocations.length
                    ? valveLocations[index].position.toFixed(1)
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
