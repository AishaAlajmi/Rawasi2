import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import rawasiLogo from "./assets/photo_2025-08-13_21-03-51.jpg";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { OtpModal, ForgotModal } from "./components/Modals.jsx";
import FlowProgress from "./components/Progress.jsx"; // NEW
import Landing from "./pages/Landing.jsx";
import Project from "./pages/Project.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Compare from "./pages/Compare.jsx";
import Messages from "./pages/Messages.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import { loadLS, saveLS, uid } from "./lib/utils.js";
import { seedUsers } from "./lib/auth.js";

// ---- Guards ---------------------------------------------------------------
const RequireProject = ({ project, children }) =>
  project ? children : <Navigate to="/project" replace />;
const RequireCompare = ({ compare, children }) =>
  compare?.length ? children : <Navigate to="/recs" replace />;

export default function App() {
  // project flow
  const [project, setProject] = useState(null);
  const [compare, setCompare] = useState([]);

  // auth
  const [users, setUsers] = useState(() => loadLS("rawasi_users", seedUsers()));
  const [auth, setAuth] = useState(() => loadLS("rawasi_auth", null));
  const [otpModal, setOtpModal] = useState({ open: false, email: "" });
  const [forgotModal, setForgotModal] = useState({ open: false });

  useEffect(() => saveLS("rawasi_users", users), [users]);
  useEffect(() => saveLS("rawasi_auth", auth), [auth]);

  const navigate = useNavigate();
  const location = useLocation();

  const onCompareToggle = (id) =>
    setCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3)
    );

  // show progress only on flow routes (not on Landing or Dashboard)
  const showFlowProgress = ["/project", "/recs", "/compare", "/messages"].some(
    (p) => location.pathname.startsWith(p)
  );

  // ---- Auth handlers -------------------------------------------------------
  function handleRegister(payload) {
    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      return { ok: false, error: "Email already registered" };
    }
    const newUser = { id: uid(), ...payload, createdAt: Date.now() };
    setUsers((prev) => [...prev, newUser]);
    setOtpModal({ open: true, email: payload.email });
    return { ok: true };
  }
  function verifyOtp(code) {
    if (!/^[0-9]{6}$/.test(code)) return { ok: false, error: "Enter 6 digits" };
    setOtpModal({ open: false, email: "" });
    navigate("/login");
    return { ok: true };
  }
  function handleLogin({ email, password }) {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: "Invalid credentials" };
    setAuth({ id: user.id, name: user.name, role: user.role, email: user.email, phone: user.phone });
    navigate("/project");
    return { ok: true };
  }
  function logout() {
    setAuth(null);
    navigate("/project");
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Simple header (no stepper) */}
      <Header logoUrl={rawasiLogo} auth={auth} onLogout={logout} />

      <main className="mx-auto max-w-7xl px-4 pt-2">
        {/* PROGRESS BAR — only on flow routes; Recommendations covers /recs & /compare */}
        {showFlowProgress && <FlowProgress />}

        <Routes>
          {/* Landing first */}
          <Route path="/" element={<Landing />} />

          {/* Auth */}
          <Route path="/login" element={<Login onSubmit={handleLogin} onForgot={() => setForgotModal({ open: true })} />} />
          <Route path="/register" element={<Register onSubmit={handleRegister} />} />

          {/* Flow */}
          <Route
            path="/project"
            element={
              <Project
                logoUrl={rawasiLogo}
                onComplete={(p) => {
                  setProject(p);
                  navigate("/recs");
                }}
              />
            }
          />
          <Route
            path="/recs"
            element={
              <RequireProject project={project}>
                <Recommendations
                  project={project}
                  selectedCompare={compare}
                  onCompareToggle={onCompareToggle}
                  onProceed={() => compare.length && navigate("/compare")}
                />
              </RequireProject>
            }
          />
          <Route
            path="/compare"
            element={
              <RequireProject project={project}>
                <RequireCompare compare={compare}>
                  <Compare
                    selectedIds={compare}
                    project={project}
                    onProceed={() => navigate("/messages")}
                  />
                </RequireCompare>
              </RequireProject>
            }
          />
        <Route path="/messages" element={<Messages onProceed={() => navigate("/dashboard")} />} />


          {/* Dashboard (outside the progress bar) */}
          <Route
            path="/dashboard"
            element={<Dashboard project={project} onStartProject={() => navigate("/project")} />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <OtpModal
        open={otpModal.open}
        email={otpModal.email}
        onClose={() => setOtpModal({ open: false, email: "" })}
        onVerify={verifyOtp}
      />
      <ForgotModal open={forgotModal.open} onClose={() => setForgotModal({ open: false })} />

      <Footer logoUrl={rawasiLogo} />
    </div>
  );
}
