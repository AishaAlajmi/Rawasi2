import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Login({ onSubmit, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async () => {
    setErr("");
    setIsLoading(true);

    // Validation
    if (!email || !password) {
      setErr("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErr("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      // 1) Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // 2) Get user profile (optional)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile fetch error:", profileError);
      }

      // 3) Store in localStorage (your existing behavior)
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("profile", JSON.stringify(profile));

      // 4) ALSO log in via App.jsx so role-based routing works
      if (onSubmit) {
        const result = await onSubmit({ email, password });

        if (!result?.ok) {
          setErr(result.error || "Invalid email or password");
          return;
        }
      }

      // Do NOT redirect here; App.jsx already navigates based on role
      // (handleLogin in App.jsx calls navigate("/provider/dashboard") or "/project")
    } catch (error) {
      console.error("Login error:", error);
      setErr(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (userType) => {
    if (userType === "owner") {
      setEmail("owner@demo.app");
      setPassword("owner123");
    } else {
      setEmail("provider@demo.app");
      setPassword("provider123");
    }
    setErr("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleForgotPassword = () => {
    if (onForgot) {
      onForgot();
    } else {
      window.location.href = "/forgot-password";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg"
          >
            <LogIn className="h-8 w-8" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back</h1>
          <p className="mt-2 text-slate-600">Log in to your RAWASI account</p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-orange-200 bg-white shadow-xl"
        >
          <div className="p-8">
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="rawasi@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-11 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-slate-700"
                >
                  Remember me
                </label>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {err && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                    <p className="text-sm text-red-700">{err}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 py-4 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Log in"
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Register Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-slate-600"
        >
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Create one
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}
