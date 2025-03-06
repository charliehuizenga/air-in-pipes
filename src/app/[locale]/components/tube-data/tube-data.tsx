"use client";
import { useEffect, useRef, useState } from "react";
import {
  setLibrary,
  togglePipeAvailability,
  setProject,
} from "../../redux/project-slice";
import { useDispatch, useSelector } from "react-redux";
import { ProjectState } from "../../redux/store";
import { PipeData } from "./tube_list";
import { useProjectLoader } from "../../reload_fetch";

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function ImportPipeData({ isOpen, setIsOpen }) {
  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Pipe Data</h2>
          <p className="text-gray-700">Select a project to import pipe data from:</p>
          <select className="mt-3 w-full p-2 border rounded">
            <option>Project 1</option>
            <option>Project 2</option>
            <option>Project 3</option>
          </select>
          <button
            className="mt-4 w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600"
            onClick={() => setIsOpen(false)}
          >
            Import
          </button>
        </div>
      </div>
    )
  );
}

export default function TubeData() {
  const dispatch = useDispatch();
  const pipeData = useSelector(
    (state: ProjectState) => state.project.library.pipe_data
  );
  const cost = useSelector(
    (state: ProjectState) => state.project.library.valve_cost
  );

  useProjectLoader((proj) => dispatch(setProject(proj)));
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const allAvailable = pipeData.every((pipe: PipeData) => pipe.available);
    const someAvailable = pipeData.some((pipe: PipeData) => pipe.available);
    setChecked(allAvailable);
    setIndeterminate(!allAvailable && someAvailable);
    if (checkbox.current) {
      checkbox.current.indeterminate = !allAvailable && someAvailable;
    }

    dispatch(setLibrary({ data: pipeData, valveCost: cost }));
  }, [pipeData, cost, dispatch]);

  function toggleAll() {
    dispatch(
      setLibrary({
        data: pipeData.map((pipe: PipeData) => ({
          ...pipe,
          available: !checked && !indeterminate,
        })),
        valveCost: cost,
      })
    );
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
    <div className="mx-auto max-w-5xl py-12 sm:px-6 lg:px-8">
      <ImportPipeData isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />

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

          <div className="flex flex-row items-center gap-7 ">
            <button
              className="rounded-md bg-sky-500 px-3 py-1 text-l font-semibold text-white shadow-sm hover:bg-sky-600 focus:ring-2 focus:ring-inset focus:ring-sky-600"
              onClick={() => setIsPopupOpen(true)}
            >
              Import from Project
            </button>
            <label className="block text-sm font-medium text-gray-700">
              Cost of valves that extract air
            </label>
            <div className="flex-shrink-0">
              <input
                type="text"
                value={cost}
                onChange={(e) =>
                  dispatch(setLibrary({ data: pipeData, valveCost: Number(e.target.value) }))
                }
                className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
              />
            </div>
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
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                            ref={checkbox}
                            checked={checked}
                            onChange={toggleAll}
                          />
                          <span className="px-4 text-sm font-semibold text-gray-900">
                            Available
                          </span>
                        </div>
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Nominal Size
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        SDR
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        ID
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pipeData.map((pipe: PipeData) => (
                      <tr key={pipe.id}>
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                            checked={pipe.available}
                            onChange={(e) =>
                              dispatch(togglePipeAvailability({ pipeId: pipe.id, isChecked: e.target.checked }))
                            }
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
