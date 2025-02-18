"use client";

import { setProject } from "../redux/project-slice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { ProjectState } from "../redux/store";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import example0 from "../../../../examples/Example0.json";
import example1 from "../../../../examples/Example1.json";
import example2 from "../../../../examples/Example2.json";
import example3 from "../../../../examples/Example3.json";
import example6 from "../../../../examples/Example6.json";
import example7 from "../../../../examples/Example7.json";

const manualExampleFiles = [
  { name: "Example 0", content: example0 },
  { name: "Example 1", content: example1 },
  { name: "Example 2", content: example2 },
  { name: "Example 3", content: example3 },
  { name: "Example 6", content: example6 },
  { name: "Example 7", content: example7 },
];

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

  const [selectedExampleName, setSelectedExampleName] = useState("");

  const handleExampleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value == "") {
      setSelectedExampleName("");
      return;
    }

    const newFileName = event.target.value;
    const exampleFile = manualExampleFiles.find(
      (file) => file.name === newFileName
    );
    if (exampleFile) {
      dispatch(
        setProject(({
          ...exampleFile.content,
          uuid: project.uuid || exampleFile.content.uuid, 
        }))
      );

      setSelectedExampleName(newFileName);
    } else {
      console.error("Example file not found:", newFileName);
    }
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const createNewProject = async () => {
    if (!project.project_name) {
      console.error("Project name is required");
      alert("Please enter a project name before saving.");
      return;
    }

    const uuid = project.uuid ?? crypto.randomUUID();
    console.log(uuid);
    try {
      const newProject = {
        uuid: uuid,
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
        design: project.design || null,
        design_summary: project.design_summary || null,
        library: project.library || null,
        pipe_design: project.pipe_design || null,
        sock_data: project.sock_data || null,
        valves: project.valves || null,
      };

      dispatch(
        setProject({
          ...project,
          uuid: uuid,
        })
      );

      const { data, error } = await supabase
        .from("projects")
        .update([newProject])
        .eq("uuid", project.uuid);

      if (error) {
        console.error("Error inserting project:", error.message);
        alert("Failed to save the project. Please try again.");
      } else {
        console.log("Project saved successfully:", project.uuid);
        alert("Project created successfully!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <main className="mx-auto max-w-4xl py-12 sm:px-6 lg:px-8">
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
                    htmlFor="template"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {t("template")}
                  </label>
                  <div className="mt-2">
                    <select
                      name="project"
                      id="project"
                      value={project.template || ""}
                      onChange={handleExampleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    >
                      <option value="">None (Optional)</option>
                      {manualExampleFiles.map((file) => (
                        <option key={file.name} value={file.name}>
                          {file.name}
                        </option>
                      ))}
                    </select>
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
                <button
                  type="button"
                  onClick={createNewProject}
                  className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
                >
                  Save Project
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
