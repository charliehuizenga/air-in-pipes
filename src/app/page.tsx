import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <main>
      <div className="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
        <form>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Project Information
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="project-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Project
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="project-name"
                      id="project-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="designer-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Designer
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="designer-name"
                      id="designer-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="design-id"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Design ID
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="design-id"
                      id="design-id"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Date
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="date"
                      id="date"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Notes
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="notes"
                      name="note"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Design Options
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600"></p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="minimum-flow"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Minimum Flow (l/s)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="minimum-flow"
                      id="minimum-flow"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="maximum-flow"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Maxmimum Flow (l/s)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="maximum-flow"
                      id="maximum-flow"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">
                    Valve Design
                  </legend>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Automatic valve design is recommended. Use manual method
                    with cautions.
                  </p>
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center gap-x-3">
                      <input
                        id="automatic-valve"
                        name="valve-design"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-sky-500 focus:ring-sky-500"
                      />
                      <label
                        htmlFor="automatic-valve"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Automatic valve design
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="manual-valve"
                        name="valve-design"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-sky-500 focus:ring-sky-500"
                      />
                      <label
                        htmlFor="manual-valve"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Manual valve design
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
