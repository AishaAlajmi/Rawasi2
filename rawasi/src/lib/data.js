// src/lib/data.js
import raw from "./ksa_modern_construction_providers.json"; // Vite supports JSON import

const slug = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const PROVIDER_SOURCE = "ksa-json";

export const PROVIDERS = (Array.isArray(raw) ? raw : []).map((r, i) => ({
  id: slug(r.name) || `prov-${i}`,
  name: r.name,
  // your component reads either url or website—give it both
  website: r.website || r.portfolio_link || null,
  url: r.portfolio_link || r.website || null,

  tech: Array.isArray(r.technologies) ? r.technologies : [],
  summary: r.summary || "",
  location: r.location || "KSA",

  // nice-to-have fields your UI already uses
  pastProjects: Array.isArray(r.notable_projects) ? r.notable_projects.length : 0,
  rating: r.rating ?? null,     // keep null unless you later enrich from Maps, etc.
  reviews: r.reviews ?? null,
  photos: r.photos ?? [],
  logo: r.logo ?? null,

  // keep contact + SEO around for detail views / messaging
  contact: r.contact || {},
  seo: r.seo_keywords || [],

  // cost placeholders so estCost renders without NaN
  baseCost: 0,
  costPerSqm: 0,
}));
