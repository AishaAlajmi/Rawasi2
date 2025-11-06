import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Building2,
  Star,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { Section, Pill, Stat } from "../components/ui.jsx";
import rawasiLogo from "../assets/photo_2025-08-13_21-03-51.jpg";
import princePortrait from "../assets/MohamedBenSalaman.png";
import { useLang } from "../context/lang";

export default function Landing() {
  const navigate = useNavigate();
  const { lang } = useLang();

  return (
    <div className="space-y-16">
      {/* HERO */}
      <Section
        id="home"
        className="bg-gradient-to-br from-blue-50 via-white to-orange-50/30"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2">
          <div>
            <Pill className="bg-orange-100 text-orange-800 border-orange-200">
              <Sparkles className="h-4 w-4 text-orange-600" />
              {lang === "ar"
                ? "مواءمة أذكى للمقاولين باستخدام الذكاء الاصطناعي"
                : "Smarter provider matching with ML"}
            </Pill>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
              {lang === "ar" ? (
                <>
                  اعثر على{" "}
                  <span className="text-orange-600">الفريق المناسب</span>{" "}
                  لمشروعك
                </>
              ) : (
                <>
                  Find the <span className="text-orange-600">right team</span>{" "}
                  for your build
                </>
              )}
            </h1>

            <p className="mt-4 max-w-xl text-slate-600">
              {lang === "ar"
                ? "أضف مشروعك مرة واحدة، ثم انتقل خطوة بخطوة من التقديرات إلى مزودي الخدمة المتوافقين والتعاون معهم."
                : "Add your project once, then move step-by-step from estimates to matched providers and collaboration."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/project")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 font-medium hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {lang === "ar" ? "ابدأ مشروعك" : "Start your project"}{" "}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <Stat
                label={lang === "ar" ? "المقاولون" : "Providers"}
                value="250+"
                icon={Building2}
              />
              <Stat
                label={lang === "ar" ? "متوسط التقييم" : "Avg. rating"}
                value="4.6/5"
                icon={Star}
              />
              <Stat
                label={lang === "ar" ? "المشاريع المطابقة" : "Matched projects"}
                value="2,100+"
                icon={CheckCircle2}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-3xl blur-xl"
              aria-hidden="true"
            />
            <div className="relative bg-white rounded-2xl border border-orange-200 shadow-xl p-8 backdrop-blur-sm">
              <img src={rawasiLogo} alt="Rawasi" className="mx-auto w-36" />
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-700">
                <HeroTile
                  title={lang === "ar" ? "حساب التكلفة" : "Cost estimator"}
                  subtitle={
                    lang === "ar"
                      ? "توقع الميزانية والمدة"
                      : "Forecast budget & time"
                  }
                />
                <HeroTile
                  title={lang === "ar" ? "توصيات ذكية" : "ML ranking"}
                  subtitle={
                    lang === "ar" ? "أفضل مزودي الخدمة" : "Best-fit providers"
                  }
                />
                <HeroTile
                  title={lang === "ar" ? "مقارنة" : "Compare"}
                  subtitle={
                    lang === "ar"
                      ? "مقارنة جنبًا إلى جنب"
                      : "Side-by-side picks"
                  }
                />
                <HeroTile
                  title={lang === "ar" ? "تتبع" : "Track"}
                  subtitle={
                    lang === "ar" ? "الميزانية والمعالم" : "Budget & milestones"
                  }
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      <RoyalQuote lang={lang} />
      <AboutWhyRawasi lang={lang} />
      <HowRawasiWorks lang={lang} />
    </div>
  );
}

function HeroTile({ title, subtitle }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 p-4 border border-blue-200/50">
      <div className="font-medium text-slate-900">{title}</div>
      <div className="text-xs text-slate-600 mt-1">{subtitle}</div>
    </div>
  );
}

