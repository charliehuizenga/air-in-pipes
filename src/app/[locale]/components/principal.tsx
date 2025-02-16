"use client";

import { setProject } from "../redux/project-slice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { ProjectState } from "../redux/store";

export default function Principal() {
  const dispatch = useDispatch();
  const t = useTranslations("principal");
  const project = useSelector((state: ProjectState) => state.project);

  // Handle changes and dispatch immediately to Redux
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Dispatching changes directly to Redux
    dispatch(
      setProject({
        ...project,
        [name]: name === "qmax" || name === "qmin" ? parseFloat(value) : value,
      })
    );

    console.log(project);
  };

  const handleCancel = () => {
    (document.getElementById("principal-form") as HTMLFormElement).reset();
  };

  return (
    <main>
      <div>
        <form id="principal-form">
          <div className="space-y-12">  
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="project-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {t("project")}
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="project_name"
                      id="project-name"
                      value={project.project_name || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="designer-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {t("designer")}
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="designer"
                      value={project.designer || ""}
                      id="designer-name"
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {t("design-id")}
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="description"
                      value={project.description || ""}
                      id="description"
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {t("date")}
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="date"
                      id="date"
                      value={project.date || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {t("notes")}
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="notes"
                      name="notes"
                      defaultValue={project.notes || ""}
                      rows={3}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                {t("design-options")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600"></p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="minimum-flow"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {t("minimum-flow")}
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="qmin"
                      value={project.qmin || ""}
                      onChange={handleChange}
                      id="minimum-flow  "
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="maximum-flow"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {t("maximum-flow")}
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="qmax"
                      value={project.qmax || ""}
                      onChange={handleChange}
                      id="maximum-flow"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">
                    {t("valve-design")}
                  </legend>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {t("valve-design-note")}
                  </p>
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center gap-x-3">
                      <input
                        id="automatic-valve"
                        name="airvalve_selection"
                        type="radio"
                        onChange={handleChange}
                        value="auto"
                        checked={project.airvalve_selection == "auto"}
                        className="h-4 w-4 border-gray-300 text-sky-500 focus:ring-sky-500"
                      />
                      <label
                        htmlFor="automatic-valve"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        {t("automatic-valve-design")}
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="manual-valve"
                        name="airvalve_selection"
                        type="radio"
                        onChange={handleChange}
                        value="manual"
                        checked={project.airvalve_selection == "manual"}
                        className="h-4 w-4 border-gray-300 text-sky-500 focus:ring-sky-500"
                      />
                      <label
                        htmlFor="manual-valve"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        {t("manual-valve-design")}
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
