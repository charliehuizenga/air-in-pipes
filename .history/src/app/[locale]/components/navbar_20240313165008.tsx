/** The navigation bar component */
"use client";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProjectState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getDesign } from "../api/fetch-design";
import { setData } from "../redux/report-slice";
import Alert from "./alert";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/router';

function classNames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export interface NavBarProps {
  locale: string;
}
function downloadFile(content: string, fileName: string, contentType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  
  URL.revokeObjectURL(a.href); // Cleanup
}
export default function NavBar({ locale }: NavBarProps) {
  // the current path name
  const pathname = usePathname();
  const isActiveRoute = (href: string) => pathname === href;
  const dispatch = useDispatch();
  const router = useRouter(); 

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // The json object
  const project = useSelector((state: ProjectState) => state.project);

  type NavigationItem = {
    name: string;
    href: string;
  };
  const t = useTranslations("nav-bar");
  const navigation: NavigationItem[] = [
    { name: t("principal"), href: "/" },
    { name: t("input-data"), href: `/${locale}/input-data` },
    { name: t("tube-data"), href: `/${locale}/tube-data` },
    { name: t("report"), href: `/${locale}/report` },
  ];

  const handleSave = () => {
    const jsonStr = JSON.stringify(project);
    downloadFile(jsonStr, "project-data.json", "text/json");
  };

  const handleLoadClick = () => {
    document.getElementById('file-input')?.click();
  };
  const handleFileLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target!.result as string;
      try {
        const jsonData = JSON.parse(content);
        dispatch(setData(jsonData));
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  };

  async function fetchData() {
    // Reset the showAlert state
    setShowAlert(false);
    try {
      const report = await getDesign(project);
      dispatch(setData(report));
      // Check if design_summary exists and is not undefined
      if (report.design_summary !== undefined) {
        setAlertMessage("Successfully calculated!");
        setShowAlert(true);
        setAlertType("success"); // have the user be able to save data here
      } else {
        setAlertMessage("Cannot calculate with current input data.");
        setShowAlert(true);
        setAlertType("error");
      }

      // Ensure the alert is shown every time
      setShowAlert(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <Disclosure as="nav" className="bg-gray-800 font-inter">
      {({ open }) => (
        <>
          {showAlert && <Alert message={alertMessage} type={alertType} />}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center"></div>
                <div className="flex flex-shrink-0 font-semibold text-xl tracking-wide text-sky-400 px-1 items-center ">
                  {" "}
                  Agua Para La Vida
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        isActiveRoute(item.href)
                          ? " bg-gray-900 text-white"
                          : " text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-2 py-2 text-sm font-medium"
                      )}
                      aria-current={
                        isActiveRoute(item.href) ? "page" : undefined
                      }
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="flex-shrink-0">
                  <button onClick={handleSave} className="relative inline-flex items-center gap-x-1.5 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Save</button>
                  <button onClick={handleLoadClick} className="relative inline-flex items-center gap-x-1.5 rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">Load</button>
                  <input type="file" id="file-input" style={{ display: 'none' }} onChange={handleFileLoad} accept=".json" />
                  <button
                    type="button"
                    onClick={fetchData}
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                  >
                    {t("calculate")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    isActiveRoute(item.href)
                      ? "font-semibold bg-beige text-darkest-blue"
                      : " font-semibold text-beige text-opacity-80 hover:bg-darkest-blue hover:text-beige",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={isActiveRoute(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
