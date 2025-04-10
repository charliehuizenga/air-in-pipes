"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { setUser, clearUser } from "../redux/auth-slice";
import { ProjectState } from "../redux/store";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PUBLIC_ROUTES: RegExp[] = [
  /^\/[a-z]{2}(\/)?$/,
  /^\/[a-z]{2}\/about$/,
  /^\/[a-z]{2}\/login$/,
  /^\/[a-z]{2}\/demo$/,
  /^\/[a-z]{2}\/join(\/.*)?$/,
];

const SUPPORTED_LOCALES = ["en", "es", "fr"];

function detectLocale(): string {
  if (typeof navigator === "undefined") return "en"; // fallback for SSR
  const lang = navigator.language?.split("-")[0];
  return SUPPORTED_LOCALES.includes(lang) ? lang : "en";
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((pattern) => pattern.test(pathname));
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: ProjectState) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session?.user) {
        dispatch(
          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
          })
        );
      } else {
        dispatch(clearUser());
      }

      setLoading(false);
    };

    checkUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          dispatch(
            setUser({
              id: session.user.id,
              email: session.user.email,
            })
          );
        } else {
          dispatch(clearUser());
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !user?.id && !isPublicRoute(pathname)) {
      const locale = detectLocale();
      router.replace(`/${locale}`);
    }
  }, [loading]);

  if (loading) return null;

  return <>{children}</>;
}
