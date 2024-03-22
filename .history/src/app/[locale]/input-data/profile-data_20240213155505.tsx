/** The page for profile-data, where the user can input their own topography data */
"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { isHighPoint, calculateSlope, calculateStart } from "./utils";
import { useSelector, useDispatch } from "react-redux";
import { setTopo, Topo, removeTopo } from "../redux/project-slice";
import { ProjectState } from "../redux/store";

// ----- Types ----- //

type InputValues = {
  [K in keyof Topo]?: string;
};

export default function ProfileData() {
  const t = useTranslations("profile-data");
  const topo = useSelector((state: ProjectState) => state.project.topo);
  const dispatch = useDispatch();

  // ----- States ----- //

  // State to hold the points of the profile-data table

  const [inputValues, setInputValues] = useState<InputValues[]>([]); // Temporary state for when use adds a new point and type in values
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]); // State to hold the points that are high-point (needs a valve)

  //----- useEffects ----- //
  useEffect(() => {
    // Code to run on component mount
    const newInputValues = topo.map((point) => ({
      name: point.name,
      l: point.l.toString(),
      h: point.h.toString(),
    }));

    setInputValues(newInputValues);
    setCheckedItems(topo.map(() => false)); // All unchecked by default
  }, []);

  useEffect(() => {
    setCheckedItems(
      topo.map((point, idx) => {
        const prevHeight = idx > 0 ? topo[idx - 1].h : point.h;
        const nextHeight = idx < topo.length - 1 ? topo[idx + 1].h : point.h;
        return isHighPoint(prevHeight, point.h, nextHeight);
      })
    );
  }, [topo]);

  // ----- Handle functions ----- //

  // Function to deal with removing a table point
  const handleRemove = (index: number) => {
    dispatch(removeTopo(index));
    const newCheckedItems = [...checkedItems];
    newCheckedItems.splice(index, 1);
    setCheckedItems(newCheckedItems);
    const newInputValues = [...inputValues];
    newInputValues.splice(index, 1);
    setInputValues(newInputValues);
  };

  // Function to deal with user adding a new point
  const handleAddPoint = () => {
    const newPoint = { name: "", l: NaN, h: NaN };
    const newTopo = [...topo, newPoint];

    console.log("topo: " + JSON.stringify(topo));
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

    dispatch(setTopo({ topoData: newTopo, valveCount: checkedCount }));
  };

  // Function to deal with clicking a highpoint checkbox
  const handleCheckboxClick = (index: number) => {
    setCheckedItems((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // Function to deal with user mid-typing a point
  const handleChange = (index: number, key: keyof Topo, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = { ...newInputValues[index], [key]: value };
    setInputValues(newInputValues);

    // Try to convert to number and update topo state if it's a valid number or intermediary input
    if (key === "l" || key === "h") {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) || value === "") {
        const newTopo = [...topo];
        newTopo[index] = {
          ...newTopo[index],
          [key]: isNaN(parseFloat(value)) ? 0 : parseFloat(value),
        };
        dispatch(setTopo({ topoData: newTopo, valveCount: checkedCount }));
      }
    } else {
      const newTopo = [...topo];
      newTopo[index] = { ...newTopo[index], [key]: value };
      dispatch(setTopo({ topoData: newTopo, valveCount: checkedCount }));
    }
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
              onClick={handleAddPoint}
              className="block rounded-md bg-sky-500 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              {t("add-point")}
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
                  {topo.map((point, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-3 py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                        <input
                          type="text"
                          value={point.name}
                          onChange={(e) =>
                            handleChange(index, "name", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border-0 rounded-md border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <input
                          type="text"
                          value={inputValues[index]?.l || ""}
                          onChange={(e) =>
                            handleChange(index, "l", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border-0 rounded-md border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <input
                          type="text"
                          value={inputValues[index]?.h || ""}
                          onChange={(e) =>
                            handleChange(index, "h", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border-0 rounded-md border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                        {index < topo.length - 1
                          ? calculateSlope(
                              topo[index + 1].l,
                              point.l,
                              topo[index + 1].h,
                              point.h
                            )
                          : "0"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                        {index < topo.length - 1
                          ? calculateStart(topo[index + 1].l, point.l)
                          : "0"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={checkedItems[index]}
                          onChange={() => handleCheckboxClick(index)}
                          className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                        />
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <XMarkIcon
                          onClick={() => handleRemove(index)}
                          className="block h-5 w-5 text-sky-500 hover:text-sky-700"
                        >
                          Remove
                        </XMarkIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
