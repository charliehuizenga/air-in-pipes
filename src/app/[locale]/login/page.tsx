"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { createClient } from "@supabase/supabase-js";
import { setUser } from "../redux/auth-slice"; // Redux slice for authentication

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpLogin() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between signup and login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
            emailRedirectTo: "http://localhost:3000/en/projects"
        }
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
      setMessage("Confirmation email sent. Check your inbox!");
    } else {
        router.push(`/${locale}/projects`);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox!");
    }

    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-md py-12">
      <h2 className="text-xl font-semibold text-gray-900">
        {isSignUp ? "Sign Up" : "Login"}
      </h2>

      <div className="mt-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4">
        <input
          type="password"
          placeholder="Password"
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
        className="w-full mt-4 px-4 py-2 bg-sky-500 text-white font-semibold rounded-md shadow-sm hover:bg-sky-600"
      >
        {loading
          ? isSignUp
            ? "Signing Up..."
            : "Logging in..."
          : isSignUp
          ? "Sign Up"
          : "Login"}
      </button>

      {!isSignUp && (
        <button
          onClick={handlePasswordReset}
          disabled={loading || !email}
          className="mt-2 text-sm text-blue-500 underline"
        >
          Forgot Password?
        </button>
      )}

      <p className="mt-4 text-gray-600">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 underline"
        >
          {isSignUp ? "Login here" : "Sign up here"}
        </button>
      </p>
    </main>
  );
}
