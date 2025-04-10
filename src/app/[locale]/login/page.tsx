"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { createClient } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { setUser } from "../redux/auth-slice";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpLogin() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const locale = pathname.split("/")[1];
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const t = useTranslations("auth");

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    let data, error;
    if (isSignUp) {
      ({ data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/projects`,
        },
      }));
    } else {
      ({ data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }));
    }

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      dispatch(setUser({ email: data.user.email, id: data.user.id }));
    }

    setLoading(false);

    if (isSignUp) {
      setMessage(t("confirmation-sent"));
    } else {
      router.push(redirectTo ?? `/${locale}/projects`);
    }
  };

  return (
    <main className="mx-auto max-w-md py-12 px-4">
      <h2 className="text-xl font-semibold text-gray-900">
        {isSignUp ? t("sign-up") : t("login")}
      </h2>

      <div className="mt-4">
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4">
        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {message && <p className="text-green-500 mt-2">{message}</p>}

      <button
        onClick={handleAuth}
        disabled={loading}
        className={`w-full mt-4 px-4 py-2 ${
          isSignUp ? "bg-sky-500 hover:bg-sky-600" : "bg-blue-500 hover:bg-blue-600"
        } text-white font-semibold rounded-md shadow-sm`}
      >
        {loading
          ? isSignUp
            ? t("signing-up")
            : t("logging-in")
          : isSignUp
          ? t("sign-up")
          : t("login")}
      </button>

      {!isSignUp && (
        <p className="mt-2 text-sm text-blue-500 underline">
          <Link href={`/${locale}/forgot-password`}>
            {t("forgot-password")}
          </Link>
        </p>
      )}

      <p className="mt-4 text-gray-600">
        {isSignUp ? t("already-have-account") : t("no-account")}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 underline"
        >
          {isSignUp ? t("login-here") : t("sign-up-here")}
        </button>
      </p>
    </main>
  );
}
