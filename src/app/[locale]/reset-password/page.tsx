"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const t = useTranslations("auth");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(t("password-mismatch"));
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/projects`);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {t("reset-password-title")}
        </h1>

        {success ? (
          <p className="text-green-600 text-center">{t("reset-password-success")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("new-password")}
              </label>
              <input
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("confirm-password")}
              </label>
              <input
                type="password"
                value={confirm}
                required
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-sky-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-sky-600 transition"
            >
              {t("reset-password-submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
