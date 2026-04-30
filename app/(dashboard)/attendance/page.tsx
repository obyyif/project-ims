"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function AttendancePage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("Teori");
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(2026);
  const [isClient, setIsClient] = useState(false);
  const [attendances, setAttendances] = useState<{ id: string; status: string; date: string; schedule?: { subject?: { name?: string } } }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        if (role === "student") {
          const res = await api.get("/student/attendances");
          if (res.data && res.data.data) {
            setAttendances(res.data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch attendances", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (role) fetchAttendances();
  }, [role]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Logic to highlight certain dates based on fetched API data
  // Extract days from attendance dates
  const presentDates = attendances.filter(a => a.status === 'present').map(a => new Date(a.date).getDate());
  const absentDates = attendances.filter(a => a.status === 'absent').map(a => new Date(a.date).getDate());
  
  const presentCount = presentDates.length || 0;
  const lateCount = attendances.filter(a => a.status === 'late').length || 0;
  const absentCount = absentDates.length || 0;
  const excusedCount = attendances.filter(a => a.status === 'excused').length || 0;
  
  const summaryData = [
    { label: "TOTAL HARI", value: daysInMonth, color: "text-slate-800", bg: "bg-white", border: "border-slate-200" },
    { label: "HADIR", value: presentCount, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "TERLAMBAT", value: lateCount, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "ALPA", value: absentCount, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" },
  ];

  const activityLog = attendances.slice(0, 5).map((a) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      present: { label: "HADIR", color: "bg-emerald-500" },
      late: { label: "TERLAMBAT", color: "bg-amber-500" },
      absent: { label: "ALPA", color: "bg-rose-500" },
      excused: { label: "IZIN", color: "bg-sky-500" },
    };
    const st = statusMap[a.status] || { label: a.status.toUpperCase(), color: "bg-slate-500" };
    return {
      date: new Date(a.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}),
      subject: a.schedule?.subject?.name || "-",
      status: st.label,
      color: st.color,
    };
  });

  if (!isClient) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Riwayat Kehadiran</h1>
        <p className="text-sm text-slate-400 mt-1">Pantau kehadiran Anda secara berkala</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-sky-50 p-1 border border-sky-100">
        {["Teori", "Workshop"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "Teori" ? "Kelas Teori" : "Workshop (PKL)"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 card-float">
          {/* Month navigator */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <p className="font-bold text-slate-700">
              {monthNames[currentMonth]} {currentYear}
            </p>
            <button onClick={nextMonth} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-slate-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => (
              <div key={i} className="flex justify-center">
                {day && (
                  <button
                    onClick={() => setSelectedDate(day)}
                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all ${
                      selectedDate === day
                        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                        : absentDates.includes(day)
                        ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                        : presentDates.includes(day)
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-100" /> Hadir</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-rose-100" /> Alpa</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-sky-500" /> Dipilih</span>
          </div>
        </div>

        {/* Summary + Activity */}
        <div className="space-y-5">
          {/* Summary */}
          <div className="rounded-3xl bg-white p-6 card-float">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Ringkasan Bulanan
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {summaryData.map((item) => (
                <div key={item.label} className={`rounded-2xl ${item.bg} border ${item.border} p-4`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                  <p className={`mt-1 text-2xl font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-3xl bg-white p-6 card-float">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Aktivitas Terakhir
            </h3>
            <div className="space-y-3">
              {activityLog.map((act, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3">
                  <div className={`h-9 w-9 rounded-xl ${act.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    →
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">{act.date}</p>
                    <p className="text-[11px] text-slate-400">{act.subject}</p>
                  </div>
                  <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${
                    act.status === "HADIR" ? "bg-emerald-100 text-emerald-700" : 
                    act.status === "ALPA" ? "bg-rose-100 text-rose-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Policy */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-2">
              Kebijakan SMK
            </p>
            <p className="text-sm leading-relaxed text-white/90">
              Minimal kehadiran 90% untuk syarat kelulusan semester.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
