// src/pages/Project.jsx - COMPLETE VERSION WITH COST & TIMELINE ML MODEL INTEGRATION
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Calculator,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Timer,
  Layers,
  Image as ImageIcon,
  Upload,
  Loader2,
  Sparkles,
  CheckCircle2,
  Brain,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { Section } from "../components/ui.jsx";
import { estimateCostAndTime } from "../lib/recommend.js";
import { predictProjectCost } from "../lib/aiModelService.js";
import { predictTimeline } from "../lib/timelineService.js";
import { clamp, currency } from "../lib/utils.js";

/* ------------------------------- HELPER COMPONENTS ------------------------------- */

function ProjectDetailItem({ label, value }) {
  return (
    <div className="grid grid-cols-[100px_1fr] border-b border-slate-100 py-1.5">
      <strong className="text-slate-800 pr-2">{label}:</strong>
      <span className="text-slate-600 truncate">{value}</span>
    </div>
  );
}

function CheckboxRow({ label, checked, onChange, hint }) {
  return (
    <motion.label
      whileHover={{ scale: 1.01, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}
      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-150 ${
        checked
          ? "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50/30"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <div className="text-sm font-medium text-slate-800">{label}</div>
        {hint && <div className="text-xs text-slate-600">{hint}</div>}
      </div>
    </motion.label>
  );
}

function QuickPreferencesSidebar({ answers, setAnswers }) {
  return (
    <motion.div
      key="prefs"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="sticky top-6 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/30 p-6 shadow-xl"
    >
      <div className="flex items-center gap-2 text-orange-800 text-lg font-semibold mb-4">
        <ClipboardList className="h-5 w-5" /> Project Priorities
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <CheckboxRow
            label="Need fast construction"
            checked={answers.wantSpeed === "Yes"}
            onChange={(c) =>
              setAnswers((a) => ({
                ...a,
                wantSpeed: c ? "Yes" : "No",
              }))
            }
            hint="For time-sensitive deadlines."
          />

          <CheckboxRow
            label="Strong thermal insulation"
            checked={answers.needInsulation === "Yes"}
            onChange={(c) =>
              setAnswers((a) => ({
                ...a,
                needInsulation: c ? "Yes" : "No",
              }))
            }
            hint="For energy savings and stable indoor temperature."
          />

          <CheckboxRow
            label="Strong sound insulation"
            checked={answers.needQuiet === "Yes"}
            onChange={(c) =>
              setAnswers((a) => ({
                ...a,
                needQuiet: c ? "Yes" : "No",
              }))
            }
            hint="Ideal for residential projects near busy areas."
          />

          <CheckboxRow
            label="High fire resistance"
            checked={answers.needFire === "Yes"}
            onChange={(c) =>
              setAnswers((a) => ({
                ...a,
                needFire: c ? "Yes" : "No",
              }))
            }
            hint="Safety requirement for certain building types."
          />

          <CheckboxRow
            label="Might change layout later"
            checked={answers.planChanges === "Yes"}
            onChange={(c) =>
              setAnswers((a) => ({
                ...a,
                planChanges: c ? "Yes" : "No",
              }))
            }
            hint="Indicates a preference for flexible wall systems."
          />
          <CheckboxRow
            label="Water protection"
            checked={answers.needWater === "Yes"}
            onChange={(c) =>
              setAnswers((a) => ({
                ...a,
                needWater: c ? "Yes" : "No",
              }))
            }
            hint="Protection against potential leakage and moisture."
          />
        </div>
      </div>
    </motion.div>
  );
}

function LiveEstimator({
  est,
  aiPrediction,
  timelinePrediction,
  isLoadingAI,
  isLoadingTimeline,
}) {
  const { estCost, estTimeMonths } = est;

  return (
    <motion.div
      key="estimator"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-6 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/30 p-6 shadow-xl"
    >
      <div className="flex items-center gap-2 text-orange-800 text-lg font-semibold mb-4">
        <Calculator className="h-5 w-5" /> Live Project Estimate
      </div>

      {/* AI Predictions Grid */}
      <div className="space-y-4">
        {/* Cost Prediction Card */}
        {isLoadingAI ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-white p-4 shadow-md border border-orange-100"
          >
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Analyzing cost...</span>
            </div>
          </motion.div>
        ) : aiPrediction?.success ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 p-5 border-2 border-amber-200/60 shadow-lg overflow-hidden"
          >
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-xl"></div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  AI Cost Prediction
                </span>
              </div>

              <div className="text-3xl font-extrabold text-amber-600 mb-2">
                {currency(aiPrediction.predicted_cost)}
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-amber-700/80">
                  <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                  <span>
                    Range: {currency(aiPrediction.confidence_interval.lower)} -{" "}
                    {currency(aiPrediction.confidence_interval.upper)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-amber-700/80">
                  <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                  <span>
                    Cost per sqm: {currency(aiPrediction.cost_per_sqm)}/m²
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="rounded-xl bg-white p-4 text-center shadow-md border border-orange-200"
          >
            <div className="text-sm text-slate-600 font-medium mb-1">
              Estimated Cost
            </div>
            <div className="text-2xl font-extrabold text-orange-600">
              {currency(estCost)}
            </div>
          </motion.div>
        )}

        {/* Timeline Prediction Card */}
        {isLoadingAI ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-white p-4 shadow-md border border-orange-100"
          >
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Analyzing cost...</span>
            </div>
          </motion.div>
        ) : timelinePrediction?.success ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 p-5 border-2 border-amber-200/60 shadow-lg overflow-hidden"
          >
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-xl"></div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <Brain className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">
                  AI Timeline Prediction
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-3xl font-extrabold text-amber-600 mb-2">
                  {timelinePrediction.predicted_months}
                </div>
                <div className="text-3xl font-extrabold text-amber-600 mb-2">
                  months
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-orange-700/80">
                  <div className="w-1 h-1 rounded-full bg-orange-500"></div>
                  <span>
                    Based on {timelinePrediction.techniques_used?.length || 0}{" "}
                    construction techniques
                  </span>
                </div>
                <div className="flex items-center gap-2 text-orange-700/80">
                  <div className="w-1 h-1 rounded-full bg-orange-500"></div>
                  <span>
                    Method:{" "}
                    {timelinePrediction.method === "ai"
                      ? "🤖 AI-Powered"
                      : "📊 Rule-Based"}
                  </span>
                </div>
                {timelinePrediction.area_sqm && (
                  <div className="flex items-center gap-2 text-orange-700/80">
                    <div className="w-1 h-1 rounded-full bg-orange-500"></div>
                    <span>
                      For {timelinePrediction.area_sqm.toLocaleString()} sqm
                      project
                    </span>
                  </div>
                )}
              </div>

              {/* Speed indicator badge */}
              {timelinePrediction.predicted_months < 10 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 border border-green-200 rounded-full"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-700">
                    Fast Construction
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
            className="rounded-xl bg-white p-4 text-center shadow-md border border-orange-200"
          >
            <div className="text-sm text-slate-600 font-medium mb-1">
              Estimated Time
            </div>
            <div className="text-2xl font-extrabold text-orange-600">
              {estTimeMonths} mo
            </div>
          </motion.div>
        )}
      </div>

      {/* Promise Section */}
      <div className="mt-6 border-t pt-5 border-orange-100">
        <div className="text-sm font-semibold text-slate-700 mb-3">
          Our Promise
        </div>
        <ul className="space-y-3 text-sm text-slate-700">
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="p-1 bg-green-100 rounded-lg">
              <ShieldCheck className="h-4 w-4 text-green-600" />
            </div>
            <span>Private & secure data handling</span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="p-1 bg-orange-100 rounded-lg">
              <Timer className="h-4 w-4 text-orange-600" />
            </div>
            <span>Fast provider responses through AI matching</span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="p-1 bg-amber-100 rounded-lg">
              <Layers className="h-4 w-4 text-amber-600" />
            </div>
            <span>Access to modern construction tech</span>
          </motion.li>
        </ul>
      </div>
    </motion.div>
  );
}

