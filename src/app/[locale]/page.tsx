"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { ProjectState } from "./redux/store";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const user = useSelector((state: ProjectState) => state.user);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const t = useTranslations("welcome");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-sky-600 mb-4">
        {t("welcome-message")}
      </h1>
      <p className="text-lg text-gray-700 max-w-xl mb-6">
        {t("welcome-message2")}
      </p>

      {user?.id ? (
        <Link
          href={`/${locale}/projects`}
          className="px-6 py-3 bg-sky-600 text-white rounded-md text-lg shadow hover:bg-sky-700"
        >
          {t("projects")}
        </Link>
      ) : (
        <div className="flex gap-4 justify-center">
          <Link
            href={`/${locale}/login`}
            className="px-6 py-3 bg-green-600 text-white rounded-md text-lg shadow hover:bg-green-700"
          >
              {t("login")}
          </Link>
          <Link
            href={`/${locale}/demo`}
            className="px-6 py-3 bg-sky-600 text-white rounded-md text-lg shadow hover:bg-sky-700"
          >
              {t("demo")}
          </Link>
        </div>
      )}
      <Image
        src="/aplv_home.png"
        alt="APLVC home illustration"
        width={1000}
        height={600}
        className="mb-8 rounded-lg w-full max-w-4xl h-auto"
      />
    </main>
  );
}
