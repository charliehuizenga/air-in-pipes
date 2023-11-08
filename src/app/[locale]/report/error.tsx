"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const t = useTranslations("report");

  return (
    <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 py-12">
      <h3 className="text-center">{t("error-message")}</h3>
    </div>
  );
}
