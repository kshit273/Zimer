import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLoginComp = ({ setAdminUser }) => {
  const [formData, setFormData] = useState({ id: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.password) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/admin/login", {
        id: Number(formData.id),
        password: formData.password,
      });
      const { token, admin } = res.data;
      localStorage.setItem("adminToken", token);
      if (setAdminUser) setAdminUser(admin);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* Minimal non-Tailwind styles for things Tailwind can't do */}
      <style>{`
        .font-bebas  { font-family: 'Bebas Neue', sans-serif; }
        .font-dm-mono { font-family: 'DM Mono', monospace; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at 30% 60%, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at 30% 60%, black 30%, transparent 80%);
        }

        /* Animated underline on focus */
        .field-line {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px; width: 0;
          background: #d72638;
          transition: width 0.3s ease;
        }
        input:focus ~ .field-line { width: 100%; }

        /* Hide number arrows */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-6px); }
          75%      { transform: translateX( 6px); }
        }
        .shake { animation: shake 0.35s ease; }

        @keyframes spin-loader { to { transform: rotate(360deg); } }
        .spin-loader { animation: spin-loader 0.7s linear infinite; }

        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
        .pulse-dot { animation: pulse-dot 2s infinite; }
      `}</style>

      <div className="font-dm-mono min-h-screen bg-[#0a0a0a] grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* ── Left decorative panel ── */}
        <div
          className={`
            relative overflow-hidden
            border-b border-[#1f1f1f] md:border-b-0 md:border-r
            flex flex-col justify-end
            p-8 md:p-12
            min-h-[200px] md:min-h-screen
            transition-all duration-700 ease-out
            ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}
          `}
        >
          {/* Dot-grid */}
          <div className="grid-bg absolute inset-0" />

          {/* Diagonal accent wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[rgba(200,241,53,0.04)]" />

          {/* Top-left badge */}
          <p className="absolute top-8 left-8 md:top-12 md:left-12 text-[0.6rem] tracking-[0.2em] text-[#555550] uppercase z-10">
            Zimer <span className="text-[#d72638]">// ADMIN</span>
          </p>

          {/* Top-right tick marks */}
          <div className="absolute top-8 right-8 md:top-12 md:right-12 flex flex-col gap-1.5 items-end z-10">
            <div className="h-px w-10 bg-[#1f1f1f]" />
            <div className="h-px w-6  bg-[#1f1f1f]" />
            <div className="h-px w-14 bg-[#1f1f1f]" />
          </div>

          {/* Large display heading */}
          <h2
            className="font-bebas text-[#e8e8e0] leading-[0.88] tracking-wide relative z-10"
            style={{ fontSize: "clamp(4rem, 9vw, 9rem)" }}
          >
            ADMIN<br />
            <span className="text-[#d72638]">PORTAL</span><br />
          </h2>

          <p className="mt-5 text-[0.65rem] tracking-[0.25em] text-[#555550] uppercase relative z-10">
            Secure access · Restricted zone
          </p>

          {/* Live status */}
          <div className="flex items-center gap-2 mt-8 relative z-10">
            <span className="pulse-dot block w-1.5 h-1.5 rounded-full bg-[#d72638]" />
            <span className="text-[0.6rem] tracking-[0.2em] text-[#555550] uppercase">
              System operational
            </span>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div
          className={`
            flex flex-col justify-center items-start
            px-8 py-12 md:px-16
            transition-all duration-700 delay-150 ease-out
            ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}
          `}
        >
          {/* Section header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[#d72638]" />
              <span className="text-[0.6rem] tracking-[0.25em] text-[#555550] uppercase">
                Authorised personnel only
              </span>
            </div>
            <h1
              className="font-bebas text-[#e8e8e0] tracking-wide"
              style={{ fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)" }}
            >
              SIGN IN
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-6">

            {/* Admin ID */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="al-id"
                className="text-[0.6rem] tracking-[0.22em] text-[#555550] uppercase"
              >
                Admin ID
              </label>
              <div className="relative">
                <input
                  id="al-id"
                  type="number"
                  name="id"
                  placeholder="e.g. 1042"
                  value={formData.id}
                  onChange={handleChange}
                  autoComplete="off"
                  className="
                    w-full bg-transparent
                    border-0 border-b border-[#1f1f1f]
                    pt-1 pb-3
                    text-[#e8e8e0] text-sm tracking-wide
                    placeholder-[#555550]
                    outline-none focus:border-transparent
                    font-dm-mono
                  "
                />
                <div className="field-line" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="al-pass"
                className="text-[0.6rem] tracking-[0.22em] text-[#555550] uppercase"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="al-pass"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="
                    w-full bg-transparent
                    border-0 border-b border-[#1f1f1f]
                    pt-1 pb-3
                    text-[#e8e8e0] text-sm tracking-wide
                    placeholder-[#555550]
                    outline-none focus:border-transparent
                    font-dm-mono
                  "
                />
                <div className="field-line" />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="shake bg-red-500/5 border border-red-500/25 rounded-sm px-3 py-2.5 text-[0.7rem] tracking-wide text-red-400">
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-1 w-full
                bg-[#d72638] hover:bg-[#d8ff4a]
                disabled:opacity-50 disabled:cursor-not-allowed
                text-[#0a0a0a] font-medium font-dm-mono
                text-[0.7rem] tracking-[0.25em] uppercase
                py-3.5 px-6 rounded-sm
                transition-colors duration-200
                flex items-center justify-center gap-2
              "
            >
              {loading && (
                <span className="spin-loader block w-3 h-3 rounded-full border-2 border-black/20 border-t-black" />
              )}
              {loading ? "Authenticating…" : "Access Dashboard"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-[0.6rem] tracking-[0.15em] text-[#555550] uppercase opacity-60">
            Zimer Platform · <span className="text-[#d72638]">Admin v1.0</span>
          </p>
        </div>

      </div>
    </>
  );
};

export default AdminLoginComp;