export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const currency = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "SAR", maximumFractionDigits: 0 }).format(n || 0);
export const pct = (n) => `${Math.round((n || 0) * 100)}%`;

export const uid = () => Math.random().toString(36).slice(2, 10);
export const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
export const loadLS = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
