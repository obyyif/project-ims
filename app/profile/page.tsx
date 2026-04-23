"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialProfileInfo = [
  { label: "Date of Birth", value: "3 Feb 2026", sub: "Garut, Indonesia", icon: "📅" },
  { label: "Address", value: "Jl. Cimanuk No 309", sub: "Garut", icon: "📍" },
  { label: "Phone Number", value: "+62 812-3456-7890", sub: "Mobile", icon: "📞" },
];

const initialRecordInfo = [
  { id: "ipk", title: "Current IPK/GPA", value: "3.85 / 4.0", label: "Semester 2", icon: "🎓" },
  { id: "attendance", title: "Attendance", value: "98.2%", label: "This Academic Year", icon: "✅" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState(initialProfileInfo);
  const [recordInfo, setRecordInfo] = useState(initialRecordInfo);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingRecord, setIsEditingRecord] = useState(false);

  const handleProfileChange = (index: number, field: "value" | "sub", value: string) => {
    setProfileInfo((current) => current.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const handleRecordChange = (id: string, field: "title" | "value" | "label", value: string) => {
    setRecordInfo((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-sky-50 via-slate-100 to-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-xl space-y-6">
        <section className="rounded-4xl bg-linear-to-r from-sky-600 to-cyan-600 px-6 py-6 text-white shadow-[0_25px_70px_rgba(14,165,233,0.18)] sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-sky-100">Profil Guru</p>
              <h1 className="mt-4 text-3xl font-semibold text-white">USER</h1>
              <p className="mt-2 text-sm text-sky-100">ID: 222401023 • Software Engineering</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-sky-700 shadow-xl shadow-sky-200/40">
              <span className="text-xl font-semibold">U</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="rounded-3xl bg-sky-50 px-4 py-4 text-slate-900 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Level</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">Guru</p>
            </div>
            <div className="rounded-3xl bg-sky-50 px-4 py-4 text-slate-900 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">School</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">SMKN 1 GARUT</p>
            </div>
            <div className="rounded-3xl bg-sky-50 px-4 py-4 text-slate-900 shadow-sm sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-emerald-600">Active</p>
            </div>
          </div>
        </section>

        <section className="rounded-4xl bg-white/95 px-6 py-6 shadow-[0_25px_70px_rgba(14,165,233,0.08)] sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-500">Personal Info</p>
              <p className="mt-2 text-sm text-slate-500">Informasi dasar guru.</p>
            </div>
            <button type="button" onClick={() => setIsEditingProfile((current) => !current)} className="rounded-3xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
              {isEditingProfile ? "Simpan" : "Edit"}
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {profileInfo.map((item, index) => (
              <div key={item.label} className="rounded-3xl border border-sky-100 bg-sky-50 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-lg shadow-sm">{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    {isEditingProfile ? (
                      <div className="mt-2 space-y-2">
                        <input
                          value={item.value}
                          onChange={(event) => handleProfileChange(index, "value", event.target.value)}
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                        />
                        <input
                          value={item.sub}
                          onChange={(event) => handleProfileChange(index, "sub", event.target.value)}
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none focus:border-sky-500"
                        />
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">{item.sub}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-4xl bg-white/95 px-6 py-6 shadow-[0_25px_70px_rgba(14,165,233,0.08)] sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-500">Record</p>
              <p className="mt-2 text-sm text-slate-500">Rekam akademik terbaru.</p>
            </div>
            <button type="button" onClick={() => setIsEditingRecord((current) => !current)} className="rounded-3xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
              {isEditingRecord ? "Simpan" : "Edit"}
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {recordInfo.map((item) => (
              <div key={item.id} className="rounded-3xl border border-sky-100 bg-sky-50 p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-xl shadow-sm">{item.icon}</div>
                    <div>
                      {isEditingRecord ? (
                        <div className="space-y-2">
                          <input
                            value={item.title}
                            onChange={(event) => handleRecordChange(item.id, "title", event.target.value)}
                            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                          />
                          <input
                            value={item.label}
                            onChange={(event) => handleRecordChange(item.id, "label", event.target.value)}
                            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none focus:border-sky-500"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-slate-950">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-4xl bg-white px-6 py-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:px-8 sm:py-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Settings</p>
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Actions</span>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => router.push("/profile/notifications")}
              className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100"
            >
              <span>Notifications</span>
              <span>🔔</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/profile/security")}
              className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100"
            >
              <span>Security & Password</span>
              <span>🔒</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="flex w-full items-center justify-between rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
            >
              <span>Log Out</span>
              <span>⏏️</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
