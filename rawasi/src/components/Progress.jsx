// src/components/Progress.jsx
import React from "react";
import { useLocation } from "react-router-dom";

/**
 * Flow progress chips
 * Steps:
 * 1) Add Project
 * 2) Recommendations (covers /recs and /compare; comparing is optional)
 * 3) Messages
 *
 * Shown only on flow routes (App controls visibility).
 */
export default function FlowProgress() {
  const { pathname } = useLocation();

  const steps = [
    { id: "project", label: "Add Project", routes: ["/project"] },
    { id: "picks", label: "Recommendations", routes: ["/recs", "/compare"] }, // compare optional
    { id: "messages", label: "Messages", routes: ["/messages"] },
  ];

  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.routes.some((r) => pathname.startsWith(r)))
  );

  return (
    <div className="mb-2">
      <div className="grid grid-cols-3 gap-3">
        {steps.map((s, i) => {
          const active = i === activeIndex;
          const done = i < activeIndex;
          const cls = active
  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
  : done
  ? "bg-gradient-to-r from-blue-100 to-amber-100 text-blue-700 border border-blue-200"
  : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-400 border border-slate-200";

          return (
            <div
              key={s.id}
              className={`rounded-full px-5 py-2 text-center text-sm font-medium transition-all duration-300 ${cls}`}
              title={s.id === "picks" ? "Compare is optional" : undefined}
            >
              {s.label}
              {s.id === "picks" && (
                <span className="hidden sm:inline"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}