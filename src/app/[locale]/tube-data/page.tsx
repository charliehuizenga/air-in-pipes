"use client";
import { useLayoutEffect, useRef, useState } from "react";

type PipeData = {
  nominal_size: string;
  sdr: number;
  id: number;
  cost: number;
  available: boolean;
};

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TubeData() {
  const [cost, setCost] = useState<number>(380);
  const [pipeData, setPipeData] = useState<PipeData[]>([
    {
      nominal_size: '1/2"',
      sdr: 13,
      id: 0.0182,
      cost: 7.98,
      available: true,
    },
    {
      nominal_size: '1/2"',
      sdr: 7.7,
      id: 0.0158,
      cost: 15.18,
      available: true,
    },
    {
      nominal_size: '1/2"',
      sdr: 5.7,
      id: 0.0138684,
      cost: 16.2,
      available: true,
    },
    {
      nominal_size: '3/4"',
      sdr: 17,
      id: 0.0235,
      cost: 11.14,
      available: true,
    },
    {
      nominal_size: '3/4"',
      sdr: 9.3,
      id: 0.0209296,
      cost: 22.61,
      available: true,
    },
    {
      nominal_size: '3/4"',
      sdr: 6.8,
      id: 0.0188468,
      cost: 22.2,
      available: true,
    },
    {
      nominal_size: '1"',
      sdr: 26,
      id: 0.0304,
      cost: 14.41,
      available: true,
    },
    {
      nominal_size: '1"',
      sdr: 17,
      id: 0.0295,
      cost: 18.22,
      available: true,
    },
    {
      nominal_size: '1"',
      sdr: 9.9,
      id: 0.0266446,
      cost: 29.89,
      available: true,
    },
    {
      nominal_size: '1"',
      sdr: 7.3,
      id: 0.0243078,
      cost: 37.6,
      available: true,
    },
    {
      nominal_size: '1.5"',
      sdr: 32.5,
      id: 0.0453,
      cost: 21.05,
      available: true,
    },
    {
      nominal_size: '1.5"',
      sdr: 26,
      id: 0.0446,
      cost: 25.46,
      available: true,
    },
    {
      nominal_size: '1.5"',
      sdr: 17,
      id: 0.0426,
      cost: 38.13,
      available: true,
    },
    {
      nominal_size: '1.5"',
      sdr: 13.1,
      id: 0.040894,
      cost: 56.11,
      available: true,
    },
    {
      nominal_size: '1.5"',
      sdr: 9.5,
      id: 0.0381,
      cost: 68.97,
      available: true,
    },
    {
      nominal_size: '2"',
      sdr: 32.5,
      id: 0.0566,
      cost: 32.04,
      available: true,
    },
    {
      nominal_size: '2"',
      sdr: 26,
      id: 0.0557,
      cost: 39.7,
      available: true,
    },
    {
      nominal_size: '2"',
      sdr: 17,
      id: 0.0532,
      cost: 59.82,
      available: true,
    },
    {
      nominal_size: '2"',
      sdr: 15.4,
      id: 0.0525018,
      cost: 77.85,
      available: true,
    },
    {
      nominal_size: '2"',
      sdr: 10.9,
      id: 0.0492506,
      cost: 99.2,
      available: true,
    },
    {
      nominal_size: '3"',
      sdr: 32.5,
      id: 0.0834,
      cost: 69.81,
      available: true,
    },
    {
      nominal_size: '3"',
      sdr: 26,
      id: 0.0821,
      cost: 86.8,
      available: true,
    },
    {
      nominal_size: '3"',
      sdr: 17,
      id: 0.0784,
      cost: 129.43,
      available: true,
    },
    {
      nominal_size: '3"',
      sdr: 16.2,
      id: 0.0779272,
      cost: 162.54,
      available: true,
    },
    {
      nominal_size: '3"',
      sdr: 11.7,
      id: 0.07366,
      cost: 205.58,
      available: true,
    },
    {
      nominal_size: '4"',
      sdr: 32.5,
      id: 0.1073,
      cost: 115.4,
      available: true,
    },
    {
      nominal_size: '4"',
      sdr: 26,
      id: 0.1055,
      cost: 143,
      available: true,
    },
    {
      nominal_size: '4"',
      sdr: 17,
      id: 0.1008,
      cost: 214.34,
      available: true,
    },
    {
      nominal_size: '4"',
      sdr: 13.4,
      id: 0.0971804,
      cost: 309.32,
      available: true,
    },
    {
      nominal_size: '6"',
      sdr: 32.5,
      id: 0.1579,
      cost: 250.6,
      available: true,
    },
    {
      nominal_size: '6"',
      sdr: 26,
      id: 0.1553,
      cost: 320.13,
      available: true,
    },
    {
      nominal_size: '6"',
      sdr: 17,
      id: 0.1485,
      cost: 495.57,
      available: true,
    },
    {
      nominal_size: '6"',
      sdr: 15.3,
      id: 0.1463294,
      cost: 608.92,
      available: true,
    },
    // More pipes...
  ]);
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [selectedPipe, setSelectedPipe] = useState<PipeData[]>([]);

  useLayoutEffect(() => {
    const allAvailable = pipeData.every((pipe) => pipe.available);
    const someAvailable = pipeData.some((pipe) => pipe.available);
    setChecked(allAvailable);
    setIndeterminate(!allAvailable && someAvailable);
    checkbox.current.indeterminate = !allAvailable && someAvailable;
  }, [pipeData]);

  function toggleAll() {
    if (checked || indeterminate) {
      setPipeData(pipeData.map((pipe) => ({ ...pipe, available: false })));
    } else {
      setPipeData(pipeData.map((pipe) => ({ ...pipe, available: true })));
    }
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  function handleCheckboxClick(pipe: PipeData, isChecked: boolean) {
    setPipeData((prevPipeData) => {
      return prevPipeData.map((p) => {
        if (p.id === pipe.id) {
          return { ...p, available: isChecked };
        }
        return p;
      });
    });
  }

  return (
    <div className="mx-auto max-w-5xl py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Tube Data
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the available pipes
            </p>
          </div>

          <div className="flex flex-row items-center gap-3 ">
            <label
              htmlFor="project-name"
              className="block text-sm font-medium font-italicize  text-gray-700"
            >
              Cost of valves that extract air
            </label>
            <div className="flex-shrink-0">
              <input
                type="text"
                name="project-name"
                id="project-name"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
              />
            </div>

            <button
              type="button"
              className="block rounded-md bg-sky-500 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Add Pipe
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative">
                <table className="min-w-full table-fixed divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2  h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                            ref={checkbox}
                            checked={checked}
                            onChange={toggleAll}
                          />
                          <span className="px-4 text-sm font-semibold text-gray-900">
                            Available
                          </span>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Nominal Size
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        SDR
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pipeData.map((pipe) => (
                      <tr
                        key={pipe.id}
                        className={
                          selectedPipe.includes(pipe) ? "bg-gray-50" : undefined
                        }
                      >
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedPipe.includes(pipe) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                            value={pipe.id}
                            checked={pipe.available}
                            onChange={(e) =>
                              handleCheckboxClick(pipe, e.target.checked)
                            }
                          />
                        </td>

                        <td
                          className={classNames(
                            "whitespace-nowrap py-4 px-3 text-sm font-medium",
                            selectedPipe.includes(pipe)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          )}
                        >
                          {pipe.nominal_size}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pipe.sdr}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pipe.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pipe.cost}
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
    </div>
  );
}
