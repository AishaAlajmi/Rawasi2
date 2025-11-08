// src/pages/Recommendations.jsx - UPDATED TO USE LLM BACKEND
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Search,
  X,
  Award,
  Loader2,
  Filter,
  ChevronDown,
  Sparkles,
  Users,
  CheckCircle,
  Send,
  MessageCircle,
  TrendingUp,
  Brain,
} from "lucide-react";
import { Section } from "../components/ui.jsx";
import { currency } from "../lib/utils.js";
import { useNavigate } from "react-router-dom";

export default function Recommendations({
  project,
  onCompareToggle,
  selectedCompare,
  onProceed,
}) {
  const navigate = useNavigate();

  const t = {
    title: "AI Recommendations",
    subtitle: "LLM-powered matches based on your project requirements",
    loading: "Analyzing your project with AI and finding the best providers...",
    loadingLLM: "Our AI is analyzing your project requirements...",
    topPicks: "Top Picks",
    allProviders: "All Providers",
    search: "Search providers...",
    all: "All Technologies",
    estCost: "Est. cost",
    score: "Match Score",
    experience: "Experience",
    compare: "Compare",
    aiReason: "Why recommended",
    request: "Send request",
    message: "Message",
    sending: "Sending...",
    sent: "Sent",
    filters: "Filters",
    showing: "Showing",
    of: "of",
    providers: "providers",
    complexity: "Project Complexity",
  };

  const [recommendations, setRecommendations] = useState([]);
  const [llmInsights, setLlmInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [techFilter, setTechFilter] = useState(t.all);
  const [requestingId, setRequestingId] = useState(null);
  const [requested, setRequested] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [projectComplexity, setProjectComplexity] = useState(null);

  // Load recommendations from project.recommendations or fetch from API
  useEffect(() => {
    const loadRecommendations = async () => {
      if (!project) return;

      setIsLoading(true);
      setError(null);

      try {
        // Check if recommendations are already in project object
        if (
          project.recommendations?.success &&
          project.recommendations?.suppliers
        ) {
          console.log("✅ Using existing recommendations from project");
          const recs = project.recommendations;

          // Transform suppliers to match our format
          const transformedSuppliers = recs.suppliers.map(
            (supplier, index) => ({
              id: `llm_${index}`,
              name: supplier.name,
              locationEn: supplier.region,
              technologies: Array.isArray(supplier.technology)
                ? supplier.technology
                : [supplier.technology],
              rating: supplier.rating,
              matchScore: supplier.match_score,
              matchReasons: supplier.match_reasons || [],
              contact: supplier.contact,
              email: supplier.email,
              phone: supplier.phone,
              aiReason:
                supplier.match_reasons?.join(". ") ||
                "Matches your project requirements",
              baseCost: 100000,
              costPerSqm: 4000,
              matched_technology: supplier.matched_technology,
              finalScore: supplier.match_score / 100, // Normalize to 0-1
            })
          );

          setRecommendations(transformedSuppliers);
          setLlmInsights(recs.ai_insights);
          setProjectComplexity(recs.project_complexity);
          setIsLoading(false);
          return;
        }

        // If no recommendations in project, fetch from API
        console.log("🔍 Fetching recommendations from API...");
        const API_URL =
          import.meta.env.VITE_RECOMMENDATION_API_URL ||
          "http://localhost:5000/api";

        const recommendationData = {
          name: project.name,
          type: project.type,
          location: project.location,
          sizeSqm: project.sizeSqm || project.size_sqm,
          budget: project.budget,
          timelineMonths: project.timelineMonths || project.timeline_months,
          Nfloors: project.Nfloors || project.n_floors,
          techNeeds: project.techNeeds || project.tech_needs || [],
        };

        const response = await fetch(`${API_URL}/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recommendationData),
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "No recommendations found");
        }

        console.log("✅ Recommendations received from API:", data);

        // Transform API response
        const transformedSuppliers = data.suppliers.map((supplier, index) => ({
          id: `llm_${index}`,
          name: supplier.name,
          locationEn: supplier.region,
          technologies: Array.isArray(supplier.technology)
            ? supplier.technology
            : [supplier.technology],
          rating: supplier.rating,
          matchScore: supplier.match_score,
          matchReasons: supplier.match_reasons || [],
          contact: supplier.contact,
          email: supplier.email,
          phone: supplier.phone,
          aiReason:
            supplier.match_reasons?.join(". ") ||
            "Matches your project requirements",
          baseCost: 100000,
          costPerSqm: 4000,
          matched_technology: supplier.matched_technology,
          finalScore: supplier.match_score / 100,
        }));

        setRecommendations(transformedSuppliers);
        setLlmInsights(data.ai_insights);
        setProjectComplexity(data.project_complexity);
      } catch (err) {
        console.error("❌ Error loading recommendations:", err);
        setError(err.message);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [project]);

  // Tech filter options
  const techOptions = useMemo(() => {
    const set = new Set([t.all]);
    recommendations.forEach((p) =>
      p.technologies?.forEach((tech) => set.add(tech))
    );
    return Array.from(set);
  }, [recommendations, t.all]);

  // Filtered providers
  const filteredProviders = useMemo(() => {
    return recommendations.filter((p) => {
      const techOk =
        techFilter === t.all || p.technologies?.includes(techFilter);
      const nameOk = String(p.name).toLowerCase().includes(query.toLowerCase());
      return techOk && nameOk;
    });
  }, [recommendations, query, techFilter, t.all]);

  const topPicks = recommendations.slice(0, 3);

  // Request handler
  const handleRequest = async (provider) => {
    setRequestingId(provider.id);
    await new Promise((r) => setTimeout(r, 1500));
    setRequested((prev) => new Set([...prev, provider.id]));
    setRequestingId(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <Section className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-amber-500/20 rounded-full blur-xl"></div>
              <Brain className="h-16 w-16 text-blue-700 relative z-10 animate-pulse" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-slate-800 mb-4 text-center"
            >
              {t.loadingLLM}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-center max-w-md"
            >
              Using advanced AI to match you with the perfect providers for your
              project...
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "250px" }}
              transition={{ delay: 0.5, duration: 2 }}
              className="mt-8 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 rounded-full"
            ></motion.div>
          </div>
        </div>
      </Section>
    );
  }

  // Error state
  if (error) {
    return (
      <Section className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <X className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">
              Unable to Load Recommendations
            </h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </Section>
    );
  }

  // No results
  if (recommendations.length === 0) {
    return (
      <Section className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center"
          >
            <Search className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-amber-900 mb-2">
              No Matching Providers Found
            </h2>
            <p className="text-amber-700 mb-6">
              We couldn't find providers matching your specific requirements.
              Try adjusting your project criteria.
            </p>
            <button
              onClick={() => navigate("/project")}
              className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
            >
              Modify Project
            </button>
          </motion.div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50">
            <Brain className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-900 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* Project Complexity Badge */}
          {projectComplexity && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border border-purple-200"
            >
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                {t.complexity}: {projectComplexity}/10
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* AI Insights Banner */}
        {llmInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-6 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50/50 backdrop-blur-sm"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-2">
                  AI Analysis
                </h3>
                <p className="text-sm text-purple-800 leading-relaxed">
                  {llmInsights.summary}
                </p>
                {llmInsights.key_advantages?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {llmInsights.key_advantages.map((advantage, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-purple-700"
                      >
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{advantage}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Picks */}
        {topPicks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {t.topPicks}
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Best matches from our AI analysis
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {topPicks.map((provider, index) => (
                <TopProviderCard
                  key={provider.id}
                  provider={provider}
                  rank={index + 1}
                  onRequest={handleRequest}
                  onMessage={() =>
                    navigate("/messages", { state: { provider } })
                  }
                  isRequesting={requestingId === provider.id}
                  isRequested={requested.has(provider.id)}
                  t={t}
                  project={project}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.search}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              <select
                value={techFilter}
                onChange={(e) => setTechFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-300 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors shadow-sm min-w-[200px]"
              >
                {techOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-slate-600 bg-white/50 px-4 py-2 rounded-lg">
              {t.showing}{" "}
              <span className="font-semibold text-slate-800">
                {filteredProviders.length}
              </span>{" "}
              {t.of}{" "}
              <span className="font-semibold text-slate-800">
                {recommendations.length}
              </span>{" "}
              {t.providers}
            </div>
          </div>
        </motion.div>

        {/* All Providers Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
        >
          {filteredProviders.map((provider, index) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              index={index}
              onCompareToggle={() => onCompareToggle?.(provider.id)}
              isCompared={selectedCompare?.includes(provider.id)}
              onRequest={() => handleRequest(provider)}
              onMessage={() => navigate("/messages", { state: { provider } })}
              isRequesting={requestingId === provider.id}
              isRequested={requested.has(provider.id)}
              t={t}
              project={project}
            />
          ))}
        </motion.div>

        {/* Compare Button */}
        <AnimatePresence>
          {selectedCompare?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Compare {selectedCompare.length} providers
                      </div>
                      <div className="text-sm text-slate-600">
                        Side-by-side comparison
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onProceed}
                    className="bg-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <span>Proceed to Compare</span>
                    <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

/* -------------------------------- UI COMPONENTS -------------------------------- */

function TopProviderCard({
  provider,
  rank,
  onRequest,
  onMessage,
  isRequesting,
  isRequested,
  t,
  project,
}) {
  const area =
    Number(project?.sizeSqm || project?.size_sqm) > 0
      ? Number(project.sizeSqm || project.size_sqm)
      : 1500;
  const estCost = (provider.baseCost || 0) + (provider.costPerSqm || 0) * area;

  const rankColors = {
    1: "from-amber-500 to-amber-600",
    2: "from-slate-500 to-slate-600",
    3: "from-orange-500 to-orange-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-amber-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

      <div className="relative bg-white rounded-3xl border-2 border-slate-200/60 shadow-lg overflow-hidden backdrop-blur-sm group-hover:shadow-2xl transition-all duration-300">
        {/* Rank Badge */}
        <div className="absolute top-6 right-6 z-10">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
              rankColors[rank] || "from-blue-500 to-blue-700"
            } shadow-lg flex items-center justify-center font-bold text-white text-lg`}
          >
            {rank}
          </div>
        </div>

        <div className="h-2 bg-gradient-to-r from-blue-500 to-amber-500"></div>

        <div className="p-6">
          {/* Provider Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-slate-900 mb-2 truncate">
                {provider.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span>{provider.locationEn}</span>
                </div>
                {provider.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-medium">
                      {typeof provider.rating === "number"
                        ? provider.rating.toFixed(1)
                        : provider.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          {provider.aiReason && (
            <div className="mb-5 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-700" />
                <div className="text-sm font-medium text-blue-900">
                  {t.aiReason}
                </div>
              </div>
              <div className="text-sm text-blue-800 leading-relaxed">
                {provider.aiReason}
              </div>
            </div>
          )}

          {/* Match Reasons */}
          {provider.matchReasons?.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {provider.matchReasons.map((reason, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200 font-medium"
                >
                  ✓ {reason}
                </span>
              ))}
            </div>
          )}

          {/* Score & Cost */}
          <div className="grid grid-cols-1 gap-4 mb-5">
            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-600 mb-1">{t.score}</div>
              <div className="font-bold text-slate-900 text-lg">
                {Math.round(provider.matchScore || provider.finalScore * 100)}
                /100
              </div>
            </div>
          </div>

          {/* Technologies */}
          {provider.technologies?.length > 0 && (
            <div className="mb-5">
              <div className="flex flex-wrap gap-2">
                {provider.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200 font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {provider.technologies.length > 3 && (
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-300">
                    +{provider.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="mb-5 p-3 bg-slate-50 rounded-xl space-y-2 text-sm">
            {provider.contact && (
              <div className="flex items-center gap-2 text-slate-700">
                <span className="font-medium">Contact:</span>
                <span>{provider.contact}</span>
              </div>
            )}
            {provider.phone && (
              <div className="flex items-center gap-2 text-slate-700">
                <span className="font-medium">Phone:</span>
                <span>{provider.phone}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onRequest(provider)}
              disabled={isRequesting || isRequested}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                isRequested
                  ? "bg-emerald-600 text-white shadow-sm"
                  : isRequesting
                  ? "bg-amber-600 text-white animate-pulse shadow-sm"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isRequested ? (
                  <CheckCircle className="h-4 w-4" />
                ) : isRequesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>
                  {isRequesting ? t.sending : isRequested ? t.sent : t.request}
                </span>
              </div>
            </button>
            <button
              onClick={onMessage}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-medium hover:border-blue-300 hover:text-blue-700 hover:shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{t.message}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProviderCard({
  provider,
  index,
  onCompareToggle,
  isCompared,
  onRequest,
  onMessage,
  isRequesting,
  isRequested,
  t,
  project,
}) {
  const area =
    Number(project?.sizeSqm || project?.size_sqm) > 0
      ? Number(project.sizeSqm || project.size_sqm)
      : 1500;
  const estCost = (provider.baseCost || 0) + (provider.costPerSqm || 0) * area;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden backdrop-blur-sm group-hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 mb-1.5 truncate">
                {provider.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  <span>{provider.locationEn}</span>
                </div>
                {provider.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="font-medium">
                      {typeof provider.rating === "number"
                        ? provider.rating.toFixed(1)
                        : provider.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {onCompareToggle && (
              <label className="flex items-center gap-2 text-xs cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-lg px-3 py-2 transition-colors">
                <input
                  type="checkbox"
                  checked={isCompared}
                  onChange={onCompareToggle}
                  className="rounded border-slate-400 text-blue-700 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-700">{t.compare}</span>
              </label>
            )}
          </div>

          {provider.technologies?.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {provider.technologies.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full border border-slate-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {provider.technologies.length > 2 && (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-300">
                    +{provider.technologies.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 mb-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-600 mb-1">{t.score}</div>
              <div className="font-semibold text-slate-900 text-sm">
                {Math.round(provider.matchScore || provider.finalScore * 100)}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onRequest(provider)}
              disabled={isRequesting || isRequested}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                isRequesting
                  ? "bg-amber-600 text-white animate-pulse shadow-sm"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-sm hover:shadow-md"
              }`}
            >
              {isRequesting ? t.sending : isRequested ? t.sent : t.request}
            </button>
            <button
              onClick={onMessage}
              className="flex-1 py-2.5 px-3 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:border-blue-300 hover:text-blue-700 hover:shadow-sm transition-all"
            >
              {t.message}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
