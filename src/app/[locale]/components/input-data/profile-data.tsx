/** The page for profile-data, where the user can input their own topography data */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { isHighPoint, calculateSlope, calculateStart } from "./utils";
import { useDispatch } from "react-redux";
import { setTopo, Topo, removeTopo } from "../../redux/project-slice";

// ----- Types ----- //

type InputValues = {
  [K in keyof Topo]?: string;
};

export default function ProfileData({ project, invalidateReport }) {
  const t = useTranslations("profile-data");
  const topo = project.topo;
  const dispatch = useDispatch();

  const [inputValues, setInputValues] = useState<InputValues[]>([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]); // State to track high points (need valves)

  useEffect(() => {
    if (!topo || topo.length === 0) return;
  
    const newInputValues = topo.map((point) => ({
      name: point.name ?? "",
      l: point.l?.toString() ?? "",
      h: point.h?.toString() ?? "",
    }));
  
    const newCheckedItems = topo.map((point, idx) => {
      const prev = idx > 0 ? topo[idx - 1].h : point.h;
      const next = idx < topo.length - 1 ? topo[idx + 1].h : point.h;
      return isHighPoint(prev, point.h, next);
    });
  
    const valveCount = newCheckedItems.reduce(
      (total, isChecked) => total + (isChecked ? 1 : 0),
      0
    );
  
    setInputValues(newInputValues);
    setCheckedItems(newCheckedItems);
  
    dispatch(
      setTopo({
        topoData: topo,
        valveCount,
        valveFlags: newCheckedItems,
      })
    );
  
    invalidateReport();
  }, [topo, dispatch]);
  

  const handleRemove = (index: number) => {
    dispatch(removeTopo(index));
    setCheckedItems((prev) => prev.filter((_, i) => i !== index));
    setInputValues((prev) => prev.filter((_, i) => i !== index));
    invalidateReport();
  };

  const handleClear = () => {
    const blankPoint = { name: "", l: 0, h: 0 };
    const blankInput = { name: "", l: "", h: "" };

    setInputValues([blankInput]);
    setCheckedItems([false]);
    dispatch(setTopo({ topoData: [blankPoint], valveCount: 0 }));
    invalidateReport();
  };

  // Function to add a new point
  const handleAddPoint = () => {
    const newPoint = { name: "", l: 0, h: 0 }; // Ensuring valid initial values
    const newTopo = [...topo, newPoint];

    setCheckedItems((prevCheckedItems) => [
      ...prevCheckedItems,
      newTopo.length > 2
        ? isHighPoint(
          newTopo[newTopo.length - 3].h,
          newTopo[newTopo.length - 2].h,
          newTopo[newTopo.length - 1].h
        )
        : false,
    ]);

    setInputValues((prev) => [...prev, { name: "", l: "", h: "" }]);
    dispatch(setTopo({ topoData: newTopo, valveCount: checkedCount }));
    invalidateReport();
  };

  // Function to paste data from spreadshet
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.trim().split("\n");

      const newPoints = lines.map((line) => {
        const [name, l, h] = line.split("\t");
        return {
          name: name?.trim() ?? "",
          l: parseFloat(l),
          h: parseFloat(h),
        };
      });

      const newInputValues = newPoints.map((p) => ({
        name: p.name,
        l: p.l.toString(),
        h: p.h.toString(),
      }));

      const newCheckedItems = newPoints.map((_, index) => {
        if (index < 2) return false;
        const a = newPoints[index - 2].h;
        const b = newPoints[index - 1].h;
        const c = newPoints[index].h;
        return isHighPoint(a, b, c);
      });

      // Replace all existing data
      setInputValues(newInputValues);
      setCheckedItems(newCheckedItems);
      dispatch(setTopo({ topoData: newPoints, valveCount: checkedCount }));
      invalidateReport();

    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  // Function to handle input changes
  const handleChange = (index: number, key: keyof Topo, value: string) => {
    setInputValues((prev) => {
      const newValues = [...prev];
      newValues[index] = { ...newValues[index], [key]: value ?? "" };
      return newValues;
    });

    const newTopo = [...topo];
    if (key === "l" || key === "h") {
      const numericValue = parseFloat(value);
      newTopo[index] = {
        ...newTopo[index],
        [key]: isNaN(numericValue) ? 0 : numericValue,
      };
    } else {
      newTopo[index] = { ...newTopo[index], [key]: value };
    }

    dispatch(
      setTopo({
        topoData: newTopo,
        valveCount: checkedCount,
        valveFlags: checkedItems,
      })
    );
    console.log(project);
    invalidateReport();
  };

  const checkedCount = checkedItems.reduce(
    (total, isChecked) => total + (isChecked ? 1 : 0),
    0
  );

  return (
    <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 mb-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <p className="mt-2 text-sm text-gray-700">
              {t("profile-data-note")}
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={handlePaste}
              className="block rounded-md bg-sky-500 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              {t("paste-topo")}
            </button>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={handleAddPoint}
              className="block rounded-md bg-sky-500 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              {t("add-point")}
            </button>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={handleClear}
              className="block rounded-md bg-sky-500 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              {t("clear-topo")}
            </button>
          </div>


        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full  py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300 mb-16">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="w-1/5 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      {t("label")}
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("length")}
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("height")}
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("slope")}
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("start")}
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("valve")}
                    </th>
                    <th
                      scope="col"
                      className=" relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topo.length > 0 ? (
                    topo.map((point, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-3 py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                          <input
                            type="text"
                            value={inputValues[index]?.name ?? ""}
                            onChange={(e) =>
                              handleChange(index, "name", e.target.value)
                            }
                            className="w-full px-2 py-1 text-sm border-0 rounded-md border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <input
                            type="text"
                            value={inputValues[index]?.l ?? ""}
                            onChange={(e) =>
                              handleChange(index, "l", e.target.value)
                            }
                            className="w-full px-2 py-1 text-sm border-0 rounded-md border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <input
                            type="text"
                            value={inputValues[index]?.h ?? ""}
                            onChange={(e) =>
                              handleChange(index, "h", e.target.value)
                            }
                            className="w-full px-2 py-1 text-sm border-0 rounded-md border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                          {index < topo.length - 1
                            ? calculateSlope(
                                topo[index + 1]?.l ?? 0,
                                point.l ?? 0,
                                topo[index + 1]?.h ?? 0,
                                point.h ?? 0
                              )
                            : "0"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                          {index < topo.length - 1
                            ? calculateStart(
                                topo[index + 1]?.l ?? 0,
                                point.l ?? 0
                              )
                            : "0"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <input
                            type="checkbox"
                            checked={checkedItems[index] ?? false}
                            onChange={() => handleCheckboxClick(index)}
                            disabled={project.airvalve_selection === "auto"}
                            className={`h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 ${
                              project.airvalve_selection === "auto"
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          />
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button
                            onClick={() => handleRemove(index)}
                            className="text-sky-500 hover:text-sky-700"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center text-gray-500 py-4"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
