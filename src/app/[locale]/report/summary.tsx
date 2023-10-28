/** The report page **/
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import { NavBarProps } from "../components/navbar";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { ProjectState } from "../redux/store";
import { Project } from "../redux/project-slice";
import { Report } from "../redux/report-slice";
import Error from "./error";

interface SummaryProps {
  report: Report;
  project: Project;
}

export default function Summary({ report, project }: SummaryProps) {
  //   const t = useTranslations("profile-data");

  // Access design_summary from the data
  const designSummary = report.design_summary;

  const pipeSummary = designSummary.map((item) => {
    return `${item.length.toFixed(1)}   m ${item.nominal_size} SDR ${item.sdr}`;
  });

  return (
    <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          This is a case {report.design.design_case}
        </p>
      </div>
      <div className="mt-6">
        <dl className="grid grid-cols-1 sm:grid-cols-4">
          <div className="border-t border-gray-100 px-4 py-6 sm:px-0 sm:col-span-4">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Total cost
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              C${" "}
              {(
                report.design.cost +
                project.library.valve_cost * report.design.valve_count
              ).toFixed(2)}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6  sm:px-0 sm:col-span-2">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Number of air valves
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {report.design.valve_count}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6  sm:px-0 sm:col-span-2">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Valve Cost
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              C$ {project.library.valve_cost * report.design.valve_count}
            </dd>
          </div>

          <div className="border-t border-gray-100 px-4 py-6 sm:px-0 sm:col-span-2">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Pipe Design
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {pipeSummary.map((item, index) => (
                <span key={index}>
                  {item}
                  {index !== pipeSummary.length - 1 && <br />}
                </span>
              ))}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:px-0 sm:col-span-2">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Pipe Cost
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {designSummary.map((item, index) => (
                <span key={index}>
                  C$ {item.cost.toFixed(2)}
                  {index !== pipeSummary.length - 1 && <br />}
                </span>
              ))}
            </dd>
          </div>

          <div className="border-t border-gray-100 px-4 py-6  sm:px-0 sm:col-span-1">
            <dt className="text-sm font-medium leading-6 text-gray-900">Ha</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {designSummary
                .reduce((sum, item) => sum + item.length, 0)
                .toFixed(2)}{" "}
              m
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6  sm:px-0 sm:col-span-1">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Length
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {designSummary
                .reduce((sum, item) => sum + item.length, 0)
                .toFixed(2)}{" "}
              m
            </dd>
          </div>
          {/* <div className="border-t border-gray-100 px-4 py-6  sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Pipe Cost
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              C$ {report.design.cost.toFixed(2)}
            </dd>
          </div> */}
        </dl>
      </div>
    </div>
  );
}
