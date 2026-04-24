"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const colorMap: Record<string, string> = {
  "Web Development": "from-sky-500 to-cyan-400",
  Database: "from-violet-500 to-purple-400",
  Flutter: "from-blue-400 to-indigo-400",
  Matematika: "from-amber-400 to-orange-400",
  Filament: "from-slate-400 to-slate-500",
};

export default function SchedulePage() {
  const { role } = useAuth();
  const [activeDay, setActiveDay] = useState("Senin");
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const endpoint = role === "teacher" 
          ? "/teacher/schedules" 
          : "/student/schedules";
          
        const response = await api.get(endpoint);
        
        // Map the backend data to frontend format
        if (response.data && response.data.data) {
          const mapped = response.data.data.map((item: any) => ({
            id: item.id,
            day: item.day, // "Senin", "Selasa", dll
            title: role === "teacher" ? `Kelas ${item.classroom.name}` : `Pelajaran ${item.subject.name}`,
            time: `${item.start_time.substring(0,5)} - ${item.end_time.substring(0,5)}`,
            location: "TBA", // Assuming not explicitly provided in basic API
            subject: item.subject.name,
            teacher: role === "teacher" ? "Anda" : item.teacher.account.name,
          }));
          setScheduleData(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (role) fetchSchedules();
  }, [role]);

  const filtered = scheduleData.filter((s) => s.day === activeDay);

  if (isLoading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Memuat jadwal...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Jadwal KBM</h1>
        <p className="text-sm text-slate-400 mt-1">Jadwal kegiatan belajar mengajar minggu ini</p>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`shrink-0 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all ${
              activeDay === day
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                : "bg-white text-slate-500 hover:bg-slate-50 card-float"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center card-float">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold text-slate-600">Tidak ada jadwal</p>
            <p className="text-sm text-slate-400 mt-1">Hari {activeDay} kosong</p>
          </div>
        ) : (
          filtered.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white p-5 card-float transition-all hover:-translate-y-0.5"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Time badge */}
                <div className="shrink-0 rounded-2xl bg-slate-50 px-3 py-2 text-center border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 leading-tight">
                    {item.time.split(" - ")[0]}
                  </p>
                  <div className="my-1 h-px w-6 bg-slate-200 mx-auto" />
                  <p className="text-xs font-bold text-slate-400 leading-tight">
                    {item.time.split(" - ")[1]}
                  </p>
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`h-1.5 w-10 rounded-full bg-gradient-to-r ${colorMap[item.subject] || "from-slate-300 to-slate-400"} mb-2`} />
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-sm text-sky-600 font-medium mt-0.5">{item.subject}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      {item.teacher}
                    </span>
                  </div>
                </div>

                {/* Teacher Action */}
                {role === 'teacher' && (
                  <button 
                    onClick={() => {
                        // This should open the attendance modal
                        window.dispatchEvent(new CustomEvent('open-attendance-sheet', { detail: { scheduleId: item.id } }));
                    }}
                    className="shrink-0 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 active:scale-95"
                  >
                    Absen
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
