"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

type Point = {
  label: string;
  length: number;
  height: number;
};

type InputValues = {
  [K in keyof Point]?: string;
};

export default function ProfileData() {
  const [inputValues, setInputValues] = useState<InputValues[]>([]);
  const [topo, setTopo] = useState<Point[]>([
    { label: "1", length: 0, height: 0 },
    { label: "2", length: 20.46, height: -6.1 },
    { label: "4", length: 30.42, height: -7.1 },
    // More points...
  ]);
  useEffect(() => {
    // Code to run on component mount
    const newInputValues = topo.map((point) => ({
      label: point.label,
      length: point.length.toString(),
      height: point.height.toString(),
    }));

    setInputValues(newInputValues);
  }, []);
  const handleRemove = (index: number) => {
    const newTopo = [...topo];
    newTopo.splice(index, 1);
    setTopo(newTopo);
  };

  // Slope calculation function with type checks
  function calculateSlope(
    next_length: number,
    current_length: number,
    next_height: number,
    current_height: number
  ): number {
    if (
      !isNaN(current_length) &&
      !isNaN(current_height) &&
      !isNaN(next_length) &&
      !isNaN(next_height)
    ) {
      const deltaY = next_height - current_height;
      const deltaX = next_length - current_length;
      const result = deltaY / deltaX;
      return parseFloat(result.toFixed(2));
    } else {
      return 0;
    }
  }

  function calculateStart(next_length: number, current_length: number): number {
    if (!isNaN(current_length) && !isNaN(next_length)) {
      return current_length;
    } else {
      return 0;
    }
  }
  const handleChange = (index: number, key: keyof Point, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = { ...newInputValues[index], [key]: value };
    setInputValues(newInputValues);

    // Try to convert to number and update topo state if it's a valid number or intermediary input
    if (key === "length" || key === "height") {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) || value === "") {
        const newTopo = [...topo];
        newTopo[index][key] = isNaN(numericValue) ? 0 : numericValue;
        setTopo(newTopo);
      }
    } else {
      const newTopo = [...topo];
      newTopo[index][key] = value;
      setTopo(newTopo);
    }
  };
  const handleAddPoint = () => {
    setTopo((prevTopo) => [
      ...prevTopo,
      { label: "", length: NaN, height: NaN },
    ]);
  };

  return (
    <div className="mx-auto max-w-5xl py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Profile Data
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the conduction line points
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={handleAddPoint}
              className="block rounded-md bg-sky-500 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Add Point
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full  py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="w-1/5 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Label
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Length
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Height
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Slope
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Start
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
                          value={point.label}
                          onChange={(e) =>
                            handleChange(index, "label", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border-0 rounded-md border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <input
                          type="text"
                          value={inputValues[index]?.length || ""}
                          onChange={(e) =>
                            handleChange(index, "length", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border-0 rounded-md border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <input
                          type="text"
                          value={inputValues[index]?.height || ""}
                          onChange={(e) =>
                            handleChange(index, "height", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border-0 rounded-md border-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                        {index < topo.length - 1
                          ? calculateSlope(
                              topo[index + 1].length,
                              point.length,
                              topo[index + 1].height,
                              point.height
                            )
                          : "0"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                        {index < topo.length - 1
                          ? calculateStart(topo[index + 1].length, point.length)
                          : "0"}
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
