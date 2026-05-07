"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Schedule } from "@/types/api";
import { LoadingSpinner, EmptyState } from "@/app/components/ErrorBoundary";

const avatarColors = [
  "bg-sky-500", "bg-violet-500", "bg-amber-500", "bg-emerald-500",
  "bg-rose-500", "bg-indigo-500", "bg-cyan-500", "bg-pink-500",
];

type ClassroomData = {
  id: string;
  name: string;
  academic_year: string;
  teacher: { name: string } | null;
  students: { id: string; name: string; student_number?: string; gender?: string }[];
};

/** Extract unique classrooms from schedules array */
function extractClassrooms(schedules: Schedule[]): ClassroomData[] {
  const map = new Map<string, ClassroomData>();
  for (const s of schedules) {
    if (!s.classroom) continue;
    const id = s.classroom.id;
    if (!map.has(id)) {
      map.set(id, {
        id,
        name: s.classroom.name,
        academic_year: s.classroom.academic_year || "2025/2026",
        teacher: s.teacher || s.classroom.teacher || null,
        students: s.classroom.students || [],
      });
    } else {
      // Merge students if not yet populated
      const existing = map.get(id)!;
      if (existing.students.length === 0 && (s.classroom.students?.length ?? 0) > 0) {
        existing.students = s.classroom.students!;
      }
    }
  }
  return Array.from(map.values());
}

export default function ClassroomPage() {
  const { role } = useAuth();
  const [search, setSearch] = useState("");
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([]);
  const [activeClassroomId, setActiveClassroomId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!role) return;
    const fetchClassrooms = async () => {
      try {
        // Both teacher and student endpoints return schedules with embedded classroom data.
        // This is the correct approach given backend doesn't expose a dedicated /classrooms endpoint
        // for teacher/student roles (only super_admin has that).
        const ep = role === "teacher" ? "/teacher/schedules" : "/student/schedules";
        const res = await api.get(ep);
        const schedules: Schedule[] = res.data?.data || [];
        const list = extractClassrooms(schedules);
        setClassrooms(list);
        if (list.length > 0) setActiveClassroomId(list[0].id);
        setError("");
      } catch {
        setError("Gagal memuat data kelas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassrooms();
  }, [role]);

  if (isLoading) return <LoadingSpinner text="Memuat data kelas..." />;

  if (error || classrooms.length === 0) {
    return (
      <EmptyState
        icon="🏫"
        title={error || "Belum tergabung dalam kelas"}
        description="Hubungi admin untuk info lebih lanjut"
      />
    );
  }

  const activeClassroom = classrooms.find((c) => c.id === activeClassroomId) ?? classrooms[0];
  const students = activeClassroom.students || [];
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Detail Kelas</h1>
        <p className="text-sm text-slate-400 mt-1">Informasi kelas dan anggota</p>
      </div>

      {/* Classroom tabs — shown only when teacher has multiple classes */}
      {classrooms.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {classrooms.map((c) => (
            <button
              key={c.id}
              onClick={() => { setActiveClassroomId(c.id); setSearch(""); }}
              className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                activeClassroomId === c.id
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                  : "bg-white text-slate-500 hover:bg-slate-50 card-float"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Class Info Card */}
      <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 p-6 text-white card-float-lg">
        <p className="text-xs text-sky-100 font-medium uppercase tracking-wider">SMKN 1 GARUT</p>
        <h2 className="mt-2 text-xl font-bold">{activeClassroom.name}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-sky-100">
          <span className="flex items-center gap-1.5">📅 {activeClassroom.academic_year}</span>
          <span className="flex items-center gap-1.5">👥 {students.length} Siswa</span>
          <span className="flex items-center gap-1.5">👤 Wali: {activeClassroom.teacher?.name || "-"}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        <input
          type="text"
          placeholder="Cari siswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm placeholder:text-slate-400 transition-all focus:border-sky-400 card-float"
        />
      </div>

      {/* Members List */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3">
          Anggota Kelas ({filteredStudents.length})
        </h3>
        {students.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl card-float">
            <p className="text-2xl mb-2">👥</p>
            <p className="text-sm font-semibold text-slate-500">Data siswa belum tersedia</p>
            <p className="text-xs text-slate-400 mt-1">Data siswa akan muncul saat dimuat oleh backend</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <p className="text-center py-10 text-slate-400 text-sm">Tidak ada siswa ditemukan</p>
        ) : (
          <div className="space-y-2">
            {filteredStudents.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between rounded-2xl bg-white p-4 card-float transition hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shadow-sm ring-4 ring-white`}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-400 font-medium">NIS: {s.student_number || "-"}</p>
                  </div>
                </div>
                {s.gender && (
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${s.gender === "L" ? "bg-sky-50 text-sky-600" : "bg-pink-50 text-pink-600"}`}>
                    {s.gender === "L" ? "Laki-laki" : "Perempuan"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
