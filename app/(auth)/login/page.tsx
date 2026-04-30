"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import { useAuth, UserRole } from "@/contexts/AuthContext";

const roles = ["Siswa", "Guru"];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [activeRole, setActiveRole] = useState("Siswa");
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!idNumber || !password) {
      setError("ID dan password wajib diisi");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // CSRF implementation depending on Sanctum setup
      const csrfUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000') + '/sanctum/csrf-cookie';
      await api.get(csrfUrl).catch(() => {
        console.warn('CSRF cookie not required for token-based auth.');
      });

      const response = await api.post("/login", {
        login: idNumber,
        password: password,
      });

      if (response.data && response.data.token) {
        // Backend specifies role as "teacher" or "student" or "super_admin"
        login(response.data.token, response.data.role as UserRole, response.data.user);
        router.push("/");
      } else {
        setError("Login gagal: Token tidak ditemukan dalam respon.");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("ID atau password salah. Coba lagi.");
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan jaringan.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-[2rem] bg-white card-float">
          {/* Header */}
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/20 p-1.5">
                <Image
                  src="/logo-smkn1garut.png"
                  alt="SMKN 1 Garut"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-100 font-medium">
                  Selamat Datang
                </p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  LMS Melesat
                </h1>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-sky-100">
              Masuk untuk mengakses jadwal, materi, dan data kelas Anda.
            </p>

            {/* Demo credentials */}
            <div className="mt-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3 text-xs text-white/90">
              <p className="font-semibold text-white mb-1">Demo Login:</p>
              <p>Siswa: <span className="font-mono font-bold">siswa123</span> / <span className="font-mono font-bold">melesat123</span></p>
              <p>Guru: <span className="font-mono font-bold">guru123</span> / <span className="font-mono font-bold">melesat123</span></p>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-8 sm:px-8">
            {/* Role Tabs */}
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
                    activeRole === role
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* ID Input */}
              <div>
                <label
                  htmlFor="idNumber"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {activeRole === "Guru" ? "NIP / Email" : "NIS / NISN"}
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus-within:border-sky-400 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(14,165,233,0.1)]">
                  <svg
                    className="h-5 w-5 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="idNumber"
                    type="text"
                    autoComplete="username"
                    placeholder="Masukkan ID"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus-within:border-sky-400 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(14,165,233,0.1)]">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><path d="M1 1l22 22" /></svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600 font-medium">
                  {error}
                </div>
              )}

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-lg border-slate-300 text-sky-500 accent-sky-500"
                  />
                  Ingat saya
                </label>
                <a href="#" className="font-medium text-sky-500 hover:text-sky-600 transition">
                  Lupa password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-600 hover:shadow-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
                    Memproses...
                  </span>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Butuh bantuan?{" "}
              <a href="#" className="font-medium text-sky-500 hover:text-sky-600 transition">
                Hubungi Admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
