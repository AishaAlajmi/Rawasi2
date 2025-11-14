import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  Users, 
  TrendingUp,
  CheckCircle2,
  Star,
  Sparkles,
  Target,
  Zap,
  Shield
} from 'lucide-react';

export default function Home() {
  const stats = [
    { label: "Providers", value: "250+", icon: Building2 },
    { label: "Avg. rating", value: "4.6/5", icon: Star },
    { label: "Matched projects", value: "2,100+", icon: CheckCircle2 },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "Cost estimator",
      description: "Forecast budget & time"
    },
    {
      icon: TrendingUp,
      title: "ML ranking",
      description: "Best-fit providers"
    },
    {
      icon: Target,
      title: "Compare",
      description: "Side-by-side picks"
    },
    {
      icon: Zap,
      title: "Track",
      description: "Budget & milestones"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-orange-200/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                 src="/photo_2025-08-13_21-03-51.png" 
                alt="Rawasi" 
                className="h-10 w-10 rounded-xl shadow-md hover:scale-110 transition-transform duration-300"
              />
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  RAWASI
                </div>
                <div className="text-xs text-orange-600 font-medium -mt-0.5">
                  Match. Estimate. Build
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors">Home</a>
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors">Why Rawasi</a>
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors">How it works</a>
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors">Dashboard</a>
            </nav>

            <div className="flex items-center gap-3">
              <button className="text-sm font-medium text-slate-700 hover:text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all">
                EN / العربية
              </button>
              <Link 
                to="/login"
                className="text-sm font-medium text-orange-600 hover:text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y5NzMxNiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-40" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Smarter provider matching with ML
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Find the <span className="text-orange-600">right team</span>
                  <br />
                  for your build
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Add your project once, then move step-by-step from estimates to matched providers and collaboration.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register?type=owner"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Start your project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/provider/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-orange-200 text-orange-600 font-semibold text-lg hover:bg-orange-50 hover:scale-105 transition-all duration-300"
                >
                  Provider Portal
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <stat.icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/rawasi-logo.jpg" 
                  alt="Rawasi Platform" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -left-8 top-1/4 bg-white rounded-xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">AI Matched</div>
                    <div className="text-xs text-slate-600">3 providers found</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 bottom-1/4 bg-white rounded-xl shadow-xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Cost Estimated</div>
                    <div className="text-xs text-slate-600">SAR 125,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to build smarter
            </h2>
            <p className="text-xl text-slate-600">
              From cost estimation to provider matching, all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-orange-50/20"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-20" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to build with modern construction?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join 250+ providers and 2,100+ successful projects on Rawasi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-orange-600 font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/provider/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white text-white font-semibold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/rawasi-logo.jpg" 
                alt="Rawasi" 
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-sm text-slate-600">
                © 2024 <span className="font-semibold text-orange-600">RAWASI</span>. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-orange-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-orange-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-orange-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
