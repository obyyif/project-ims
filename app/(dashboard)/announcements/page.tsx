"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Announcement, AnnouncementPriority } from "@/types/api";
import { LoadingSpinner, EmptyState, ApiError } from "@/app/components/ErrorBoundary";

const priorityStyles: Record<AnnouncementPriority, { bg: string; text: string; label: string }> = {
  normal: { bg: "bg-slate-100", text: "text-slate-600", label: "Info" },
  important: { bg: "bg-amber-50", text: "text-amber-600", label: "Penting" },
  urgent: { bg: "bg-rose-50", text: "text-rose-600", label: "Urgent" },
};

export default function AnnouncementsPage() {
  const { role } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: "", body: "", priority: "normal" as AnnouncementPriority, classroom_id: "" });
  const [submitting, setSubmitting] = useState(false);

  const isTeacher = role === "teacher";

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const endpoint = isTeacher ? "/teacher/announcements" : "/student/announcements";
      const res = await api.get(endpoint);
      setAnnouncements(res.data?.data || []);
      setError("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Gagal memuat pengumuman.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role) fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      if (editTarget) {
        // PATCH existing
        await api.patch(`/teacher/announcements/${editTarget.id}`, {
          ...form,
          classroom_id: form.classroom_id || null,
        });
      } else {
        // POST new
        await api.post("/teacher/announcements", {
          ...form,
          classroom_id: form.classroom_id || null,
        });
      }
      setShowForm(false);
      setEditTarget(null);
      setForm({ title: "", body: "", priority: "normal", classroom_id: "" });
      fetchAnnouncements();
    } catch {
      alert(editTarget ? "Gagal memperbarui pengumuman." : "Gagal membuat pengumuman.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (a: Announcement) => {
    setEditTarget(a);
    setForm({ title: a.title, body: a.body, priority: a.priority, classroom_id: a.classroom_id ? String(a.classroom_id) : "" });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pengumuman ini?")) return;
    try {
      await api.delete(`/teacher/announcements/${id}`);
      fetchAnnouncements();
    } catch {
      alert("Gagal menghapus.");
    }
  };

  if (isLoading) return <LoadingSpinner text="Memuat pengumuman..." />;
  if (error) return <ApiError message={error} onRetry={fetchAnnouncements} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengumuman</h1>
          <p className="text-sm text-slate-400 mt-1">
            {isTeacher ? "Kelola pengumuman untuk siswa" : "Pengumuman dari guru dan sekolah"}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditTarget(null);
                setForm({ title: "", body: "", priority: "normal", classroom_id: "" });
              } else {
                setShowForm(true);
              }
            }}
            className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98]"
          >
            {showForm ? "Batal" : "+ Buat Pengumuman"}
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="rounded-3xl bg-white p-6 card-float space-y-4">
          <h3 className="text-sm font-bold text-slate-700">
            {editTarget ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
          </h3>
          <input
            placeholder="Judul pengumuman"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-sky-400 focus:bg-white"
          />
          <textarea
            placeholder="Isi pengumuman..."
            rows={4}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-sky-400 focus:bg-white resize-none"
          />
          <div className="flex gap-3">
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as AnnouncementPriority })}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
            >
              <option value="normal">Normal</option>
              <option value="important">Penting</option>
              <option value="urgent">Urgent</option>
            </select>
            <button
              onClick={handleCreate}
              disabled={!form.title || !form.body || submitting}
              className="rounded-2xl bg-sky-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Kirim"}
            </button>
          </div>
        </div>
      )}

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <EmptyState icon="📢" title="Belum ada pengumuman" description="Pengumuman akan muncul di sini." />
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const ps = priorityStyles[a.priority];
            return (
              <div key={a.id} className="rounded-3xl bg-white p-5 card-float transition hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {a.is_pinned && <span className="text-amber-500 text-sm">📌</span>}
                      <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase ${ps.bg} ${ps.text}`}>
                        {ps.label}
                      </span>
                      {a.classroom && (
                        <span className="rounded-xl bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-600">
                          {a.classroom.name}
                        </span>
                      )}
                      {!a.classroom_id && (
                        <span className="rounded-xl bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-600">
                          Global
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900">{a.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">{a.body}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(a.created_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                  {isTeacher && (
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEdit(a)}
                        className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
                        title="Edit pengumuman"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition"
                        title="Hapus pengumuman"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
