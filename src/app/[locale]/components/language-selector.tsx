"use client";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { usePathname } from "next-intl/client";

const classNames = (...classes: (false | null | undefined | string)[]) => {
  return classes.filter(Boolean).join(" ");
};

export default function LanguageSelector() {
  const t = useTranslations("language-selector");

  const router = useRouter();

  interface Language {
    id: string;
    name: string;
  }

  const languages: Language[] = [
    { id: "en", name: t("english") },
    { id: "es", name: t("spanish") },
    { id: "fr", name: t("french") },
  ];

  const pathname = usePathname();

  const handleChange = (language: Language) => {
    // Navigate to the new URL while changing the locale.
    router.replace(pathname, { locale: language.id });
  };

  const [selected, setSelected] = useState<Language>(languages[0]);

  return (
    <Listbox
      value={selected}
      onChange={(newSelected) => {
        setSelected(newSelected);
        handleChange(newSelected);
      }}
    >
      {({ open }) => (
        <>
          <div className="relative mt-2 px-4">
            <Listbox.Button className="relative cursor-default w-40 rounded-md bg-white py-1 pl-2 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <GlobeAltIcon className="h-5 w-5" />
                <span className="ml-3 block truncate">{selected.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-40 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {languages.map((language) => (
                  <Listbox.Option
                    key={language.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-sky-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={language}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {language.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-sky-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
