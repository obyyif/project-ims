"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Assignment, AssignmentSubmission, SubmissionStatus, AssignmentType } from "@/types/api";
import { LoadingSpinner, EmptyState, ApiError } from "@/app/components/ErrorBoundary";

// ── Constants ──────────────────────────────────────────────────────────────
const statusBadge: Record<SubmissionStatus, { bg: string; text: string; label: string }> = {
  pending:   { bg: "bg-slate-100",   text: "text-slate-600",   label: "Belum" },
  submitted: { bg: "bg-sky-50",      text: "text-sky-600",     label: "Dikumpulkan" },
  graded:    { bg: "bg-emerald-50",  text: "text-emerald-600", label: "Dinilai" },
  late:      { bg: "bg-amber-50",    text: "text-amber-600",   label: "Terlambat" },
};
const typeLabel: Record<AssignmentType, string> = {
  homework: "PR", project: "Proyek", exam: "Ujian", quiz: "Kuis",
};
const typeOptions: { value: AssignmentType; label: string }[] = [
  { value: "homework", label: "PR (Homework)" },
  { value: "project",  label: "Proyek" },
  { value: "exam",     label: "Ujian" },
  { value: "quiz",     label: "Kuis" },
];

// ── Types ──────────────────────────────────────────────────────────────────
type AssignmentForm = {
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  type: AssignmentType;
  classroom_id: string;
  subject_id: string;
};

const emptyForm = (): AssignmentForm => ({
  title: "", description: "", due_date: "", max_score: 100,
  type: "homework", classroom_id: "", subject_id: "",
});

