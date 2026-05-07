"use client";

import { useState, useEffect, useMemo } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Schedule, Subject } from "@/types/api";
import { LoadingSpinner, EmptyState, ApiError } from "@/app/components/ErrorBoundary";

// Backend note: There is no GET /teacher/subjects or /student/subjects endpoint.
// Subjects are embedded inside schedule objects. We extract & deduplicate them here.
// This is intentional and consistent with the backend API design.

export default function SubjectsPage() {
  const { role } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubjects = async () => {
    try {
      const endpoint = role === "teacher" ? "/teacher/schedules" : "/student/schedules";
      const res = await api.get(endpoint);
      setSchedules(res.data?.data || []);
      setError("");
    } catch {
      setError("Gagal memuat mata pelajaran.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role) fetchSubjects();
  }, [role]);

  // Extract unique subjects with associated classrooms and teacher
  const subjects = useMemo(() => {
    const map = new Map<string, { subject: Subject; classrooms: string[]; teacher?: string; days: string[] }>();
    schedules.forEach((s) => {
      if (!s.subject) return;
      const key = s.subject.id;
      if (map.has(key)) {
        const existing = map.get(key)!;
        const classroomName = s.classroom?.name || "";
        if (classroomName && !existing.classrooms.includes(classroomName)) {
          existing.classrooms.push(classroomName);
        }
        if (s.day && !existing.days.includes(s.day)) {
          existing.days.push(s.day);
        }
      } else {
        map.set(key, {
          subject: s.subject,
          classrooms: s.classroom?.name ? [s.classroom.name] : [],
          teacher: s.teacher?.name,
          days: s.day ? [s.day] : [],
        });
      }
    });
    return Array.from(map.values());
  }, [schedules]);

  // Group by type: vocational vs general
  const vocational = subjects.filter((s) => s.subject.type === "vocational");
  const general = subjects.filter((s) => s.subject.type !== "vocational");

  if (isLoading) return <LoadingSpinner text="Memuat mata pelajaran..." />;
  if (error) return <ApiError message={error} onRetry={fetchSubjects} />;

  const gradients = [
    "from-sky-500 to-cyan-400",
    "from-violet-500 to-purple-400",
    "from-emerald-500 to-teal-400",
    "from-amber-500 to-orange-400",
    "from-rose-500 to-pink-400",
    "from-indigo-500 to-blue-400",
  ];

  const SubjectGrid = ({
    items,
    title,
    color,
  }: {
    items: typeof subjects;
    title: string;
    color: string;
  }) => (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <span className="rounded-xl bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Tidak ada mata pelajaran di kategori ini.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={item.subject.id}
              className="group rounded-3xl bg-white p-5 card-float transition-all hover:-translate-y-0.5"
            >
              <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${gradients[idx % gradients.length]} mb-3`} />
              <h3 className="font-bold text-slate-900 text-sm">{item.subject.name}</h3>
              {item.subject.code && (
                <p className="text-xs text-slate-400 mt-0.5 font-mono">{item.subject.code}</p>
              )}
              {item.teacher && (
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  {item.teacher}
                </p>
              )}
              {item.days.length > 0 && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {item.days.join(", ")}
                </p>
              )}
              {item.classrooms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.classrooms.map((c) => (
                    <span key={c} className="rounded-xl bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mata Pelajaran</h1>
        <p className="text-sm text-slate-400 mt-1">
          {subjects.length} mata pelajaran dari {schedules.length} jadwal
        </p>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon="📚"
          title="Belum ada mata pelajaran"
          description="Mata pelajaran akan muncul setelah jadwal diatur oleh admin."
        />
      ) : (
        <>
          <SubjectGrid items={vocational} title="Mata Pelajaran Kejuruan" color="from-sky-500 to-cyan-400" />
          <SubjectGrid items={general} title="Mata Pelajaran Umum" color="from-violet-500 to-purple-400" />
        </>
      )}
    </div>
  );
}
