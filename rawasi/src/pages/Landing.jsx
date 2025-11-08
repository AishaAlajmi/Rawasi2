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
  Zap,
  Shield,
  TrendingUp,
  Users,
  Clock,
  Award,
} from "lucide-react";
import { Section, Pill, Stat } from "../components/ui.jsx";
import rawasiLogo from "../assets/im-947097.avif";
import princePortrait from "../assets/MohamedBenSalaman.png";
import { useLang } from "../context/lang";

export default function Landing() {
  const navigate = useNavigate();
  const { lang } = useLang();

  return (
    <div className="space-y-0 overflow-hidden">
      {/* HERO */}
      <Section
        id="home"
        className="relative bg-gradient-to-br from-slate-50 via-white to-orange-50/40 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Pill className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-300 shadow-sm">
                <Sparkles className="h-4 w-4 text-orange-600" />
                {lang === "ar"
                  ? "مواءمة أذكى للمقاولين باستخدام الذكاء الاصطناعي"
                  : "AI-Powered Smart Matching"}
              </Pill>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3 text-5xl font-black tracking-tight text-slate-900 md:text-7xl leading-tight"
            >
              {lang === "ar" ? (
                <>
                  اعثر على{" "}
                  <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    الفريق المناسب
                  </span>{" "}
                  لمشروعك
                </>
              ) : (
                <>
                  Find the{" "}
                  <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    perfect team
                  </span>{" "}
                  for your build
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-xl text-lg text-slate-600 leading-relaxed"
            >
              {lang === "ar"
                ? "منصة متكاملة تربطك بأفضل المقاولين باستخدام الذكاء الاصطناعي - من التقدير إلى التنفيذ."
                : "Complete platform connecting you with top contractors using ML - from estimation to execution."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => navigate("/project")}
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 font-semibold text-lg hover:from-orange-600 hover:to-amber-600 shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
              >
                {lang === "ar" ? "ابدأ مشروعك" : "Start your project"}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("about-how")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-slate-700 px-8 py-4 font-semibold text-lg border-2 border-slate-200 hover:border-orange-300 hover:text-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {lang === "ar" ? "كيف يعمل" : "How it works"}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              <StatCard
                label={lang === "ar" ? "المقاولون" : "Providers"}
                value="250+"
                icon={Building2}
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                label={lang === "ar" ? "التقييم" : "Rating"}
                value="4.6★"
                icon={Star}
                color="from-amber-500 to-yellow-500"
              />
              <StatCard
                label={lang === "ar" ? "المشاريع" : "Projects"}
                value="2.1K+"
                icon={CheckCircle2}
                color="from-green-500 to-emerald-500"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-3xl blur-3xl animate-pulse" />

            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-orange-200 shadow-2xl p-8 hover:shadow-orange-200/50 transition-shadow duration-500">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="mb-6 flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl blur-xl opacity-50" />
                  <img
                    src={rawasiLogo}
                    alt="Rawasi"
                    className="relative mx-auto w-40 drop-shadow-2xl"
                  />
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <HeroFeatureCard
                  icon={<Zap className="h-5 w-5" />}
                  title={lang === "ar" ? "حساب التكلفة" : "Cost Estimator"}
                  subtitle={
                    lang === "ar" ? "توقع دقيق للميزانية" : "Accurate budgeting"
                  }
                  delay={0.7}
                />
                <HeroFeatureCard
                  icon={<TrendingUp className="h-5 w-5" />}
                  title={lang === "ar" ? "توصيات ذكية" : "Smart Ranking"}
                  subtitle={
                    lang === "ar" ? "أفضل المقاولين" : "Best contractors"
                  }
                  delay={0.8}
                />
                <HeroFeatureCard
                  icon={<Users className="h-5 w-5" />}
                  title={lang === "ar" ? "مقارنة شاملة" : "Compare"}
                  subtitle={lang === "ar" ? "عروض متعددة" : "Multiple quotes"}
                  delay={0.9}
                />
                <HeroFeatureCard
                  icon={<Clock className="h-5 w-5" />}
                  title={lang === "ar" ? "تتبع مباشر" : "Live Tracking"}
                  subtitle={
                    lang === "ar" ? "متابعة لحظية" : "Real-time updates"
                  }
                  delay={1.0}
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

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div
        className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${color} mb-2`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-600 mt-1">{label}</div>
    </motion.div>
  );
}

function HeroFeatureCard({ icon, title, subtitle, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/50 p-5 border border-orange-200/50 hover:border-orange-300 transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="font-bold text-slate-900 text-sm">{title}</div>
      <div className="text-xs text-slate-600 mt-1">{subtitle}</div>
    </motion.div>
  );
}

function RoyalQuote({ lang }) {
  const isArabic = lang === "ar";
  const title = isArabic ? "كلمة صاحب السمو الملكي" : "Words from HRH";
  const name = isArabic ? "محمد بن سلمان" : "Mohammed bin Salman";
  const role = isArabic
    ? "ولي العهد، رئيس مجلس الوزراء"
    : "Crown Prince, Prime Minister";
  const quote = isArabic
    ? "طموحنا أن نبني وطنًا أكثر ازدهارًا، يجد فيه كل مواطن ما يتمناه. لن نقبل إلا أن نجعله في مقدمة دول العالم."
    : "Our ambition is to build a more prosperous nation, where every citizen finds what they aspire to. We will accept nothing less than being among the leading nations of the world.";

  return (
    <Section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-orange-200">
              <Award className="h-3.5 w-3.5" />
              {title}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {name}
            </h2>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <Quote className="h-6 w-6 text-orange-600 mb-3" />
              <p className="text-slate-700 text-base leading-relaxed">
                {quote}
              </p>
            </div>

            <div className="text-slate-600 text-sm">
              <span className="font-semibold text-orange-600">{name}</span>
              <span className="text-slate-500"> — {role}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Beautiful orange glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-3xl blur-2xl transform scale-105" />

              {/* Image container */}
              <div className="relative bg-slate-50 rounded-2xl border border-slate-200 p-4 shadow-lg">
                <img
                  src={princePortrait}
                  alt={isArabic ? "ولي العهد" : "Crown Prince"}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function AboutWhyRawasi({ lang }) {
  const isAr = lang === "ar";

  const features = isAr
    ? [
        {
          icon: <Zap className="h-6 w-6" />,
          title: "مواءمة فورية بالذكاء الاصطناعي",
          description: "خوارزميات متقدمة تربطك بأفضل المقاولين خلال دقائق",
          color: "from-orange-500 to-amber-500",
        },
        {
          icon: <Shield className="h-6 w-6" />,
          title: "شفافية كاملة",
          description: "عروض واضحة، تقييمات موثوقة، وسجل أداء لكل مقاول",
          color: "from-blue-500 to-cyan-500",
        },
        {
          icon: <TrendingUp className="h-6 w-6" />,
          title: "تتبع احترافي",
          description: "لوحة تحكم شاملة لمتابعة الميزانية والمعالم الرئيسية",
          color: "from-green-500 to-emerald-500",
        },
      ]
    : [
        {
          icon: <Zap className="h-6 w-6" />,
          title: "Instant AI Matching",
          description:
            "Advanced algorithms connect you with top contractors in minutes",
          color: "from-orange-500 to-amber-500",
        },
        {
          icon: <Shield className="h-6 w-6" />,
          title: "Complete Transparency",
          description:
            "Clear quotes, verified reviews, and track record for every contractor",
          color: "from-blue-500 to-cyan-500",
        },
        {
          icon: <TrendingUp className="h-6 w-6" />,
          title: "Professional Tracking",
          description:
            "Comprehensive dashboard to monitor budget and key milestones",
          color: "from-green-500 to-emerald-500",
        },
      ];

  return (
    <Section className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 px-6 py-3 rounded-full text-sm font-bold border-2 border-orange-300 shadow-lg mb-6">
            <Sparkles className="h-4 w-4" />
            {isAr ? "لماذا رَواسي؟" : "Why Rawasi"}
          </span>

          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
            {isAr ? (
              <>
                اختيار{" "}
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  ذكي
                </span>
                ، تنفيذ{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  أسرع
                </span>
              </>
            ) : (
              <>
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Smart
                </span>{" "}
                selection,
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {" "}
                  faster
                </span>{" "}
                delivery
              </>
            )}
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {isAr
              ? "منصة متكاملة تجمع البيانات بالخبرة - من الفكرة الأولى حتى التسليم النهائي"
              : "Complete platform combining data with expertise - from first idea to final handover"}
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} index={i} />
          ))}
        </div>

        <MetricsSection lang={lang} />
      </div>
    </Section>
  );
}

function FeatureCard({ icon, title, description, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="group relative bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-orange-300 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div
        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${color} text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}
      >
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

function MetricsSection({ lang }) {
  const isAr = lang === "ar";
  const metrics = isAr
    ? [
        {
          value: "< 48h",
          label: "استلام عروض",
          icon: <Clock className="h-6 w-6" />,
        },
        {
          value: "92%",
          label: "دقة المطابقة",
          icon: <TrendingUp className="h-6 w-6" />,
        },
        {
          value: "4.6★",
          label: "رضا العملاء",
          icon: <Star className="h-6 w-6" />,
        },
      ]
    : [
        {
          value: "< 48h",
          label: "Get quotes",
          icon: <Clock className="h-6 w-6" />,
        },
        {
          value: "92%",
          label: "Match accuracy",
          icon: <TrendingUp className="h-6 w-6" />,
        },
        {
          value: "4.6★",
          label: "Satisfaction",
          icon: <Star className="h-6 w-6" />,
        },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid gap-6 md:grid-cols-3"
    >
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              {metric.icon}
            </div>
          </div>
          <div className="text-5xl font-black mb-2">{metric.value}</div>
          <div className="text-orange-100 font-medium">{metric.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function HowRawasiWorks({ lang }) {
  const isAr = lang === "ar";

  const steps = isAr
    ? [
        {
          title: "أضف مشروعك",
          description: "حدد النطاق، الميزانية، الموقع، وموعد البدء بسهولة",
          icon: <CheckCircle2 className="h-6 w-6" />,
        },
        {
          title: "احصل على التقديرات",
          description: "نظامنا الذكي يحسب التكلفة والمدة بدقة عالية",
          icon: <TrendingUp className="h-6 w-6" />,
        },
        {
          title: "قارن العروض",
          description: "استعرض عروض متعددة من مقاولين موثوقين",
          icon: <Users className="h-6 w-6" />,
        },
        {
          title: "تابع التنفيذ",
          description: "راقب التقدم والميزانية بتقارير أسبوعية مفصلة",
          icon: <Award className="h-6 w-6" />,
        },
      ]
    : [
        {
          title: "Add Your Project",
          description: "Define scope, budget, location, and start date easily",
          icon: <CheckCircle2 className="h-6 w-6" />,
        },
        {
          title: "Get Estimates",
          description:
            "Our smart system calculates cost and timeline accurately",
          icon: <TrendingUp className="h-6 w-6" />,
        },
        {
          title: "Compare Quotes",
          description: "Review multiple offers from verified contractors",
          icon: <Users className="h-6 w-6" />,
        },
        {
          title: "Track Execution",
          description:
            "Monitor progress and budget with detailed weekly reports",
          icon: <Award className="h-6 w-6" />,
        },
      ];

  return (
    <Section
      id="about-how"
      className="bg-gradient-to-br from-slate-50 to-orange-50/30 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-6 py-3 rounded-full text-sm font-bold border-2 border-blue-300 shadow-lg mb-6">
            <Zap className="h-4 w-4" />
            {isAr ? "خطوات العمل" : "How It Works"}
          </span>

          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
            {isAr ? "رحلة مشروعك" : "Your Project Journey"}
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {isAr
              ? "أربع خطوات بسيطة من التخطيط إلى التسليم النهائي"
              : "Four simple steps from planning to final delivery"}
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-8 top-16 bottom-16 w-1 bg-gradient-to-b from-orange-500 via-amber-500 to-green-500 rounded-full hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} index={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function StepCard({ title, description, icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative flex items-start gap-6 md:gap-8"
    >
      {/* Step number */}
      <div className="relative z-10 flex-shrink-0">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ type: "spring" }}
          className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl"
        >
          {index}
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        whileHover={{ x: 10 }}
        className="flex-1 bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-orange-300 shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              {description}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl text-orange-600 flex-shrink-0">
            {icon}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
