// src/components/JoinAsProviderSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JoinAsProviderSection() {
  const navigate = useNavigate();

  const handleJoinProvider = () => {
    // Go to register with provider pre-selected
    navigate("/register?role=provider");
  };

  return (
    <section className="mt-16 rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-slate-50 p-8 shadow-xl">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        {/* Left text */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            For service providers
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Join RAWASI as a{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
              trusted provider
            </span>
          </h2>
          <p className="mt-3 max-w-xl text-sm md:text-base text-slate-600">
            Showcase your modern construction services, receive qualified
            project requests, and collaborate with project owners in Saudi
            Arabia’s next generation of construction.
          </p>

          <div className="mt-6 grid gap-3 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span>Get matched with verified project owners</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-orange-500" />
              <span>Modern construction techniques & innovative solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span>Professional dashboard to manage requests & reporting</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleJoinProvider}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
          >
            Join as Provider
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Right card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl bg-white/80 p-5 shadow-lg ring-1 ring-orange-100 md:max-w-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Provider Portal
              </div>
              <div className="text-xs text-slate-500">
                Dashboard, requests, messages & reports
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
              <p>Manage incoming project requests from owners.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
              <p>Chat with clients, share proposals and updates.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
              <p>Track performance with reports and insights.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
