import { Fragment, useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface AlertProps {
  type: string;
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type = "success", message }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const isSuccess = type === "success";

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed bottom-0 right-0 mb-4 mr-4 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <Transition
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="pointer-events-auto w-full flex flex-shrink-0 max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {isSuccess ? (
                  <CheckCircleIcon
                    className="h-6 w-6 text-green-400"
                    aria-hidden="true"
                  />
                ) : (
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-400"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex-grow">
                <p
                  className={`text-sm font-medium ${
                    isSuccess ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {message}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="ml-4 inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => {
                setShow(false);
              }}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Alert;
