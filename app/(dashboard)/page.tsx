"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { DashboardStat } from "@/types/api";

export default function DashboardPage() {
  const { user, role } = useAuth();
  const isTeacher = role === "teacher";
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Selamat Pagi" : currentHour < 17 ? "Selamat Siang" : "Selamat Malam";

  const [todaySchedule, setTodaySchedule] = useState<
    { id: string; title: string; time: string; location: string; subject: string; color: string }[]
  >([]);
  const [recentMaterials, setRecentMaterials] = useState<
    { id: string; title: string; subject: string; date: string; type: string }[]
  >([]);
  const [stats, setStats] = useState<DashboardStat[]>([
    { label: "Kehadiran", value: "-", sub: "Memuat...", color: "text-emerald-600", bg: "bg-emerald-50", icon: "✓" },
    { label: "Total Materi", value: "-", sub: "Memuat...", color: "text-sky-600", bg: "bg-sky-50", icon: "📄" },
    { label: "Jadwal", value: "-", sub: "Memuat...", color: "text-violet-600", bg: "bg-violet-50", icon: "📅" },
    { label: "Info", value: "-", sub: "Memuat...", color: "text-amber-600", bg: "bg-amber-50", icon: "👥" },
  ]);

  useEffect(() => {
    if (!role) return;

    const fetchData = async () => {
      try {
        const [statsRes, schedRes, matRes] = await Promise.all([
          api.get(role === "teacher" ? "/teacher/stats" : "/student/stats").catch(() => ({ data: { data: {} } })),
          api.get(role === "teacher" ? "/teacher/schedules" : "/student/schedules").catch(() => ({ data: { data: [] } })),
          api.get(role === "teacher" ? "/teacher/materials" : "/student/materials").catch(() => ({ data: { data: [] } })),
        ]);

        // ── Stats from /stats endpoint (real data) ──
        const s = statsRes.data?.data || {};
        const att = s.attendance || {};
        const rateVal = att.rate_percent;
        const rateDisplay = rateVal !== null && rateVal !== undefined ? `${rateVal}%` : "-";

        if (isTeacher) {
          setStats([
            { label: "Kehadiran Kelas", value: rateDisplay, sub: att.period ? `Bulan ${att.period}` : "Belum ada data", color: "text-emerald-600", bg: "bg-emerald-50", icon: "✓" },
            { label: "Total Materi", value: s.total_materials ?? "-", sub: "Diunggah", color: "text-sky-600", bg: "bg-sky-50", icon: "📄" },
            { label: "Jadwal Mengajar", value: s.total_schedules ?? "-", sub: "Pertemuan aktif", color: "text-violet-600", bg: "bg-violet-50", icon: "📅" },
            { label: "Total Siswa", value: s.total_students ?? "-", sub: "Di semua kelas", color: "text-amber-600", bg: "bg-amber-50", icon: "👥" },
          ]);
        } else {
          setStats([
            { label: "Kehadiran", value: rateDisplay, sub: `Hadir ${att.present ?? 0} / ${att.total ?? 0} hari`, color: "text-emerald-600", bg: "bg-emerald-50", icon: "✓" },
            { label: "Total Materi", value: s.total_materials ?? "-", sub: "Tersedia", color: "text-sky-600", bg: "bg-sky-50", icon: "📄" },
            { label: "Jadwal", value: s.total_schedules ?? "-", sub: "Pelajaran", color: "text-violet-600", bg: "bg-violet-50", icon: "📅" },
            { label: "Tugas Pending", value: s.pending_assignments ?? "-", sub: "Belum dikumpulkan", color: "text-amber-600", bg: "bg-amber-50", icon: "✏️" },
          ]);
        }

        // ── Schedule list ──
        const schedules = schedRes.data?.data || [];
        setTodaySchedule(
          schedules.slice(0, 4).map((item: Record<string, unknown>) => ({
            id: item.id,
            title: isTeacher
              ? `Kelas ${(item.classroom as Record<string, unknown>)?.name}`
              : `Pelajaran ${(item.subject as Record<string, unknown>)?.name}`,
            time: `${String(item.start_time).substring(0, 5)} - ${String(item.end_time).substring(0, 5)}`,
            location: (item.room as Record<string, unknown>)?.name || "TBA",
            subject: String((item.subject as Record<string, unknown>)?.name ?? ""),
            color: "from-sky-500 to-cyan-400",
          }))
        );

        // ── Recent materials ──
        const materials = matRes.data?.data || [];
        setRecentMaterials(
          materials.slice(0, 3).map((item: Record<string, unknown>) => ({
            id: item.id,
            title: item.title,
            subject: ((item.schedule as Record<string, unknown>)?.subject as Record<string, unknown>)?.name || "Materi",
            date: "Baru",
            type: item.file_path ? "PDF" : "Link",
          }))
        );
      } catch (error) {
        console.error("Dashboard error", error);
      }
    };

    fetchData();
  }, [role, isTeacher]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <section className="rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 p-6 md:p-8 text-white card-float-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-sky-100 font-medium">{greeting} 👋</p>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">{user?.name || "Pengguna LMS"}</h1>
            <p className="mt-1 text-sm text-sky-100/80 capitalize">{role} • SMKN 1 Garut</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold text-white ring-1 ring-white/20 backdrop-blur-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl bg-white p-5 card-float transition-all hover:-translate-y-0.5">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${stat.bg} text-lg mb-3`}>{stat.icon}</div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-semibold">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-0.5 text-xs text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* Today's Schedule */}
      <section className="rounded-3xl bg-white p-6 card-float">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Jadwal Hari Ini</h2>
            <p className="text-sm text-slate-400">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <Link href="/schedule" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-slate-300">
            Lihat Semua
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {todaySchedule.length === 0 ? (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <p className="text-2xl mb-2">📅</p>
              <p className="text-sm font-semibold text-slate-500">Tidak ada jadwal hari ini</p>
              <p className="text-xs text-slate-400 mt-1">Nikmati waktu luang Anda!</p>
            </div>
          ) : (
            todaySchedule.map((item) => (
              <div key={item.id} className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-sky-100 hover:bg-sky-50/30 hover:-translate-y-0.5">
                <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${item.color} mb-3`} />
                <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.subject}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    {item.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {item.location}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent Materials */}
      <section className="rounded-3xl bg-white p-6 card-float">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Materi Terbaru</h2>
          <Link href="/materials" className="text-sm font-semibold text-sky-500 hover:text-sky-600 transition">Lihat Semua →</Link>
        </div>
        <div className="space-y-3">
          {recentMaterials.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <p className="text-2xl mb-2">📄</p>
              <p className="text-sm font-semibold text-slate-500">Belum ada materi terbaru</p>
              <p className="text-xs text-slate-400 mt-1">{isTeacher ? "Upload materi untuk kelas Anda" : "Materi baru akan muncul di sini"}</p>
            </div>
          ) : (
            recentMaterials.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition-all hover:border-sky-100 hover:bg-sky-50/30">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shrink-0 ${item.type === "PDF" ? "bg-rose-50 text-rose-500" : "bg-violet-50 text-violet-500"}`}>
                  {item.type === "PDF"
                    ? <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M9 15h6M9 11h6" /></svg>
                    : <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.subject}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{item.date}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
