/** The page for profile-data, where the user can input their own topography data */
"use client";
import React, {useState} from "react";
import { useTranslations } from "next-intl";
import ProfileData from "./profile-data";
import { useDispatch } from 'react-redux';
import {loadExample, Project, setProject} from '../redux/project-slice';

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

  const onFileProcessed = (projectData: Project) => {
    dispatch(setProject(projectData));
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

          <div className="my-4 flex justify-center space-x-2">
            <ProfileData onFileProcessed={onFileProcessed} />
          </div>
          {activeTab === t("topo-data") && (
            <div>
              {/* Your topo-data content here */}
              Topo Data Content
            </div>
        )}
      </div>
  );
}
