
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LangContext = createContext(null);

export function LangProvider({ initial = "en", children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || initial);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}