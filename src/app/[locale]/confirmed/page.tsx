"use client";

import { useRouter, usePathname } from "next/navigation";

export default function EmailVerified() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1]; // Extract locale from URL

  return (
    <main className="mx-auto max-w-md py-12 text-center">
      <h2 className="text-xl font-semibold text-gray-900">
        🎉 You've successfully verified your email!
      </h2>
      <p className="mt-4 text-gray-700">
        Please log in to use the app 😊
      </p>

      <button
        onClick={() => router.push(`/`)}
        className="mt-6 px-4 py-2 bg-sky-500 text-white font-semibold rounded-md shadow-sm hover:bg-sky-600"
      >
        Go to Login
      </button>
    </main>
  );
}
