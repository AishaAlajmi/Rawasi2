// src/views/ProjectDashboard.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Gauge,
  Bell,
  CalendarDays,
  Wallet,
  Activity,
  Clock,
  Flag,
  Download,
  Share2,
  ChevronDown,
  Search,
  TrendingUp,
  AlertTriangle,
  FileText,
  MessageSquare,
  CheckCircle2,
  XCircle,
  UserCircle,
  Star,
} from "lucide-react";
import { Section, Pill } from "../components/ui.jsx";
import { currency, pct } from "../lib/utils.js";
import { useLang } from "../context/lang";
import { supabase } from "../lib/supabase";

export default function Dashboard({
  project,
  projects,
  onSelectProject,
  onStartProject,
  onAssignProvider,
}) {
  const { lang } = useLang();
  const isAr = lang === "ar";

  // State for user projects from database
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from Supabase
  useEffect(() => {
    fetchUserProjects();
  }, []);

  const fetchUserProjects = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("User not logged in");
        setLoading(false);
        return;
      }

      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      console.log("✅ Fetched projects:", projectsData);

      // Convert database projects to dashboard format
      const converted = projectsData.map((proj) => ({
        id: proj.id,
        name: proj.name,
        status: proj.status || "planning",
        phase: proj.phase || "Design",
        budget: proj.budget,
        timelineMonths: proj.timeline_months,
        sizeSqm: proj.size_sqm,
        location: proj.location,
        type: proj.type,
        nFloors: proj.n_floors,
        progressPct: proj.progress_percentage / 100,
        budgetUsed: proj.budget_used || 0,
        provider: proj.provider_name
          ? {
              name: proj.provider_name,
              rating: 4.5,
              responsivenessHrs: 8,
              changeOrders: 2,
              onTimeRate: 0.9,
            }
          : null,
        breakdown: { materials: 0.5, labor: 0.35, tech: 0.15 },
        // Generate realistic tasks based on project phase
        tasks: generateTasksFromPhase(proj.phase, proj.timeline_months),
        createdAt: proj.created_at,
      }));

      setUserProjects(converted);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate realistic tasks based on current phase
  const generateTasksFromPhase = (phase, timelineMonths) => {
    const totalWeeks = timelineMonths * 4;
    const phaseMap = {
      Design: 0,
      Permits: 1,
      Groundwork: 2,
      Structure: 3,
      MEP: 4,
      Finishes: 5,
      Handover: 6,
    };

    const currentPhaseIndex = phaseMap[phase] || 0;

    const allTasks = [
      { name: isAr ? "التصميم" : "Design", duration: 4 },
      { name: isAr ? "التراخيص" : "Permits", duration: 6 },
      { name: isAr ? "الأعمال التمهيدية" : "Groundwork", duration: 6 },
      { name: isAr ? "الهيكل" : "Structure", duration: 10 },
      { name: isAr ? "الأعمال الكهروميكانيكية" : "MEP", duration: 8 },
      { name: isAr ? "التشطيبات" : "Finishes", duration: 8 },
      { name: isAr ? "التسليم" : "Handover", duration: 4 },
    ];

    let weekCounter = 0;
    return allTasks.map((task, index) => {
      const baseStart = weekCounter;
      const baseDur = task.duration;

      // If task is before current phase, it's completed
      // If task is current phase, it's in progress
      // If task is after current phase, it hasn't started
      const isCompleted = index < currentPhaseIndex;
      const isCurrent = index === currentPhaseIndex;

      const actStart = isCompleted
        ? baseStart
        : isCurrent
        ? baseStart
        : baseStart + 1;
      const actDur = isCompleted
        ? baseDur
        : isCurrent
        ? Math.floor(baseDur * 0.6)
        : baseDur;

      weekCounter += baseDur;

      return {
        name: task.name,
        baseStart,
        baseDur,
        actStart,
        actDur,
        completed: isCompleted,
        inProgress: isCurrent,
      };
    });
  };

  const t = isAr
    ? {
        title: "لوحة التحكم",
        demoMsg: "أنت تشاهد لوحة تحكم تجريبية. ابدأ مشروعًا لتخصيص المؤشرات.",
        start: "ابدأ مشروعًا",
        projectSwitcher: "المشروع",
        status: "الحالة",
        phase: "المرحلة",
        dateRange: "النطاق الزمني",
        emptyState: "لا توجد مشاريع. ابدأ مشروعًا جديدًا.",
        progress: "التقدم",
        budgetUsed: "الميزانية المستخدمة",
        timeline: "الجدول الزمني",
        monthsPlanned: (m) => `${m} شهرًا مخططًا`,
        milestones: "المعالم",
        alerts: "التنبيهات",
        gantt: "مخطط جانت",
        kpiBudget: "الميزانية مقابل الفعلي",
        kpiEAC: "التكلفة المتوقعة عند الإكمال",
        kpiTime: "الانحراف الزمني",
        kpiPhase: "الحالة / المرحلة",
        kpiPct: "% الإنجاز",
        nextMilestone: "المعلم القادم",
        upcoming: "المهام القادمة",
        overdue: "متأخرة",
        costCurve: "منحنى التكاليف (S)",
        costBreakdown: "تفصيل التكاليف",
        mlInsights: "تحليلات ذكية",
        providerPerf: "أداء المزود",
        actionsComm: "الإجراءات والاتصالات",
        reports: "التقارير",
        generate: "إنشاء",
        download: "تنزيل",
        share: "مشاركة",
        export: "تصدير",
        viewProfile: "عرض الملف",
        confidence: "الثقة",
        riskOverrun: "مخاطر تجاوز الجدول",
        forecastFinish: "تاريخ الانتهاء المتوقع",
        assign: "تعيين",
        message: "مراسلة",
        review: "مراجعة",
        approve: "اعتماد",
        reply: "رد",
        soleProvider: "مزود وحيد للمشروع",
        assignProvider: "تعيين مزود",
        mlNeedsProvider: "سيظهر التنبؤ بالجدول الزمني بعد تعيين مزود",
        of: "من",
        complete: "منجز",
        currentPhase: "المرحلة الحالية",
        totalBudget: "إجمالي الميزانية",
        spent: "تم الإنفاق",
        remaining: "المتبقي",
      }
    : {
        title: "Project Dashboard",
        demoMsg:
          "You are viewing a demo dashboard. Start a project to personalize metrics.",
        start: "Start a project",
        projectSwitcher: "Project",
        status: "Status",
        phase: "Phase",
        dateRange: "Date range",
        emptyState: "No projects. Start a new project.",
        progress: "Progress",
        budgetUsed: "Budget used",
        timeline: "Timeline",
        monthsPlanned: (m) => `${m} months planned`,
        milestones: "Milestones",
        alerts: "Alerts",
        gantt: "Gantt",
        kpiBudget: "Budget vs Actual",
        kpiEAC: "Forecast at Completion",
        kpiTime: "Schedule variance",
        kpiPhase: "Status / Phase",
        kpiPct: "% Progress",
        nextMilestone: "Next milestone",
        upcoming: "Upcoming",
        overdue: "Overdue",
        costCurve: "Cost S-curve",
        costBreakdown: "Cost breakdown",
        mlInsights: "ML Insights",
        providerPerf: "Provider performance",
        actionsComm: "Actions & communication",
        reports: "Reports",
        generate: "Generate",
        download: "Download",
        share: "Share",
        export: "Export",
        viewProfile: "View profile",
        confidence: "Confidence",
        riskOverrun: "Risk of overrun",
        forecastFinish: "Forecast finish",
        assign: "Assign",
        message: "Message",
        review: "Review",
        approve: "Approve",
        reply: "Reply",
        soleProvider: "Sole provider",
        assignProvider: "Assign provider",
        mlNeedsProvider:
          "Timeline forecast available after provider assignment",
        of: "of",
        complete: "complete",
        currentPhase: "Current Phase",
        totalBudget: "Total Budget",
        spent: "Spent",
        remaining: "Remaining",
      };

  const list =
    userProjects.length > 0 ? userProjects : projects?.length ? projects : [];

  const initial = project || list[0];
  const [selectedId, setSelectedId] = useState(initial?.id);
  const selected = useMemo(
    () => list.find((p) => p.id === selectedId) || initial,
    [list, selectedId, initial]
  );

  const [query, setQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");

  const filtered = useMemo(() => {
    return list.filter((p) => {
      if (
        phaseFilter !== "all" &&
        (p.phase || "").toLowerCase() !== phaseFilter
      )
        return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [list, phaseFilter, query]);

  const onPick = (id) => {
    setSelectedId(id);
    const proj = list.find((p) => p.id === id);
    onSelectProject?.(proj);
  };

  // Calculate REAL metrics from selected project
  const timelineMonths = selected?.timelineMonths || 12;
  const totalWeeks = timelineMonths * 4;
  const tasks = selected?.tasks || [];

  // Calculate progress based on completed tasks
  const completedTasks = tasks.filter((t) => t.completed).length;
  const inProgressTasks = tasks.filter((t) => t.inProgress).length;
  const progressPct =
    tasks.length > 0
      ? (completedTasks + inProgressTasks * 0.5) / tasks.length
      : selected?.progressPct || 0;

  // Calculate current week based on progress
  const nowWeek = Math.round(totalWeeks * progressPct);

  // Budget calculations
  const budgetVal = selected?.budget || 0;
  const budgetUsed = selected?.budgetUsed || 0;
  const budgetUsedPct = budgetVal > 0 ? budgetUsed / budgetVal : 0;
  const budgetRemaining = budgetVal - budgetUsed;

  // Forecast calculations
  const plannedPct = tasks.length > 0 ? completedTasks / tasks.length : 0;
  const AC = budgetUsed;
  const EV = budgetVal * progressPct;
  const PV = budgetVal * plannedPct;
  const CPI = AC > 0 ? EV / AC : 1;
  const EAC = CPI > 0 ? budgetVal / CPI : budgetVal;

  const scheduleVarianceDays = Math.round(
    (progressPct - plannedPct) * totalWeeks * 7
  );
  const riskOfOverrun =
    Math.max(0, 1 - CPI) * 0.6 + (plannedPct > progressPct ? 0.2 : 0);

  // Calculate forecast finish week
  const baselineEnd =
    tasks.length > 0
      ? Math.max(...tasks.map((t) => t.baseStart + t.baseDur))
      : totalWeeks;
  const actualEnd =
    tasks.length > 0
      ? Math.max(...tasks.map((t) => t.actStart + t.actDur))
      : totalWeeks;
  const forecastFinishWeek = Math.round(actualEnd * (1 + riskOfOverrun * 0.15));

  // S-curve calculations
  const weeks = [...Array(totalWeeks + 1)].map((_, i) => i);
  const curvePlanned = weeks.map((w) => sigmoid(w / totalWeeks));
  const curveActual = weeks.map((w) =>
    w <= nowWeek
      ? (sigmoid(w / totalWeeks) * progressPct) / curvePlanned[nowWeek]
      : 0
  );
  const curveForecast = weeks.map((w) =>
    sigmoid(w / Math.max(1, forecastFinishWeek))
  );

  const costBreakdown = selected?.breakdown || {
    materials: 0.5,
    labor: 0.35,
    tech: 0.15,
  };
  const { provider } = getProjectProvider(selected);
  const hasProvider = !!provider;

  return (
    <Section
      id="dashboard"
      className="bg-gradient-to-br from-orange-50 to-amber-50/30 min-h-screen"
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Pill>
              <Gauge className="h-4 w-4 text-orange-600" /> {t.title}
            </Pill>
            {selected && (
              <PhaseBadge
                status={selected?.status}
                phase={selected?.phase}
                rtl={isAr}
              />
            )}
            {hasProvider && <Chip>{t.soleProvider}</Chip>}
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-orange-50 transition-colors">
              <Share2 className="h-4 w-4 text-orange-600" />
              {t.share}
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-orange-50 transition-colors">
              <Download className="h-4 w-4 text-orange-600" />
              {t.export}
            </button>
          </div>
        </div>

        {/* Switcher & filters */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-3">
            <div className="mb-1 text-xs text-orange-700">
              {t.projectSwitcher}
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-orange-500" />
              <input
                className="w-full rounded-lg border border-orange-200 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن مشروع" : "Search projects"}
              />
              <ChevronDown className="h-4 w-4 text-orange-500" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(filtered.length ? filtered : list).slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPick(p.id)}
                  className={`truncate rounded-lg border px-2 py-1 text-left text-xs transition-colors ${
                    p.id === selected?.id
                      ? "border-orange-400 bg-orange-100 text-orange-800"
                      : "border-orange-200 bg-white text-slate-700 hover:bg-orange-50"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-3">
            <div className="mb-1 text-xs text-orange-700">{t.phase}</div>
            <div className="flex flex-wrap gap-2">
              {[
                { k: "all", label: isAr ? "الكل" : "All" },
                { k: "design", label: isAr ? "التصميم" : "Design" },
                { k: "structure", label: isAr ? "الهيكل" : "Structure" },
                { k: "handover", label: isAr ? "التسليم" : "Handover" },
              ].map((f) => (
                <button
                  key={f.k}
                  onClick={() => setPhaseFilter(f.k)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    phaseFilter === f.k
                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
                      : "bg-white border border-orange-200 text-slate-700 hover:bg-orange-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-3">
            <div className="mb-1 text-xs text-orange-700">{t.dateRange}</div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="w-full rounded-lg border border-orange-200 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="mb-4 rounded-2xl border border-orange-200 bg-white p-8 text-center">
            <div className="text-orange-600">Loading projects...</div>
          </div>
        )}

        {!loading && !selected && (
          <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
            {t.emptyState}
            <button
              onClick={onStartProject}
              className="ml-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 px-3 py-1 text-white hover:from-orange-600 hover:to-amber-700 transition-all"
            >
              {t.start}
            </button>
          </div>
        )}

        {selected && (
          <div className="grid grid-cols-1 gap-6">
            {/* Project Overview Card */}
            <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-xs text-orange-700 mb-1">
                    {t.currentPhase}
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {selected.phase}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {selected.type} • {selected.sizeSqm} sqm •{" "}
                    {selected.location}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-orange-700 mb-1">
                    {t.progress}
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {pct(progressPct)}
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
                      style={{ width: `${progressPct * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-orange-700 mb-1">
                    {t.totalBudget}
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {currency(budgetVal)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {t.spent}: {currency(budgetUsed)} ({pct(budgetUsedPct)})
                  </div>
                </div>
                <div>
                  <div className="text-xs text-orange-700 mb-1">
                    {t.timeline}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {timelineMonths} mo
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Week {nowWeek} of {totalWeeks}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 1: KPI strip */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <KpiCard
                icon={Activity}
                label={t.kpiPhase}
                value={`${prettyStatus(selected?.status, isAr)} — ${
                  selected?.phase
                }`}
                color={ragColorFrom({ ok: true })}
                spark={[0.1, 0.2, 0.35, progressPct, progressPct]}
                sub={isAr ? "تقدم ثابت" : "Steady progress"}
              />
              <KpiCard
                icon={Wallet}
                label={t.kpiBudget}
                value={`${currency(budgetUsed)} / ${currency(budgetVal)}`}
                color={ragColorFrom({
                  good: budgetUsedPct <= progressPct + 0.05,
                })}
                spark={curveActual.slice(0, 20)}
                sub={`${t.budgetUsed}: ${pct(
                  budgetUsedPct
                )} (CPI: ${CPI.toFixed(2)})`}
              />
              <KpiCard
                icon={TrendingUp}
                label={t.kpiEAC}
                value={currency(EAC)}
                color={ragColorFrom({
                  good: CPI >= 1,
                  warn: CPI < 1 && CPI >= 0.9,
                })}
                spark={curveForecast.slice(0, 20)}
                sub={isAr ? "التكلفة المتوقعة" : "Forecast cost"}
              />
              <KpiCard
                icon={Clock}
                label={t.kpiTime}
                value={`${scheduleVarianceDays} days`}
                color={ragColorFrom({
                  good: scheduleVarianceDays >= -2,
                  warn: scheduleVarianceDays < -2 && scheduleVarianceDays >= -7,
                })}
                spark={curvePlanned.slice(0, 20)}
                sub={isAr ? "مقارنة بالمرجعي" : "vs baseline"}
              />
              <KpiCard
                icon={CheckCircle2}
                label={t.kpiPct}
                value={`${pct(progressPct)} (${completedTasks}/${
                  tasks.length
                })`}
                color={ragColorFrom({ good: true })}
                spark={[...Array(12)].map((_, i) => (i / 11) * progressPct)}
                sub={t.complete}
              />
            </div>

            {/* Row 2: Gantt & Cost */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Gantt Chart */}
              <div className="lg:col-span-2 rounded-2xl border border-orange-200 bg-orange-50/50 p-6 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-orange-800">
                  <Flag className="h-4 w-4 text-orange-600" /> {t.gantt}
                </div>
                <Gantt
                  tasks={tasks}
                  totalWeeks={totalWeeks}
                  nowWeek={nowWeek}
                  forecastFinishWeek={forecastFinishWeek}
                  mlEnabled={hasProvider}
                  mlTip={t.mlNeedsProvider}
                  rtl={isAr}
                />
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white p-3 shadow-sm border border-orange-200">
                    <div className="mb-1 text-orange-700">{t.upcoming}</div>
                    <ul className="space-y-1 text-slate-800">
                      {tasks
                        .filter((t) => !t.completed && !t.inProgress)
                        .slice(0, 3)
                        .map((m) => (
                          <li key={m.name} className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-orange-600" />{" "}
                            {m.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm border border-orange-200">
                    <div className="mb-1 text-orange-700">
                      {isAr ? "قيد التنفيذ" : "In Progress"}
                    </div>
                    <ul className="space-y-1 text-slate-800">
                      {tasks
                        .filter((t) => t.inProgress)
                        .map((m) => (
                          <li key={m.name} className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-600" />{" "}
                            {m.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cost S-curve & Donut */}
              <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 shadow-sm">
                <div className="mb-2 text-sm font-medium text-orange-800">
                  {t.costCurve}
                </div>
                <SCurveChart
                  weeks={weeks}
                  planned={curvePlanned}
                  actual={curveActual}
                  forecast={curveForecast}
                />
                <div className="mt-4 text-sm font-medium text-orange-800">
                  {t.costBreakdown}
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <Donut
                    size={120}
                    segments={[
                      {
                        key: "materials",
                        label: isAr ? "المواد" : "Materials",
                        value: costBreakdown.materials,
                      },
                      {
                        key: "labor",
                        label: isAr ? "العمل" : "Labor",
                        value: costBreakdown.labor,
                      },
                      {
                        key: "tech",
                        label: isAr ? "التقنية" : "Tech",
                        value: costBreakdown.tech,
                      },
                    ]}
                  />
                  <div className="text-xs text-orange-800">
                    <Legend label={isAr ? "المواد" : "Materials"} />{" "}
                    {pct(costBreakdown.materials)}
                    <br />
                    <Legend label={isAr ? "العمل" : "Labor"} />{" "}
                    {pct(costBreakdown.labor)}
                    <br />
                    <Legend label={isAr ? "التقنية" : "Tech"} />{" "}
                    {pct(costBreakdown.tech)}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Provider & ML Insights */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
                <div className="mb-2 text-sm font-medium text-orange-800">
                  {t.providerPerf}
                </div>
                <div className="flex items-center gap-3">
                  <UserCircle className="h-10 w-10 text-orange-500" />
                  <div>
                    <div className="font-medium text-slate-900">
                      {provider?.name || "—"}
                    </div>
                    {provider && (
                      <div className="flex items-center gap-2 text-xs text-orange-700">
                        <Stars rating={provider?.rating || 0} />
                        <span>
                          • {isAr ? "الاستجابة" : "Resp."}: ~
                          {provider?.responsivenessHrs}h
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {!hasProvider && (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <span>{t.mlNeedsProvider}</span>
                    <button
                      onClick={() => onAssignProvider?.(selected?.id)}
                      className="rounded-md bg-gradient-to-r from-amber-500 to-amber-600 px-2 py-1 text-white hover:from-amber-600 hover:to-amber-700 transition-all"
                    >
                      {t.assignProvider}
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
                <div className="mb-2 text-sm font-medium text-orange-800">
                  {t.mlInsights}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3">
                    <div className="text-xs text-orange-700">{t.remaining}</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {currency(budgetRemaining)}
                    </div>
                    <Chip>
                      {pct(budgetRemaining / budgetVal)}{" "}
                      {isAr ? "متبقي" : "left"}
                    </Chip>
                  </div>
                  <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3">
                    <div className="text-xs text-orange-700">
                      {t.forecastFinish}
                    </div>
                    {hasProvider ? (
                      <>
                        <div className="text-sm font-semibold text-slate-900">
                          {isAr
                            ? `الأسبوع ${forecastFinishWeek}`
                            : `Week ${forecastFinishWeek}`}
                        </div>
                        <Chip>
                          {t.riskOverrun}: {pct(riskOfOverrun)}
                        </Chip>
                      </>
                    ) : (
                      <div className="text-sm text-orange-600">
                        {t.mlNeedsProvider}
                      </div>
                    )}
                  </div>
                  <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3">
                    <div className="text-xs text-orange-700">
                      {isAr ? "الحالة العامة" : "Overall Health"}
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {CPI >= 0.95
                        ? isAr
                          ? "ممتاز"
                          : "Excellent"
                        : CPI >= 0.85
                        ? isAr
                          ? "جيد"
                          : "Good"
                        : isAr
                        ? "يحتاج انتباه"
                        : "Needs attention"}
                    </div>
                    <Chip>CPI: {CPI.toFixed(2)}</Chip>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Reports */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm font-medium text-orange-800">
                  {t.reports}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="rounded-lg border border-orange-200 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-orange-50 transition-colors">
                    <FileText className="h-4 w-4 text-orange-600" />
                    {t.generate}
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-orange-50 transition-colors">
                    <Download className="h-4 w-4 text-orange-600" />
                    {t.download}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

// ---------- Components ----------

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "green",
  spark = [],
}) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-orange-700">
        <Icon className="h-4 w-4 text-orange-600" /> {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs text-orange-600">{sub}</span>
        <Sparkline data={spark} color={color} />
      </div>
    </div>
  );
}

function Sparkline({ data, width = 80, height = 24, color = "green" }) {
  if (!data?.length) return <div className="h-6 w-20" />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const scaleX = (i) => (i / (data.length - 1)) * width;
  const scaleY = (v) =>
    height - ((v - min) / Math.max(1e-6, max - min)) * height;
  const path = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(v)}`)
    .join(" ");
  const stroke =
    color === "red" ? "#ef4444" : color === "amber" ? "#f59e0b" : "#10b981";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

function PhaseBadge({ status = "", phase = "", rtl = false }) {
  const statusText = prettyStatus(status, rtl);
  const color =
    status === "in-progress"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "planning"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <div className={`rounded-full border px-3 py-1 text-xs ${color}`}>
      {statusText} • {phase || (rtl ? "غير محدد" : "N/A")}
    </div>
  );
}

function Stars({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {half && <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <Star key={`e${i}`} className="h-4 w-4 text-slate-300" />
      ))}
      <span className="ml-1 text-xs text-slate-600">{rating.toFixed(1)}</span>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="ml-2 rounded-full border border-orange-200 bg-orange-100 px-2 py-0.5 text-[10px] text-orange-800">
      {children}
    </span>
  );
}

function Legend({ label }) {
  return (
    <span className="mr-2 inline-flex items-center gap-1">
      <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />{" "}
      {label}
    </span>
  );
}

function Donut({ segments = [], size = 120, stroke = 16 }) {
  const R = (size - stroke) / 2;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={R} fill="none" stroke="#fed7aa" strokeWidth={stroke} />
        {segments.map((s, i) => {
          const len = s.value * C;
          const dash = `${len} ${C - len}`;
          const colors = ["#ea580c", "#f59e0b", "#d97706"];
          const col = colors[i % colors.length];
          const el = (
            <circle
              key={s.key}
              r={R}
              fill="none"
              stroke={col}
              strokeWidth={stroke}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
        <text textAnchor="middle" dy="4" className="fill-orange-700 text-xs">
          {segments.length ? `${Math.round(segments[0].value * 100)}%` : ""}
        </text>
      </g>
    </svg>
  );
}

function SCurveChart({
  weeks,
  planned,
  actual,
  forecast,
  width = 500,
  height = 180,
}) {
  const pad = 24;
  const W = width;
  const H = height;
  const X = (i) => pad + (i / Math.max(1, weeks.length - 1)) * (W - pad * 2);
  const Y = (v) => H - pad - v * (H - pad * 2);

  const toPath = (arr) =>
    arr.map((v, i) => `${i === 0 ? "M" : "L"}${X(i)},${Y(v)}`).join(" ");
  const area = (arr) =>
    `${toPath(arr)} L ${X(arr.length - 1)},${Y(0)} L ${X(0)},${Y(0)} Z`;

  return (
    <div className="rounded-xl bg-white p-3 shadow-sm border border-orange-200">
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((g, i) => (
          <line
            key={i}
            x1={pad}
            x2={W - pad}
            y1={Y(g)}
            y2={Y(g)}
            stroke="#fed7aa"
            strokeWidth="1"
          />
        ))}
        <path d={area(planned)} fill="#ea580c33" stroke="none" />
        <path d={area(actual)} fill="#f59e0b22" stroke="none" />
        <path d={area(forecast)} fill="#d9770622" stroke="none" />
        <path
          d={toPath(planned)}
          fill="none"
          stroke="#ea580c"
          strokeWidth="2"
        />
        <path d={toPath(actual)} fill="none" stroke="#f59e0b" strokeWidth="2" />
        <path
          d={toPath(forecast)}
          fill="none"
          stroke="#d97706"
          strokeWidth="2"
        />
        <g
          transform={`translate(${pad}, ${pad - 8})`}
          className="text-[10px] fill-orange-700"
        >
          <LegendSwatch color="#ea580c" label="Planned" />
          <LegendSwatch color="#f59e0b" label="Actual" x={80} />
          <LegendSwatch color="#d97706" label="Forecast" x={150} />
        </g>
      </svg>
    </div>
  );
}

function LegendSwatch({ color, label, x = 0 }) {
  return (
    <g transform={`translate(${x},0)`}>
      <rect width="10" height="10" fill={color} rx="2" />
      <text x="14" y="9">
        {label}
      </text>
    </g>
  );
}

function Gantt({
  tasks,
  totalWeeks,
  nowWeek,
  forecastFinishWeek,
  mlEnabled = true,
  mlTip,
  rtl = false,
}) {
  const weeks = Array.from(
    { length: Math.min(totalWeeks, 36) },
    (_, i) => i + 1
  );
  const dir = rtl ? "[direction:rtl]" : "";
  return (
    <div className="rounded-xl border border-orange-200 bg-white p-3">
      <div
        className={`grid ${dir}`}
        style={{
          gridTemplateColumns: `160px repeat(${weeks.length}, minmax(16px, 1fr))`,
        }}
      >
        <div className="px-2 text-xs text-orange-700">
          {rtl ? "المهمة" : "Task"}
        </div>
        {weeks.map((w) => (
          <div key={w} className="text-center text-[10px] text-orange-500">
            {w}
          </div>
        ))}
      </div>
      <div className="mt-2 space-y-2">
        {tasks.map((t) => (
          <GanttRow
            key={t.name}
            task={t}
            totalWeeks={weeks.length}
            rtl={rtl}
            nowWeek={nowWeek}
          />
        ))}
        {/* Current week marker */}
        <div
          className="relative grid items-center"
          style={{ gridTemplateColumns: `160px 1fr` }}
        >
          <div className="px-2 text-xs text-green-600">
            {rtl ? "الآن" : "Now"}
          </div>
          <div className="relative h-6 rounded bg-green-100">
            <div
              className="absolute top-0 h-6 border-2 border-dashed border-green-500"
              style={{
                [rtl ? "right" : "left"]: `${(nowWeek / weeks.length) * 100}%`,
              }}
            />
          </div>
        </div>
        {/* ML forecast finish marker */}
        <div
          className="relative grid items-center"
          style={{ gridTemplateColumns: `160px 1fr` }}
        >
          <div className="px-2 text-xs text-orange-600">ML</div>
          <div className="relative h-6 rounded bg-orange-100">
            {mlEnabled ? (
              <div
                className="absolute top-0 h-6 border border-dashed border-amber-500"
                style={{
                  [rtl ? "right" : "left"]: `${
                    (forecastFinishWeek / weeks.length) * 100
                  }%`,
                }}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-[10px] text-orange-600">
                {mlTip}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 text-right text-[10px] text-orange-600">
        {rtl ? `الأسبوع الحالي: ${nowWeek}` : `Current week: ${nowWeek}`}
      </div>
    </div>
  );
}

function GanttRow({ task, totalWeeks, rtl, nowWeek }) {
  const leftBase = `${(task.baseStart / totalWeeks) * 100}%`;
  const widthBase = `${(task.baseDur / totalWeeks) * 100}%`;
  const leftAct = `${(task.actStart / totalWeeks) * 100}%`;
  const widthAct = `${(task.actDur / totalWeeks) * 100}%`;
  const baseStyle = rtl
    ? { right: leftBase, width: widthBase }
    : { left: leftBase, width: widthBase };
  const actStyle = rtl
    ? { right: leftAct, width: widthAct }
    : { left: leftAct, width: widthAct };

  // Determine bar color based on task status
  const barColor = task.completed
    ? "bg-green-500/90"
    : task.inProgress
    ? "bg-amber-500/90"
    : "bg-slate-300/90";

  return (
    <div
      className="relative grid items-center"
      style={{ gridTemplateColumns: `160px 1fr` }}
    >
      <div className="truncate px-2 text-xs text-orange-800 flex items-center gap-1">
        {task.completed && <CheckCircle2 className="h-3 w-3 text-green-600" />}
        {task.inProgress && <Activity className="h-3 w-3 text-amber-600" />}
        {task.name}
      </div>
      <div className="relative h-6 rounded bg-orange-100">
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-md bg-orange-300/80"
          style={{ height: "14px", ...baseStyle }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 rounded-md ${barColor}`}
          style={{ height: "14px", ...actStyle }}
        />
      </div>
    </div>
  );
}

// ---------- Utils ----------

function getProjectProvider(p) {
  if (!p) return { provider: null, issue: "no-project" };
  if (Array.isArray(p?.provider)) {
    return { provider: p.provider[0] || null, issue: "array" };
  }
  if (Array.isArray(p?.providers)) {
    return { provider: p.providers[0] || null, issue: "legacy-multi" };
  }
  return {
    provider: p?.provider || null,
    issue: p?.provider ? null : "missing",
  };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-12 * (x - 0.5)));
}

function ragColorFrom({ good = false, warn = false, ok = false } = {}) {
  if (good || ok) return "green";
  if (warn) return "amber";
  return "red";
}

function prettyStatus(s, rtl) {
  const map = {
    "in-progress": rtl ? "قيد التنفيذ" : "In progress",
    planning: rtl ? "تخطيط" : "Planning",
    completed: rtl ? "مكتمل" : "Completed",
  };
  return map[s] || s || (rtl ? "—" : "—");
}
