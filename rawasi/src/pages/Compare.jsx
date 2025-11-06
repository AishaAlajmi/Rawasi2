import React from "react";
import { Section } from "../components/ui.jsx";
import { PROVIDERS } from "../lib/data.js";
import { scoreProvider } from "../lib/recommend.js";
import { currency } from "../lib/utils.js";

export default function Compare({ selectedIds, project, onProceed }) {
  const items = PROVIDERS.filter((p) => selectedIds.includes(p.id)).map((p) => ({
    ...p,
    score: scoreProvider(p, project),
    estCost: p.baseCost + p.costPerSqm * (project?.sizeSqm || 0),
  }));
  if (!items.length) return null;

  return (
    <Section id="compare" className="bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900">Compare providers</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white p-3 text-left text-sm text-slate-600">Attribute</th>
                {items.map((p) => (
                  <th key={p.id} className="p-3 text-left">
                    <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-600">{p.location}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Score", (p) => `${Math.round(p.score * 100)}/100`],
                ["Est. cost", (p) => currency(p.estCost)],
                ["Rating", (p) => `${p.rating} (${p.reviews})`],
                ["Experience", (p) => `${p.pastProjects} projects`],
                ["Tech", (p) => p.tech.join(", ")],
              ].map(([label, fn]) => (
                <tr key={label} className="border-t">
                  <td className="sticky left-0 z-10 bg-white p-3 text-sm text-slate-600">{label}</td>
                  {items.map((p) => (
                    <td key={p.id + label} className="p-3 text-sm">
                      {fn(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={onProceed} className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700">
            Proceed to Messages
          </button>
        </div>
      </div>
    </Section>
  );
}