function RoyalQuote({ lang }) {
  const isArabic = lang === "ar";
  const title = isArabic
    ? "كلمة صاحب السمو الملكي الأمير"
    : "Words from HRH the Crown Prince";
  const name = isArabic
    ? "محمد بن سلمان بن عبدالعزيز"
    : "Mohammed bin Salman bin Abdulaziz";
  const role = isArabic
    ? "ولي العهد، رئيس مجلس الوزراء"
    : "Crown Prince, Prime Minister";
  const quote = isArabic
    ? "طموحنا أن نبني وطنًا أكثر ازدهارًا، يجد فيه كل مواطن ما يتمناه. لن نقبل إلا أن نجعله في مقدمة دول العالم."
    : "Our ambition is to build a more prosperous nation, where every citizen finds what they aspire to. We will accept nothing less than being among the leading nations of the world.";

  return (
    <Section
      id="royal-quote"
      className="bg-gradient-to-br from-slate-50 to-blue-50/30"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <div className="text-orange-600 text-sm font-semibold tracking-wide">
              {title}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {name}
            </h2>
            <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl p-6 border border-orange-200">
              <div className="relative">
                <Quote
                  className="absolute -top-2 -left-2 h-6 w-6 text-orange-500/40"
                  aria-hidden="true"
                />
                <p className="text-slate-800 text-lg leading-relaxed pl-4">
                  {quote}
                </p>
              </div>
            </div>
            <div className="text-slate-600 text-sm">
              <span className="font-semibold text-orange-700">
                {isArabic ? "صاحب السمو الملكي الأمير" : "HRH"} {name}
              </span>
              {" — "}
              {role}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-3xl blur-xl"
              aria-hidden="true"
            />
            <div className="relative bg-white rounded-2xl border border-orange-200 shadow-lg p-6 backdrop-blur-sm">
              <svg
                className="absolute top-4 right-4 h-16 w-16 text-orange-500/20"
                viewBox="0 0 120 120"
                aria-hidden="true"
              >
                <path
                  d="M16 88c24 0 36-28 44-28s20 28 44 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                />
                <path
                  d="M60 22c0 10-6 18-18 18s-18-8-18-18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                />
              </svg>
              <img
                src={princePortrait}
                alt={
                  isArabic
                    ? "صورة لسمو ولي العهد"
                    : "Portrait of the Crown Prince"
                }
                className="w-full h-auto rounded-xl shadow-md"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function AboutWhyRawasi({ lang }) {
  const isAr = lang === "ar";
  const badge = isAr ? "لماذا رَواسي؟" : "Why Rawasi";
  const title = isAr
    ? "اختيارٌ ذكي، تنفيذٌ أسرع"
    : "Smarter selection, faster delivery";
  const lead = isAr
    ? "منصّة مقاولات تجمع البيانات بالخبرة؛ ترافقك من أوّل فكرة حتى التسليم."
    : "A contractor platform that blends data with know‑how—from first idea to handover.";

  const features = isAr
    ? [
        {
          t: "مواءمة ذكية",
          d: "مطابقة فورية بين متطلبات مشروعك وقدرات المورّدين.",
        },
        {
          t: "شفافية وتنافسية",
          d: "عروض واضحة، مقارنة عادلة، وسجل أداء لكل مزوّد.",
        },
        {
          t: "تحكّم وتتبع",
          d: "لوحة مؤشرات، ميزانية ومعالم، وتنبيهات عند الانحراف.",
        },
      ]
    : [
        {
          t: "Smart matching",
          d: "Instant alignment between your scope and vendor capabilities.",
        },
        {
          t: "Transparent & competitive",
          d: "Clear quotes, fair comparison, and provider track records.",
        },
        {
          t: "Control & tracking",
          d: "Dashboards, budget & milestones, and alerts when off-track.",
        },
      ];

  const metrics = isAr
    ? [
        { v: "≤ 48h", l: "استلام عروض" },
        { v: "92%", l: "دقّة المطابقة" },
        { v: "4.6/5", l: "رضا العملاء" },
      ]
    : [
        { v: "≤ 48h", l: "Quotes received" },
        { v: "92%", l: "Match accuracy" },
        { v: "4.6/5", l: "Satisfaction" },
      ];

  return (
    <Section
      id="about-why"
      className="bg-gradient-to-br from-white to-blue-50/30"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-200">
            {badge}
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
            {title}
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">{lead}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureRow key={i} title={f.t} text={f.d} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {metrics.map((m, i) => (
            <StatBubble key={i} value={m.v} label={m.l} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function HowRawasiWorks({ lang }) {
  const isAr = lang === "ar";
  return (
    <Section
      id="about-how"
      className="bg-gradient-to-br from-blue-50/30 to-orange-50/30"
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
            {isAr ? "خطوات العمل" : "Process"}
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
            {isAr ? "كيف تعمل رَواسي" : "How Rawasi works"}
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            {isAr
              ? "خطوات بسيطة من التعريف بالمشروع حتى تسليم المفتاح."
              : "Simple steps from defining scope to handover."}
          </p>
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-blue-200 shadow-lg p-8">
          <ol className="space-y-6">
            <StepRow
              n={1}
              title={isAr ? "أضف مشروعك" : "Add your project"}
              text={
                isAr
                  ? "نطاق، ميزانية، موقع، وموعد البدء."
                  : "Scope, budget, location, and start date."
              }
            />
            <StepRow
              n={2}
              title={isAr ? "نُقدّر ونُرتّب" : "We estimate & rank"}
              text={
                isAr
                  ? "تقدير تكلفة ومدة، وترتيب المورّدين حسب الملاءمة."
                  : "Cost/time estimate and ML ranking of best-fit providers."
              }
            />
            <StepRow
              n={3}
              title={isAr ? "قارن وتعاقد" : "Compare & contract"}
              text={
                isAr
                  ? "عروض واضحة وتواصل آمن بالملفات."
                  : "Clear quotes and secure messaging with files."
              }
            />
            <StepRow
              n={4}
              title={isAr ? "تابع التنفيذ" : "Track execution"}
              text={
                isAr
                  ? "ميزانية، معالم، وتقارير أسبوعية."
                  : "Budget, milestones, and weekly reports."
              }
            />
          </ol>
        </div>
      </div>
    </Section>
  );
}

function FeatureRow({ title, text }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-orange-300 transition-colors">
      <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mt-1">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 6L9 17l-5-5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div>
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="text-slate-600 text-sm mt-1">{text}</div>
      </div>
    </div>
  );
}

function StepRow({ n, title, text }) {
  return (
    <li className="flex items-start gap-6">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
        {n}
      </div>
      <div className="min-w-0 pt-2">
        <div className="font-semibold text-slate-900 text-lg">{title}</div>
        <div className="text-slate-600 mt-1">{text}</div>
      </div>
    </li>
  );
}

function StatBubble({ value, label }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="text-2xl font-bold text-orange-600">{value}</div>
      <div className="text-slate-600 text-sm mt-1">{label}</div>
    </div>
  );
}