/* ---------------------------------- MAIN COMPONENT ---------------------------------- */

export default function Project({ onComplete }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <ProjectWizard onComplete={onComplete} />
    </motion.main>
  );
}

function ProjectWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [timelinePrediction, setTimelinePrediction] = useState(null);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

  const [project, setProject] = useState({
    name: "",
    type: "Residential",
    sizeSqm: 1500,
    location: "Riyadh",
    budget: 2000000,
    timelineMonths: 12,
    Nfloors: 2,
    techNeeds: [],
    planImageFile: { name: "" },
    planImagePreview: "",
  });

  const [answers, setAnswers] = useState({
    wantSpeed: "No",
    needInsulation: "No",
    needQuiet: "No",
    needFire: "No",
    needWater: "No",
    planChanges: "No",
    tightSite: "No",
    preferOffsite: "Flexible",
    floors: "1–3",
  });

  const [error, setError] = useState("");

  const { estCost, estTimeMonths, risk } = useMemo(
    () => estimateCostAndTime(project),
    [project]
  );

  // Fetch AI cost prediction when project changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (project.name && project.sizeSqm > 0 && project.timelineMonths > 0) {
        fetchAIPrediction();
        fetchTimelinePrediction();
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [
    project.type,
    project.sizeSqm,
    project.location,
    project.timelineMonths,
    project.techNeeds,
    project.Nfloors,
  ]);

  const fetchAIPrediction = async () => {
    setIsLoadingAI(true);
    try {
      const prediction = await predictProjectCost(project);
      setAiPrediction(prediction);
    } catch (error) {
      console.error("Failed to get AI prediction:", error);
      setAiPrediction({ success: false, error: error.message });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const fetchTimelinePrediction = async () => {
    setIsLoadingTimeline(true);
    try {
      const prediction = await predictTimeline(project);
      setTimelinePrediction(prediction);
      console.log("✅ Timeline prediction:", prediction);
    } catch (error) {
      console.error("Failed to get timeline prediction:", error);
      setTimelinePrediction({ success: false, error: error.message });
    } finally {
      setIsLoadingTimeline(false);
    }
  };

  useEffect(() => {
    return () => {
      if (project.planImagePreview) {
        URL.revokeObjectURL(project.planImagePreview);
      }
    };
  }, [project.planImagePreview]);

  const next = () => {
    if (step === 0 && !project.name) {
      return setError("Please name your project.");
    }
    setError("");
    setTimeout(() => setStep((s) => clamp(s + 1, 0, 1)), 50);
  };

  const prev = () => {
    setError("");
    setTimeout(() => setStep((s) => clamp(s - 1, 0, 1)), 50);
  };

  const submit = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      onComplete?.({
        ...project,
        answers,
        aiPrediction: aiPrediction?.success
          ? aiPrediction.predicted_cost
          : null,
        timelinePrediction: timelinePrediction?.success
          ? timelinePrediction.predicted_months
          : null,
      });
    } catch (err) {
      console.error("Submission failed:", err);
      setError("Could not continue. Please review your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const TechChip = ({ value }) => {
    const active = project.techNeeds.includes(value);
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          setProject((p) => ({
            ...p,
            techNeeds: active
              ? p.techNeeds.filter((t) => t !== value)
              : [...p.techNeeds, value],
          }))
        }
        className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
          active
            ? "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50/30 text-orange-700"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        {value}
      </motion.button>
    );
  };

  const handlePlanUpload = (file) => {
    if (!file) {
      setProject((p) => ({ ...p, planImageFile: null, planImagePreview: "" }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image (PNG / JPG / JPEG).");
      return;
    }

    const preview = URL.createObjectURL(file);
    setProject((p) => ({
      ...p,
      planImageFile: file,
      planImagePreview: preview,
    }));
  };

  return (
    <Section
      id="project"
      className="bg-gradient-to-br from-slate-50 to-orange-50/30"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-slate-800">
                  Project details
                </div>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: step === 0 ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-orange-600 font-semibold"
                >
                  Step {step + 1} / 2
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-6"
                  >
                    {/* Basic inputs */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm text-slate-600">
                          Project name
                        </label>
                        <input
                          value={project.name}
                          onChange={(e) =>
                            setProject({ ...project, name: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., Al Rawasi Villas"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-slate-600">Type</label>
                        <select
                          value={project.type}
                          onChange={(e) =>
                            setProject({ ...project, type: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          {[
                            "Residential",
                            "Commercial",
                            "Industrial",
                            "Mixed-Use",
                          ].map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm text-slate-600">
                          Size (sqm)
                        </label>
                        <input
                          type="number"
                          value={project.sizeSqm}
                          onChange={(e) =>
                            setProject({
                              ...project,
                              sizeSqm: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-slate-600">
                          Location
                        </label>
                        <select
                          value={project.location}
                          onChange={(e) =>
                            setProject({ ...project, location: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          {[
                            "Riyadh",
                            "Jeddah",
                            "Dammam",
                            "Mecca",
                            "Medina",
                          ].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <label className="text-sm text-slate-600">
                          Budget (SAR)
                        </label>
                        <input
                          type="number"
                          value={project.budget}
                          onChange={(e) =>
                            setProject({
                              ...project,
                              budget: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-slate-600">
                          Timeline (months)
                        </label>
                        <input
                          type="number"
                          value={project.timelineMonths}
                          onChange={(e) =>
                            setProject({
                              ...project,
                              timelineMonths: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-600">
                          Number of floors
                        </label>
                        <input
                          type="number"
                          value={project.Nfloors}
                          onChange={(e) =>
                            setProject({
                              ...project,
                              Nfloors: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-slate-600">
                          Preferred technologies
                        </label>
                        <span className="text-[11px] text-slate-400">
                          Optional – you can pick multiple
                        </span>
                      </div>

                      <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500"></span>
                          <span className="text-xs font-medium text-orange-600">
                            {project.techNeeds.length
                              ? `${project.techNeeds.length} selected`
                              : "No technology selected"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            "Autoclaved Aerated Concrete",
                            "A L C PANEL",
                            "EPS WALL PANEL",
                            "Form Work (Light Weight Foam Concrete)",
                            "Tunnel Form",
                            "Tunnel Formwork",
                            "Precast system",
                            "Precast",
                            "Precast Concrete",
                            "Insulated Concrete Form (ICF)",
                            "3D Concrete panels",
                            "Lightweight Aerated Concrete",
                            "Lightweight Concrete Panels",
                            "Modular Building System",
                            "Permanent Formwork",
                            "Rammed Earth",
                            "Sandwich panels",
                            "Sismo",
                            "Steel Frame",
                            "Post-Tensioning",
                            "Waffle‐Crete building system (precast concrete panels for wall & slab)",
                          ].map((t) => (
                            <TechChip key={t} value={t} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Structural plan upload */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-slate-800">
                        <ImageIcon className="h-4 w-4 text-orange-600" /> Upload
                        a structural plan image
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm hover:bg-orange-50 transition-colors">
                          <Upload className="h-4 w-4" />
                          <span>Select image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handlePlanUpload(e.target.files?.[0] || null)
                            }
                          />
                        </label>

                        {project.planImageFile && (
                          <span className="text-xs text-slate-600 truncate">
                            Selected:{" "}
                            <strong>{project.planImageFile.name}</strong>
                          </span>
                        )}
                      </div>

                      {project.planImagePreview && (
                        <div className="mt-3">
                          <img
                            src={project.planImagePreview}
                            alt="Plan preview"
                            className="h-40 w-auto rounded-xl border border-orange-200 object-contain bg-white"
                          />
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-6"
                  >
                    {/* Project Summary Card */}
                    <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-lg">
                      <div className="text-xl font-bold text-slate-800 mb-4 border-b pb-2 border-orange-100">
                        Project Summary
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <ProjectDetailItem
                          label="Name"
                          value={project.name || "—"}
                        />
                        <ProjectDetailItem label="Type" value={project.type} />
                        <ProjectDetailItem
                          label="Size"
                          value={`${project.sizeSqm} sqm`}
                        />
                        <ProjectDetailItem
                          label="Location"
                          value={project.location}
                        />
                        <ProjectDetailItem
                          label="Budget"
                          value={currency(project.budget)}
                        />
                        <ProjectDetailItem
                          label="Timeline"
                          value={`${project.timelineMonths} months`}
                        />
                        <ProjectDetailItem
                          label="Floors"
                          value={`${project.Nfloors}`}
                        />
                        <div className="col-span-2">
                          <ProjectDetailItem
                            label="Tech Stack"
                            value={project.techNeeds.join(", ") || "Flexible"}
                          />
                        </div>
                        <div className="col-span-2">
                          <ProjectDetailItem
                            label="Structural Plan"
                            value={
                              project.planImageFile
                                ? project.planImageFile.name
                                : "None uploaded"
                            }
                          />
                        </div>

                        {/* AI Predictions Summary */}
                        {(aiPrediction?.success ||
                          timelinePrediction?.success) && (
                          <div className="col-span-2 mt-4 pt-4 border-t border-orange-100 space-y-3">
                            {aiPrediction?.success && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Sparkles className="h-4 w-4 text-amber-600" />
                                  <span className="text-sm font-semibold text-amber-700">
                                    AI-Predicted Cost
                                  </span>
                                </div>
                                <div className="text-2xl font-extrabold text-amber-600">
                                  {currency(aiPrediction.predicted_cost)}
                                </div>
                              </div>
                            )}

                            {timelinePrediction?.success && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Brain className="h-4 w-4 text-amber-600" />
                                  <span className="text-sm font-semibold text-amber-700">
                                    AI-Predicted Timeline
                                  </span>
                                </div>
                                <div className="text-2xl font-extrabold text-amber-600">
                                  {timelinePrediction.predicted_months} months
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-6 flex items-center justify-between">
                <motion.button
                  onClick={prev}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 transition-all duration-150"
                  disabled={step === 0 || isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </motion.button>

                {step < 1 ? (
                  <motion.button
                    onClick={next}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 font-medium text-white hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25 transition-all duration-150"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={submit}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 6px 15px rgba(234, 88, 12, 0.7)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-lg font-semibold text-white hover:from-amber-600 hover:to-amber-700 shadow-xl shadow-amber-500/25 transition-all duration-150 flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Get Recommendations"
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          <aside className="md:col-span-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <QuickPreferencesSidebar
                  answers={answers}
                  setAnswers={setAnswers}
                />
              )}
              {step === 1 && (
                <LiveEstimator
                  est={{ estCost, estTimeMonths }}
                  aiPrediction={aiPrediction}
                  timelinePrediction={timelinePrediction}
                  isLoadingAI={isLoadingAI}
                  isLoadingTimeline={isLoadingTimeline}
                />
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </Section>
  );
}
