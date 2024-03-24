/** The page for profile-data, where the user can input their own topography data */
"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
//import { NavBarProps } from "../components/navbar";
import ProfileData from "./profile-data";
import { useDispatch } from 'react-redux';
import { loadExample } from '../redux/project-slice';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from "@heroicons/react/24/solid";

// ----- Types ----- //

type HandleLoadExample = (index: number) => void;
type HandleFileUpload = (file: File) => void;

interface MyDropdownProps {
  handleLoadExample: HandleLoadExample;
  handleFileUpload: HandleFileUpload;
}

// Dropdown component
function MyDropdown({ handleLoadExample, handleFileUpload }: MyDropdownProps) {
  // Function to handle file selection
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileUpload(event.target.files[0]);
    }
  };

  return (
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded inline-flex w-full justify-center">
            Examples
            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {[0, 1, 2, 3, 6, 7].map((exampleIndex) => (
                  <Menu.Item key={exampleIndex}>
                    {({ active }) => (
                        <a
                            className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex items-center px-4 py-2 text-sm`}
                            onClick={() => handleLoadExample(exampleIndex)}
                        >
                          Example {exampleIndex}
                        </a>
                    )}
                  </Menu.Item>
              ))}
              <Menu.Item>
                {({ active }) => (
                    <label
                        htmlFor="file-upload"
                        className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } group flex items-center px-4 py-2 text-sm cursor-pointer`}
                    >
                      Upload your own
                      <input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={onFileChange}
                      />
                    </label>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
  );
}

// ----- Types ----- //
export interface Tab {
  name: string;
  current: boolean;
}

export default function InputData() {
  const t = useTranslations("input-data");

  const dispatch = useDispatch();

  // Function that loads example json projects
  const handleLoadExample = (index: number) => {
    dispatch(loadExample(index));
  }

  // Function to handle the file upload
  const handleFileUpload: HandleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
      const fileContent = loadEvent.target?.result;
      console.log(fileContent);
    };

    reader.onerror = (errorEvent) => {
      console.error("Error reading file:", errorEvent.target?.error);
    };

    // Read the file as text
    reader.readAsText(file);
  };

  const inputTabs: Tab[] = [
    {
      name: t("profile-data"),
      current: true,
    },
    {
      name: t("topo-data"),
      current: false,
    },
  ];

  const [activeTab, setActiveTab] = useState(
    inputTabs.find((tab) => tab.current)?.name
  );

  function handleTabClick(tabName: string) {
    setActiveTab(tabName);
  }

  function classNames(...classes: any[]): string {
    return classes.filter(Boolean).join(" ");
  }
  return (
      <div>
        <div className="hidden sm:block mx-auto max-w-5xl py-12 sm:px-6 lg:px-8">
          <nav className="flex space-x-4" aria-label="Tabs">
            {inputTabs.map((tab) => (
                <button
                    key={tab.name}
                    onClick={() => handleTabClick(tab.name)}
                    className={classNames(
                        tab.name === activeTab
                            ? "bg-sky-100 text-sky-700"
                            : "text-gray-500 hover:text-gray-700",
                        "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                    aria-current={tab.name === activeTab ? "page" : undefined}
                >
                  {tab.name}
                </button>
            ))}
          </nav>
        </div>

        {/* Example load buttons */}
        <div className="my-4 flex justify-center space-x-2">
          <MyDropdown handleLoadExample={handleLoadExample} handleFileUpload={handleFileUpload}/>
        </div>

        {activeTab === t("profile-data") && <ProfileData></ProfileData>}

        {activeTab === t("topo-data") && (
            <div>
              {/* Your topo-data content here */}
              Topo Data Content
            </div>
        )}
      </div>
  );
}
