import React from "react";
import { Link } from "react-router-dom";

export default function Footer({ logoUrl }) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 md:flex-row">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Rawasi" className="h-8 w-8 rounded" />
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Rawasi. All rights reserved.
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <Link to="/project" className="hover:text-indigo-600">Start</Link>
          <Link to="/recs" className="hover:text-indigo-600">Recommendations</Link>
          <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}
