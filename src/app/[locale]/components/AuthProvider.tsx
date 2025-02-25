"use client"

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/auth-slice"; // Import Redux actions

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        dispatch(setUser({id: data.session.user.id, email: data.session.user.email}));
        console.log(data.session.user.id, data.session.user.email)
      }
    };
    checkUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser({id: session.user.id, email: session.user.email}));
      } else {
        dispatch(clearUser());
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}
