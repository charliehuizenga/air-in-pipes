"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations("auth");
  const router = useRouter();
  const locale = usePathname().split("/")[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {t("title")}
        </h1>

        {sent ? (
          <p className="text-green-600 text-center">{t("sent")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {t("email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
              placeholder={t("placeholder")}
            />

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-sky-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-sky-600 transition"
            >
              {t("send")}
            </button>
          </form>
        )}

        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-gray-600 hover:underline w-full text-center"
        >
          {t("back")}
        </button>
      </div>
    </div>
  );
}
