"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Assignment, SubmissionStatus, AssignmentType } from "@/types/api";
import { LoadingSpinner, EmptyState, ApiError } from "@/app/components/ErrorBoundary";

const statusBadge: Record<SubmissionStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-slate-100", text: "text-slate-600", label: "Belum" },
  submitted: { bg: "bg-sky-50", text: "text-sky-600", label: "Dikumpulkan" },
  graded: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Dinilai" },
  late: { bg: "bg-amber-50", text: "text-amber-600", label: "Terlambat" },
};

const typeLabel: Record<AssignmentType, string> = {
  homework: "PR", project: "Proyek", exam: "Ujian", quiz: "Kuis",
};

export default function AssignmentsPage() {
  const { role } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isTeacher = role === "teacher";

  const fetchAssignments = async () => {
    try {
      const endpoint = isTeacher ? "/teacher/assignments" : "/student/assignments";
      const res = await api.get(endpoint);
      setAssignments(res.data?.data || []);
      setError("");
    } catch {
      setError("Gagal memuat tugas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role) fetchAssignments();
  }, [role]);

  const handleSubmit = async (assignmentId: number) => {
    const file = fileRef.current?.files?.[0];
    if (!file) return alert("Pilih file terlebih dahulu.");

    setSubmitting(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      await api.post(`/student/assignments/${assignmentId}/submit`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSelectedId(null);
      fetchAssignments();
    } catch {
      alert("Gagal mengumpulkan tugas.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Memuat tugas..." />;
  if (error) return <ApiError message={error} onRetry={fetchAssignments} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tugas</h1>
        <p className="text-sm text-slate-400 mt-1">
          {isTeacher ? "Kelola dan pantau tugas yang diberikan" : "Daftar tugas yang harus dikerjakan"}
        </p>
      </div>

      {assignments.length === 0 ? (
        <EmptyState icon="✏️" title="Belum ada tugas" description="Tugas akan muncul di sini." />
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => {
            const isOverdue = new Date(a.due_date) < new Date();
            const st = statusBadge[a.my_status || "pending"];
            return (
              <div key={a.id} className="rounded-3xl bg-white p-5 card-float transition hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="rounded-xl bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-600 uppercase">
                        {typeLabel[a.type]}
                      </span>
                      {a.subject && (
                        <span className="rounded-xl bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-600">
                          {a.subject.name}
                        </span>
                      )}
                      {!isTeacher && (
                        <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold ${st.bg} ${st.text}`}>
                          {st.label}
                        </span>
                      )}
                      {isTeacher && (
                        <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                          {a.submissions_count || 0} dikumpulkan
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900">{a.title}</h3>
                    {a.description && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{a.description}</p>}
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        Deadline: {new Date(a.due_date).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                      {a.classroom && <span>{a.classroom.name}</span>}
                      <span className={isOverdue ? "text-rose-500 font-semibold" : ""}>
                        {isOverdue ? "Melewati deadline" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-lg font-bold text-slate-900">{a.max_score}</span>
                    <span className="text-[10px] text-slate-400 uppercase">Poin</span>
                  </div>
                </div>

                {/* Submit Section (Student) */}
                {!isTeacher && a.my_status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {selectedId === a.id ? (
                      <div className="flex items-center gap-3">
                        <input ref={fileRef} type="file" className="text-sm flex-1" accept=".pdf,.doc,.docx,.zip,.rar,.pptx,.xlsx" />
                        <button
                          onClick={() => handleSubmit(a.id)}
                          disabled={submitting}
                          className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 disabled:opacity-50"
                        >
                          {submitting ? "..." : "Kirim"}
                        </button>
                        <button onClick={() => setSelectedId(null)} className="text-sm text-slate-400 hover:text-slate-600">
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedId(a.id)}
                        className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100"
                      >
                        Kumpulkan Tugas
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
