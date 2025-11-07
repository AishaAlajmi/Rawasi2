import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";
import rawasiLogo from "../assets/photo_2025-08-13_21-03-51.png";
import { useLang } from "../context/lang";
import { supabase } from "../lib/supabase";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { lang, setLang } = useLang();
  
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const L = lang === "ar"
    ? { 
        home: "الرئيسية", 
        why: "لماذا رواسي", 
        how: "كيف تعمل", 
        dash: "لوحة التحكم", 
        login: "تسجيل الدخول", 
        register: "إنشاء حساب",
        profile: "الملف الشخصي",
        settings: "الإعدادات",
        logout: "تسجيل الخروج"
      }
    : { 
        home: "Home",       
        why: "Why Rawasi",    
        how: "How it works", 
        dash: "Dashboard",        
        login: "Login",         
        register: "Create account",
        profile: "Profile",
        settings: "Settings",
        logout: "Logout"
      };

  // Check authentication state on mount and when it changes
  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      fetchProfile(user.id);
    }
  };

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-orange-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img src={rawasiLogo} alt="Rawasi" className="h-15 w-20 rounded" />
          <div className="leading-tight text-left">
            <div className="text-base font-semibold tracking-wide text-slate-900">RAWASI</div>
            <div className="text-xs text-orange-600 font-medium">Match. Estimate. Build</div>
          </div>
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link 
            className={`hover:text-orange-600 transition-colors ${
              pathname === "/" ? "text-orange-600 font-medium" : "text-slate-700"
            }`} 
            to="/"
          >
            {L.home}
          </Link>
          <a 
            className="hover:text-orange-600 text-slate-700 transition-colors" 
            href="#about-why"
          >
            {L.why}
          </a>
          <a 
            className="hover:text-orange-600 text-slate-700 transition-colors" 
            href="#about-how"
          >
            {L.how}
          </a>
          <Link 
            className={`hover:text-orange-600 transition-colors ${
              pathname.startsWith("/dashboard") ? "text-orange-600 font-medium" : "text-slate-700"
            }`} 
            to="/dashboard"
          >
            {L.dash}
          </Link>
        </nav>

        {/* Auth & Language */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="inline-flex rounded-xl border border-orange-200 bg-white p-1">
            <button 
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                lang === "en" ? "bg-orange-100 text-orange-700 font-medium" : "text-slate-700 hover:text-slate-900"
              }`} 
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button 
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                lang === "ar" ? "bg-orange-100 text-orange-700 font-medium" : "text-slate-700 hover:text-slate-900"
              }`} 
              onClick={() => setLang("ar")}
            >
              العربية
            </button>
          </div>

          {/* Conditional Auth Buttons */}
          {user ? (
            // Logged in - Show user menu
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2 hover:bg-orange-50 transition-all"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white text-sm font-semibold">
                  {(profile?.name || user.email)?.[0]?.toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-900">
                    {profile?.name || user.email?.split('@')[0]}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    {profile?.role || 'User'}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-orange-200 bg-white shadow-lg">
                  <div className="p-3 border-b border-slate-100">
                    <div className="text-sm font-medium text-slate-900">
                      {profile?.name || 'User'}
                    </div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/profile');
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      {L.profile}
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/settings');
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      {L.settings}
                    </button>
                  </div>

                  <div className="border-t border-slate-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {L.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Not logged in - Show login/register buttons
            <>
              <button 
                onClick={() => navigate("/login")} 
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium hover:from-orange-600 hover:to-amber-700 transition-all duration-150 shadow-sm hover:shadow-md"
              >
                {L.login}
              </button>

              <button 
                onClick={() => navigate("/register")} 
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-orange-300 text-orange-700 font-medium hover:bg-orange-50 hover:border-orange-400 transition-all duration-150"
              >
                {L.register}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}