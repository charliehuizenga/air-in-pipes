"use client";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProjectState, AppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { uploadFile } from "../redux/project-slice";
import { clearUser } from "../redux/auth-slice"; // ✅ logout action
import { createClient } from "@supabase/supabase-js"; // ✅ supabase
import example0 from "../../../../examples/Example0.json";
import example1 from "../../../../examples/Example1.json";
import example2 from "../../../../examples/Example2.json";
import example3 from "../../../../examples/Example3.json";
import example6 from "../../../../examples/Example6.json";
import example7 from "../../../../examples/Example7.json";

const manualExampleFiles = [
  { name: "Example 0", content: example0 },
  { name: "Example 1", content: example1 },
  { name: "Example 2", content: example2 },
  { name: "Example 3", content: example3 },
  { name: "Example 6", content: example6 },
  { name: "Example 7", content: example7 },
];

function classNames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export interface NavBarProps {
  locale: string;
}

export default function NavBar({ locale }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter(); // ✅ router for logout
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: ProjectState) => state.user);
  const reportData = useSelector((state: ProjectState) => state.report);

  const supabase = createClient(
    // ✅ supabase client
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const isActiveRoute = (href: string) => pathname === href;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations("nav-bar");
  const navigation = [
    { name: t("projects"), href: `/${locale}/projects`, protected: true },
    { name: t("demo"), href: `/${locale}/demo`, protected: false },
    { name: t("about"), href: `/${locale}/about`, protected: false },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      dispatch(uploadFile(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const downloadFile = (
    content: string,
    fileName: string,
    contentType: string
  ) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const promptForFileNameAndDownload = (
    content: string,
    defaultFileName: string,
    contentType: string
  ) => {
    const userFileName = prompt("Enter file name", defaultFileName);
    if (userFileName) {
      downloadFile(content, `${userFileName}.json`, contentType);
    }
  };

  const handleSave = useCallback(() => {
    const jsonStr = JSON.stringify(reportData, null, 2);
    promptForFileNameAndDownload(jsonStr, "project-data.json", "text/json");
  }, [reportData]);

  const handleAuthButtonClick = async () => {
    if (user?.id) {
      const { error } = await supabase.auth.signOut();
      dispatch(clearUser());
      router.push(`/${locale}`);
      return;
    }

    router.push(`/${locale}/login`);
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 font-inter">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
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
                <Link
                  href="/"
                  className="flex flex-shrink-0 font-semibold text-xl tracking-wide text-sky-400 px-1 items-center"
                >
                  <span>Agua Para La Vida</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => {
                    if (!item.protected || user.id) {
                      return (
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
                      );
                    }
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="relative inline-flex items-center gap-x-1.5 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-400"
                >
                  {t("load")}
                </button>

                <button
                  onClick={handleSave}
                  className="relative inline-flex items-center gap-x-1.5 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-400"
                >
                  {t("save")}
                </button>

                {!(pathname.includes("/login") && !user?.id) && (
                  <button
                    onClick={handleAuthButtonClick}
                    className={`relative inline-flex items-center gap-x-1.5 rounded-md ${
                      user?.id
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-sky-600 hover:bg-sky-700"
                    } px-3 py-2 text-sm font-medium text-white shadow-sm`}
                  >
                    {user?.id ? "Logout" : "Login"}
                  </button>
                )}
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
