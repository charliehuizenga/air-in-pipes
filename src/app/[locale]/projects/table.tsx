"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export default function ProjectTable({
  projects,
  onSelect,
  onDelete,
  toggleDelete = true,
}) {
  const t = useTranslations("projects");

  return (
    <table className="min-w-full mt-2 border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">
            {t("project-name")}
          </th>
          {toggleDelete && (
            <th className="border border-gray-300 px-2 py-2 text-center w-12">
              {t("actions")}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {projects.length > 0 ? (
          projects.map((p) => (
            <tr key={p.uuid} className="hover:bg-gray-50">
              <td
                className="border border-gray-300 px-4 py-2 cursor-pointer text-sky-600"
                onClick={() => onSelect(p.uuid)}
              >
                {p.project_name}
                {p.organizations?.name && (
                  <span className="ml-2 text-sm text-gray-500">
                    – {p.organizations.name}
                  </span>
                )}
              </td>
              {toggleDelete && (
                <td className="border border-gray-300 px-2 py-2 text-center w-12">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(p.uuid);
                    }}
                    className="p-1 rounded-md text-red-500 hover:text-red-700"
                    title={t("delete")}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2} className="text-center text-gray-500 py-4">
              {t("no-projects-found")}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
