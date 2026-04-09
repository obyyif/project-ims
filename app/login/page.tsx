"use client";

import { FormEvent, useState } from "react";

const roles = ["Siswa", "Guru"];

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState("Siswa");
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!idNumber || !password) {
      setError("ID dan password diperlukan");
      return;
    }

    setError("");
    console.log("Login attempt:", { role: activeRole, idNumber, password, rememberMe });
    // Tambahkan logika autentikasi dan redirect di sini
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_32px_80px_rgba(15,23,42,0.15)]">
          <div className="relative h-56 bg-slate-200">
            <img src="https://images.unsplash.com/photo-1549490398-8c3f7b6fa20e?auto=format&fit=crop&w=1200&q=80" alt="School building" className="h-full w-full object-cover" />
          </div>

          <div className="px-8 py-7">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Login</p>
              <h1 className="mt-4 text-2xl font-semibold text-slate-900">Welcome to SMKN 1 GARUT</h1>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 rounded-3xl bg-slate-100 p-1">
              {roles.map((role) => {
                const isActive = activeRole === role;
                return (
                  <button key={role} type="button" onClick={() => setActiveRole(role)} className={`rounded-3xl py-3 text-sm font-medium transition ${isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
                    {role}
                  </button>
                );
              })}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="idNumber" className="mb-3 block text-sm font-medium text-slate-700">
                  ID Number
                </label>
                <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm shadow-slate-200/50">
                  <span className="text-slate-400">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 20h16M6 4h12v4H6V4Zm0 6h12v10H6V10Z" />
                    </svg>
                  </span>
                  <input
                    id="idNumber"
                    type="text"
                    autoComplete="username"
                    placeholder="Masukan ID"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-3 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm shadow-slate-200/50">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-slate-400 transition hover:text-slate-600" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17.94 17.94A10.6 10.6 0 0 1 12 19.5c-5.52 0-10-4.48-10-10 0-1.7.42-3.31 1.16-4.73" />
                        <path d="M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex items-center justify-between text-sm text-slate-600">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                  Ingat Saya
                </label>
                <a href="#" className="font-medium text-sky-600 hover:text-sky-700">
                  lupa password?
                </a>
              </div>

              <button type="submit" className="w-full rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700">
                Login to Dashboard
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Butuh Bantuan?{" "}
              <a href="#" className="font-medium text-sky-600 hover:text-sky-700">
                Hubungi Admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
