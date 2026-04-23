"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const initialProfile = [
  { label: "Tempat Tanggal Lahir", value: "3 Februari 2026", sub: "Garut, Indonesia", icon: "📅" },
  { label: "Alamat", value: "Jl. Cimanuk No.309", sub: "Garut, Jawa Barat", icon: "📍" },
  { label: "Nomor Telepon", value: "+62 812-3456-7890", sub: "Mobile", icon: "📞" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileInfo, setProfileInfo] = useState(initialProfile);

  const handleProfileChange = (index: number, field: "value" | "sub", value: string) => {
    setProfileInfo((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <section className="rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-500 p-6 md:p-8 text-white card-float-lg">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-sky-100 font-medium uppercase tracking-wider">Profil {role || "Pengguna"}</p>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">{user?.name || "Memuat..."}</h1>
            <p className="mt-1 text-sm text-sky-100/80">
              {role === 'teacher' ? `NIP: ${user?.nip || '-'}` : `NISN: ${user?.nisn || '-'}`} • SMKN 1 Garut
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-sky-600 text-2xl font-bold shadow-xl shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-sky-100">Status</p>
            <p className="mt-1 text-sm font-bold text-white">Guru PPL</p>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-sky-100">Sekolah</p>
            <p className="mt-1 text-sm font-bold text-white">SMKN 1 Garut</p>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-3 text-center col-span-2 sm:col-span-1">
            <p className="text-[10px] uppercase tracking-wider text-sky-100">Kondisi</p>
            <p className="mt-1 text-sm font-bold text-emerald-300">Active</p>
          </div>
        </div>
      </section>

      {/* Personal Info */}
      <section className="rounded-3xl bg-white p-6 md:p-8 card-float">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Personal Info</p>
            <p className="mt-1 text-sm text-slate-400">Informasi dasar Anda.</p>
          </div>
          <button
            onClick={() => setIsEditingProfile((p) => !p)}
            className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-600 active:scale-[0.97]"
          >
            {isEditingProfile ? "Simpan" : "Edit"}
          </button>
        </div>
        <div className="space-y-3">
          {profileInfo.map((item, idx) => (
            <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg shadow-sm shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  {isEditingProfile ? (
                    <div className="mt-2 space-y-2">
                      <input
                        value={item.value}
                        onChange={(e) => handleProfileChange(idx, "value", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                      />
                      <input
                        value={item.sub}
                        onChange={(e) => handleProfileChange(idx, "sub", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600 mt-0.5">{item.value}</p>
                      <p className="text-xs text-slate-400">{item.sub}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Record */}
      <section className="rounded-3xl bg-white p-6 md:p-8 card-float">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Record</p>
        <p className="text-sm text-slate-400 mb-5">Rekam akademik terbaru.</p>
        <div className="space-y-3">
          {recordData.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
              </div>
              <p className="text-lg font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Settings */}
      <section className="rounded-3xl bg-white p-6 md:p-8 card-float">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">
          Pengaturan
        </p>
        <div className="space-y-2">
          <button
            onClick={() => alert("Notifikasi")}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            <span>Notifikasi</span><span>🔔</span>
          </button>
          <button
            onClick={() => alert("Password")}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            <span>Password</span><span>🔒</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            <span>Keluar</span><span>⏏️</span>
          </button>
        </div>
      </section>
    </div>
  );
}
