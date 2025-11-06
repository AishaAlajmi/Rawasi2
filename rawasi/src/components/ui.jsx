import React from "react";

export function Section({ id, children, className = "" }) {
  return <section id={id} className={`scroll-mt-24 py-12 md:py-20 ${className}`}>{children}</section>;
}

export function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${className}`}>
      {children}
    </span>
  );
}

export function Stat({ label, value, icon: Icon, className = "" }) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${className}`}>
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
