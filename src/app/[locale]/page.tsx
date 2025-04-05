"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { ProjectState } from "./redux/store";

export default function HomePage() {
  const user = useSelector((state: ProjectState) => state.user);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-sky-600 mb-4">
        Welcome to Agua Para La Vida&apos;s Air in Pipes Tool!
      </h1>
      <p className="text-lg text-gray-700 max-w-xl mb-8">
        Design, manage, and collaborate on gravity flow water systems.
      </p>

      {user?.id ? (
        <Link
          href={`/${locale}/projects`}
          className="px-6 py-3 bg-sky-600 text-white rounded-md text-lg shadow hover:bg-sky-700"
        >
          Go to Projects
        </Link>
      ) : (
        <Link
          href={`/${locale}/login`}
          className="px-6 py-3 bg-sky-600 text-white rounded-md text-lg shadow hover:bg-sky-700"
        >
          Log In
        </Link>
      )}
    </main>
  );
}