// ── Inline icon helpers ────────────────────────────────────────────────────
const IconEdit = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// ── Grading Panel ──────────────────────────────────────────────────────────
function GradingPanel({ assignmentId, maxScore }: { assignmentId: number; maxScore: number }) {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<number | null>(null);
  const [scoreInput, setScoreInput] = useState<Record<number, string>>({});
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    api.get(`/teacher/assignments/${assignmentId}`)
      .then((r) => {
        const data = r.data?.data || r.data;
        setSubmissions(data?.submissions || []);
      })
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [assignmentId]);

  const handleGrade = async (submissionId: number) => {
    const score = Number(scoreInput[submissionId]);
    if (isNaN(score) || score < 0 || score > maxScore) {
      return alert(`Nilai harus antara 0–${maxScore}`);
    }
    setGrading(true);
    try {
      await api.post(`/teacher/assignments/submissions/${submissionId}/grade`, { score });
      setSubmissions((prev) =>
        prev.map((s) => s.id === submissionId ? { ...s, score, status: "graded" } : s)
      );
      setGradingId(null);
    } catch {
      alert("Gagal memberi nilai.");
    } finally {
      setGrading(false);
    }
  };

  if (loading) return <p className="text-xs text-slate-400 py-3 animate-pulse">Memuat pengumpulan...</p>;
  if (submissions.length === 0) return (
    <p className="text-xs text-slate-400 italic py-3">Belum ada siswa yang mengumpulkan.</p>
  );

  return (
    <div className="space-y-2">
      {submissions.map((s) => (
        <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {s.student?.name || `Siswa #${s.student_id}`}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {s.submitted_at
                ? `Dikumpulkan: ${new Date(s.submitted_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`
                : "Belum dikumpulkan"}
            </p>
          </div>

          {/* Status badge */}
          {s.status === "graded" ? (
            <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
              ✓ {s.score}/{maxScore}
            </span>
          ) : (
            <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold ${statusBadge[s.status]?.bg} ${statusBadge[s.status]?.text}`}>
              {statusBadge[s.status]?.label}
            </span>
          )}

          {/* Grade action */}
          {s.status === "submitted" || s.status === "late" || s.status === "graded" ? (
            gradingId === s.id ? (
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="number"
                  min={0}
                  max={maxScore}
                  placeholder={`0–${maxScore}`}
                  value={scoreInput[s.id] ?? (s.score ?? "")}
                  onChange={(e) => setScoreInput((p) => ({ ...p, [s.id]: e.target.value }))}
                  className="w-20 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm text-center focus:border-sky-400 focus:outline-none"
                />
                <button
                  onClick={() => handleGrade(s.id)}
                  disabled={grading}
                  className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition disabled:opacity-50"
                >
                  {grading ? "..." : "Simpan"}
                </button>
                <button onClick={() => setGradingId(null)} className="text-xs text-slate-400 hover:text-slate-600">Batal</button>
              </div>
            ) : (
              <button
                onClick={() => { setGradingId(s.id); setScoreInput((p) => ({ ...p, [s.id]: String(s.score ?? "") })); }}
                className="shrink-0 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600 hover:bg-violet-100 transition"
              >
                {s.status === "graded" ? "Edit Nilai" : "Beri Nilai"}
              </button>
            )
          ) : null}

          {/* Download link */}
          {s.file_path && (
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/teacher/assignments/submissions/${s.id}/download`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-xl bg-sky-50 px-2.5 py-1.5 text-xs font-bold text-sky-600 hover:bg-sky-100 transition"
              title="Download file tugas"
            >
              📥
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Types for schedule-derived options ────────────────────────────────────
// NOTE: classroom_id is UUID (string) — classrooms table uses foreignUuid
//       subject_id is integer — subjects table uses foreignId (auto-increment)
type ClassroomOption = { id: string; name: string };       // UUID string
type SubjectOption   = { id: number; name: string; classroomIds: string[] }; // int id, UUID refs

// ── Assignment Form Modal ──────────────────────────────────────────────────
function AssignmentFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: Assignment | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<AssignmentForm>(
    initial
      ? {
          title: initial.title,
          description: initial.description || "",
          due_date: initial.due_date?.slice(0, 16) || "",
          max_score: initial.max_score,
          type: initial.type,
          classroom_id: String(initial.classroom_id || ""),
          subject_id: String(initial.subject_id || ""),
        }
      : emptyForm()
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Load classrooms + subjects from teacher's schedules
  const [classrooms, setClassrooms] = useState<ClassroomOption[]>([]);
  const [allSubjects, setAllSubjects] = useState<SubjectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(!isEdit);

  useEffect(() => {
    if (isEdit) return; // edit mode — classroom/subject already fixed
    api.get("/teacher/schedules")
      .then((res) => {
        const schedules: Record<string, unknown>[] = res.data?.data || [];

        console.log("[AssignmentModal] Raw schedules from API:", schedules);

        // classroom.id = UUID (string), subject.id = integer
        const classMap = new Map<string, string>(); // uuid → name
        const subjMap  = new Map<number, SubjectOption>(); // int id → option

        schedules.forEach((s) => {
          const cls  = s.classroom as { id: string | number; name: string } | undefined;
          const subj = s.subject   as { id: string | number; name: string } | undefined;

          if (cls) {
            const clsId = String(cls.id); // always store as string (UUID)
            classMap.set(clsId, cls.name);

            if (subj) {
              const subjId = Number(subj.id); // always store as integer
              if (!subjMap.has(subjId)) {
                subjMap.set(subjId, { id: subjId, name: subj.name, classroomIds: [] });
              }
              const entry = subjMap.get(subjId)!;
              if (!entry.classroomIds.includes(clsId)) {
                entry.classroomIds.push(clsId); // push UUID string
              }
            }
          }
        });

        const classroomList = Array.from(classMap.entries()).map(([id, name]) => ({ id, name }));
        const subjectList   = Array.from(subjMap.values());

        console.log("[AssignmentModal] Parsed classrooms:", classroomList);
        console.log("[AssignmentModal] Parsed subjects (with classroomIds):", subjectList);

        setClassrooms(classroomList);
        setAllSubjects(subjectList);
      })
      .catch((err) => {
        console.error("[AssignmentModal] Failed to fetch schedules:", err);
        setErr("Gagal memuat daftar kelas & mata pelajaran.");
      })
      .finally(() => setLoadingOptions(false));
  }, [isEdit]);

  // Filter subjects to those linked to the selected classroom UUID
  // form.classroom_id is already a UUID string
  const filteredSubjects = form.classroom_id
    ? allSubjects.filter((s) => {
        const match = s.classroomIds.includes(form.classroom_id);
        // Debug: log what we're filtering against
        console.log(
          `[AssignmentModal] Subject "${s.name}" classroomIds:`, s.classroomIds,
          `| selected classroom_id: "${form.classroom_id}" | match: ${match}`
        );
        return match;
      })
    : allSubjects;

  // When classroom changes, reset subject_id if no longer valid
  // All comparisons use string for classroom UUID
  const handleClassroomChange = (classroomId: string) => {
    const subjectsForClass = allSubjects.filter((s) => s.classroomIds.includes(classroomId));
    const currentSubjStillValid = subjectsForClass.some((s) => String(s.id) === form.subject_id);

    console.log("[AssignmentModal] Classroom changed to:", classroomId);
    console.log("[AssignmentModal] Subjects for this class:", subjectsForClass);

    setForm((prev) => ({
      ...prev,
      classroom_id: classroomId,
      subject_id: currentSubjStillValid
        ? prev.subject_id
        : subjectsForClass[0] ? String(subjectsForClass[0].id) : "",
    }));
  };

  const handleSave = async () => {
    if (!form.title) { setErr("Judul wajib diisi."); return; }
    if (!form.due_date) { setErr("Deadline wajib diisi."); return; }
    if (!isEdit && !form.classroom_id) { setErr("Pilih kelas terlebih dahulu."); return; }
    if (!isEdit && !form.subject_id) { setErr("Pilih mata pelajaran terlebih dahulu."); return; }

    setSaving(true); setErr("");
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        due_date: form.due_date,
        max_score: form.max_score,
        type: form.type,
        // classroom_id = UUID string, subject_id = integer (matches DB schema)
        ...(!isEdit && {
          classroom_id: form.classroom_id,      // keep as UUID string
          subject_id: Number(form.subject_id),  // cast to integer
        }),
      };

      console.log("[AssignmentModal] Submitting payload:", payload);

      if (isEdit) {
        await api.put(`/teacher/assignments/${initial!.id}`, payload);
      } else {
        await api.post("/teacher/assignments", payload);
      }
      onSaved();
    } catch (e: unknown) {
      const responseData = (e as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      // Show first validation error if available
      const firstError = responseData?.errors
        ? Object.values(responseData.errors)[0]?.[0]
        : null;
      setErr(firstError || responseData?.message || "Gagal menyimpan tugas.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[81] flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 my-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">{isEdit ? "Edit Tugas" : "Buat Tugas Baru"}</h2>
            <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {err && <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-600 font-medium">{err}</div>}

          {loadingOptions ? (
            <div className="flex items-center gap-2 py-4 text-sm text-slate-400">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
              Memuat daftar kelas...
            </div>
          ) : (
            <div className="grid gap-3">
              {/* Judul */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-sky-400 focus:bg-white focus:outline-none transition"
                  placeholder="Judul tugas..." />
              </div>

              {/* Kelas & Mata Pelajaran — hanya saat create */}
              {!isEdit && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Kelas *
                    </label>
                    {classrooms.length === 0 ? (
                      <p className="text-xs text-rose-500 italic mt-1">Tidak ada kelas tersedia. Pastikan jadwal sudah diatur.</p>
                    ) : (
                      <select
                        value={form.classroom_id}
                        onChange={(e) => handleClassroomChange(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-sky-400 focus:outline-none transition"
                      >
                        <option value="">— Pilih Kelas —</option>
                        {classrooms.map((c) => (
                          <option key={c.id} value={String(c.id)}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Mata Pelajaran *
                    </label>
                    <select
                      value={form.subject_id}
                      onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                      disabled={!form.classroom_id}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-sky-400 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">— Pilih Mapel —</option>
                      {filteredSubjects.map((s) => (
                        <option key={s.id} value={String(s.id)}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Edit mode — show locked class/subject info */}
              {isEdit && initial?.classroom && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Kelas</label>
                    <div className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-500 font-medium">
                      {initial.classroom.name}
                    </div>
                  </div>
                  {initial.subject && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Mata Pelajaran</label>
                      <div className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-500 font-medium">
                        {initial.subject.name}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-sky-400 focus:bg-white focus:outline-none transition resize-none"
                  placeholder="Instruksi tugas..." />
              </div>

              {/* Tipe & Nilai */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipe</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AssignmentType })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-sky-400 focus:outline-none transition">
                    {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nilai Maks</label>
                  <input type="number" min={1} max={1000} value={form.max_score}
                    onChange={(e) => setForm({ ...form, max_score: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-sky-400 focus:outline-none transition" />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deadline *</label>
                <input type="datetime-local" value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none transition" />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loadingOptions}
              className="flex-1 rounded-2xl bg-sky-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Tugas"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AssignmentsPage() {
  const { role } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);   // student: submit panel
  const [expandedId, setExpandedId] = useState<number | null>(null);   // teacher: grading panel
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Assignment | null>(null);
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

  useEffect(() => { if (role) fetchAssignments(); }, [role]);

  // Student: submit
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

  // Teacher: delete
  const handleDelete = async (id: number) => {
    if (!confirm("Hapus tugas ini? Semua pengumpulan ikut terhapus.")) return;
    try {
      await api.delete(`/teacher/assignments/${id}`);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Gagal menghapus tugas.");
    }
  };

  if (isLoading) return <LoadingSpinner text="Memuat tugas..." />;
  if (error) return <ApiError message={error} onRetry={fetchAssignments} />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tugas</h1>
            <p className="text-sm text-slate-400 mt-1">
              {isTeacher ? "Kelola dan nilai tugas yang diberikan" : "Daftar tugas yang harus dikerjakan"}
            </p>
          </div>
          {isTeacher && (
            <button
              onClick={() => { setEditTarget(null); setShowForm(true); }}
              className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 active:scale-[0.98] transition"
            >
              + Buat Tugas
            </button>
          )}
        </div>

        {assignments.length === 0 ? (
          <EmptyState icon="✏️" title="Belum ada tugas" description="Tugas akan muncul di sini." />
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => {
              const isOverdue = new Date(a.due_date) < new Date();
              const st = statusBadge[a.my_status || "pending"];
              const isExpanded = expandedId === a.id;
              return (
                <div key={a.id} className="rounded-3xl bg-white card-float overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="rounded-xl bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-600 uppercase">{typeLabel[a.type]}</span>
                          {a.subject && <span className="rounded-xl bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-600">{a.subject.name}</span>}
                          {!isTeacher && <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold ${st.bg} ${st.text}`}>{st.label}</span>}
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
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                            Deadline: {new Date(a.due_date).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {a.classroom && <span>{a.classroom.name}</span>}
                          {isOverdue && <span className="text-rose-500 font-semibold">Melewati deadline</span>}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-lg font-bold text-slate-900">{a.max_score}</span>
                        <span className="text-[10px] text-slate-400 uppercase">Poin</span>

                        {/* Teacher actions */}
                        {isTeacher && (
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              onClick={() => { setEditTarget(a); setShowForm(true); }}
                              className="flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                              title="Edit tugas"
                            >
                              <IconEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="flex items-center gap-1 rounded-xl bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-100 transition"
                              title="Hapus tugas"
                            >
                              <IconTrash />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Teacher: toggle grading panel */}
                    {isTeacher && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : a.id)}
                        className="mt-4 flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                      >
                        <span>Lihat Pengumpulan & Nilai</span>
                        <IconChevron open={isExpanded} />
                      </button>
                    )}

                    {/* Student: submit */}
                    {!isTeacher && a.my_status === "pending" && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        {selectedId === a.id ? (
                          <div className="flex items-center gap-3">
                            <input ref={fileRef} type="file" className="text-sm flex-1" accept=".pdf,.doc,.docx,.zip,.rar,.pptx,.xlsx" />
                            <button onClick={() => handleSubmit(a.id)} disabled={submitting}
                              className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 disabled:opacity-50">
                              {submitting ? "..." : "Kirim"}
                            </button>
                            <button onClick={() => setSelectedId(null)} className="text-sm text-slate-400 hover:text-slate-600">Batal</button>
                          </div>
                        ) : (
                          <button onClick={() => setSelectedId(a.id)}
                            className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100">
                            Kumpulkan Tugas
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Teacher: grading panel (collapsible) */}
                  {isTeacher && isExpanded && (
                    <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Daftar Pengumpulan</h4>
                      <GradingPanel assignmentId={a.id} maxScore={a.max_score} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Assignment Form Modal */}
      {showForm && (
        <AssignmentFormModal
          initial={editTarget}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSaved={() => { setShowForm(false); setEditTarget(null); fetchAssignments(); }}
        />
      )}
    </>
  );
}
