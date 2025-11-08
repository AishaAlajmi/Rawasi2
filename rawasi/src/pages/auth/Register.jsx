import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Phone,
  Lock,
  User,
  Briefcase,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Register({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "owner",
  });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const handlePasswordChange = (value) => {
    setForm({ ...form, password: value });
    setPasswordStrength(checkPasswordStrength(value));
  };

  const handleSubmit = async () => {
    setErr("");
    setIsLoading(true);

    // Validation
    if (!form.name || !form.email || !form.password) {
      setIsLoading(false);
      return setErr("Please fill in all required fields");
    }

    if (form.password.length < 6) {
      setIsLoading(false);
      return setErr("Password must be at least 6 characters");
    }

    if (form.password !== form.confirmPassword) {
      setIsLoading(false);
      return setErr("Passwords do not match");
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setIsLoading(false);
      return setErr("Please enter a valid email address");
    }

    try {
      // 1. Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      // 2. Create profile in profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        name: form.name,
        phone: form.phone,
        role: form.role,
        created_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      // Success!
      setSuccess(true);

      // Optional: Auto-login after registration
      setTimeout(() => {
        onSubmit?.({
          ok: true,
          user: authData.user,
          profile: {
            name: form.name,
            phone: form.phone,
            role: form.role,
          },
        });
      }, 2000);
    } catch (error) {
      setErr(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg"
          >
            <UserPlus className="h-8 w-8" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800">
            Create your account
          </h1>
          <p className="mt-2 text-slate-600">
            Join RAWASI to start your construction journey
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-orange-200 bg-white shadow-xl"
        >
          <div className="p-8">
            {success ? (
              // Success State
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-12 text-center"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-slate-800">
                  Account Created!
                </h2>
                <p className="text-slate-600">
                  Welcome to RAWASI. Redirecting to your dashboard...
                </p>
              </motion.div>
            ) : (
              // Form
              <div className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    I am a
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setForm({ ...form, role: "owner" })}
                      className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                        form.role === "owner"
                          ? "border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50/50 shadow-md"
                          : "border-slate-200 bg-white hover:border-orange-300"
                      }`}
                    >
                      <Building2
                        className={`h-8 w-8 ${
                          form.role === "owner"
                            ? "text-orange-600"
                            : "text-slate-400"
                        }`}
                      />
                      <div className="text-center">
                        <div
                          className={`font-semibold ${
                            form.role === "owner"
                              ? "text-orange-700"
                              : "text-slate-700"
                          }`}
                        >
                          Project Owner
                        </div>
                        <div className="text-xs text-slate-500">
                          I need construction services
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setForm({ ...form, role: "provider" })}
                      className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                        form.role === "provider"
                          ? "border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50/50 shadow-md"
                          : "border-slate-200 bg-white hover:border-orange-300"
                      }`}
                    >
                      <Briefcase
                        className={`h-8 w-8 ${
                          form.role === "provider"
                            ? "text-orange-600"
                            : "text-slate-400"
                        }`}
                      />
                      <div className="text-center">
                        <div
                          className={`font-semibold ${
                            form.role === "provider"
                              ? "text-orange-700"
                              : "text-slate-700"
                          }`}
                        >
                          Service Provider
                        </div>
                        <div className="text-xs text-slate-500">
                          I offer construction services
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="Ali Ahmed"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="ali.ahmed@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="+966 50 123 4567"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  {form.password && (
                    <div className="mt-2">
                      <div className="mb-1 flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              i < passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600">
                        Password strength:{" "}
                        <span className="font-medium">
                          {strengthLabels[passwordStrength - 1] || "Too weak"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Error Message */}
                {err && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                    <p className="text-sm text-red-700">{err}</p>
                  </motion.div>
                )}

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
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-slate-600"
        >
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Log in
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}
