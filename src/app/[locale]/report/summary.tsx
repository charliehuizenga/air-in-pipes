/** The report page **/
"use client";
import { useTranslations } from "next-intl";
import { Project } from "../redux/project-slice";
import { Report } from "../redux/report-slice";

interface SummaryProps {
  report: Report;
  project: Project;
}

export default function Summary({ report, project }: SummaryProps) {
  const t = useTranslations("report");

  // show user that report is loading if both 'report' and 'report.design_summary' are present
  if (!report || !report.design_summary) {
    return <div>Loading report data...</div>;
  }

  // return an error message if design_summary is not present in ''report'
  if (!report.design_summary) {
    return <div>Error: Report summary data is not available.</div>
  }

  // if design_summary is present but empty, show user message code compiled but is empty
  if (report.design_summary.length == 0) {
    return <div>No summary data available for this report</div>;
  }

  // If all above checks passed, begin rendering summary

  // Access design_summary from the data
  const designSummary = report.design_summary;

  const pipeSummary = designSummary.map((item) => {
    return `${item.length.toFixed(1)}   m ${item.nominal_size} SDR ${item.sdr}`;
  });

  return (
    <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          {t("case-intro") + " " + report.design.design_case}
        </p>
      </div>
      <div className="mt-6">
        <dl className="grid grid-cols-1 sm:grid-cols-4">
          <div className="border-t border-gray-100 px-4 py-6 sm:px-0 sm:col-span-4">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              {t("total-cost")}
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
              {t("number-air-valves")}
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {report.design.valve_count}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6  sm:px-0 sm:col-span-2">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              {t("valve-cost")}
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              C$ {project.library.valve_cost * report.design.valve_count}
            </dd>
          </div>

          <div className="border-t border-gray-100 px-4 py-6 sm:px-0 sm:col-span-2">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              {t("pipe-design")}
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
              {t("pipe-cost")}
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
              {t("length")}
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
