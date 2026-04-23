"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const roles = ["Siswa", "Guru"];

export default function LoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState("Siswa");
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validCredentials = {
    Siswa: { id: "siswa123", password: "melesat123" },
    Guru: { id: "guru123", password: "melesat123" },
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!idNumber || !password) {
      setError("ID dan password diperlukan");
      setSuccess("");
      return;
    }

    const credential = validCredentials[activeRole as keyof typeof validCredentials];
    if (idNumber === credential.id && password === credential.password) {
      setError("");
      setSuccess(`Login berhasil sebagai ${activeRole}!`);
      if (activeRole === "Guru") {
        router.push("/dashboard");
      }
      return;
    }

    setSuccess("");
    setError("ID atau password salah");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at top left, rgba(14,165,233,0.16), transparent 15%), radial-gradient(circle at bottom right, rgba(59,130,246,0.18), transparent 20%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-lg sm:max-w-xl">
        <div className="overflow-hidden rounded-4xl bg-white shadow-[0_32px_80px_rgba(15,23,42,0.12)]">
          <div className="bg-sky-600 px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white ring-1 ring-white/20">
                <span className="text-xl font-semibold">LMS</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-sky-200">Selamat Datang</p>
                <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Akses LMS Sekarang</h1>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-sky-100 sm:text-base">Masuk sebagai siswa atau guru untuk melihat jadwal, materi, dan data kelas Anda.</p>
            <div className="mt-5 rounded-3xl border border-sky-100 bg-sky-50 p-4 text-sm text-slate-900 sm:text-base">
              <p className="font-medium text-slate-900">Gunakan kredensial demo:</p>
              <p>
                Siswa: ID <span className="font-semibold">siswa123</span> / Password <span className="font-semibold">melesat123</span>
              </p>
              <p>
                Guru: ID <span className="font-semibold">guru123</span> / Password <span className="font-semibold">melesat123</span>
              </p>
            </div>
          </div>
          <div className="bg-white px-6 py-8 text-slate-950 sm:px-8 sm:py-10">
            <div className="mb-6 grid grid-cols-2 gap-3 rounded-3xl bg-sky-50 p-1">
              {roles.map((role) => {
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className={`rounded-3xl py-3 text-sm font-medium transition ${isActive ? "bg-sky-600 text-white shadow-sm shadow-sky-200/50" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="idNumber" className="mb-3 block text-sm font-medium text-slate-700">
                  Nomor ID
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
              {success && <p className="text-sm text-emerald-500">{success}</p>}

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
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Butuh bantuan?{" "}
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
