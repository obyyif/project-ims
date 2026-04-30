"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { CourseMaterial, MaterialCategory } from "@/types/api";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatFileSize(bytes?: number): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function resolveCategory(mimeType: string): MaterialCategory {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("word") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    mimeType.includes("presentation") ||
    mimeType.includes("powerpoint") ||
    mimeType.startsWith("text/")
  )
    return "document";
  return "other";
}

const catConfig: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  document: { icon: "📄", label: "Dokumen", color: "text-blue-600", bg: "bg-blue-50" },
  image: { icon: "🖼️", label: "Gambar", color: "text-emerald-600", bg: "bg-emerald-50" },
  video: { icon: "🎬", label: "Video", color: "text-purple-600", bg: "bg-purple-50" },
  other: { icon: "📦", label: "Lainnya", color: "text-orange-600", bg: "bg-orange-50" },
};

// ── Upload Modal ─────────────────────────────────────────────────────────────

interface Classroom {
  id: string;
  name: string;
}

function UploadModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [subtitle, setSubtitle] = useState<File | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const subtitleRef = useRef<HTMLInputElement>(null);

  const detectedCategory = file ? resolveCategory(file.type) : null;
  const isVideo = detectedCategory === "video";

  // Fetch classrooms for teacher
  useEffect(() => {
    if (!open) return;
    api.get("/teacher/schedules").then((res) => {
      const schedules = res.data?.data || res.data || [];
      const classMap = new Map<string, string>();
      schedules.forEach((s: { classroom?: { id: string; name: string } }) => {
        if (s.classroom) classMap.set(s.classroom.id, s.classroom.name);
      });
      const list = Array.from(classMap, ([id, name]) => ({ id, name }));
      setClassrooms(list);
      if (list.length === 1) setClassroomId(list[0].id);
    }).catch(() => {});
  }, [open]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setClassroomId("");
    setFile(null);
    setSubtitle(null);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      if (!title) setTitle(dropped.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "));
    }
  }, [title]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (!title) setTitle(selected.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !classroomId) {
      setError("Judul, kelas, dan file wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("classroom_id", classroomId);
      formData.append("file", file);
      if (isVideo && subtitle) {
        formData.append("subtitle", subtitle);
      }

      await api.post("/teacher/materials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      handleClose();
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Gagal mengupload materi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button onClick={handleClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <h2 className="text-lg font-bold text-slate-900 mb-5">Upload Materi Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-all p-6 text-center cursor-pointer
              ${dragOver ? "border-sky-400 bg-sky-50/50" : file ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200 bg-slate-50/50 hover:border-sky-300"}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
          >
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} />
            {file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{catConfig[detectedCategory || "other"].icon}</span>
                  <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase ${catConfig[detectedCategory || "other"].bg} ${catConfig[detectedCategory || "other"].color}`}>
                    {catConfig[detectedCategory || "other"].label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setSubtitle(null); }}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
                >
                  Ganti file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl">📂</div>
                <p className="text-sm font-semibold text-slate-500">Drag & drop file atau klik untuk memilih</p>
                <p className="text-xs text-slate-400">PDF, Word, Excel, Gambar, Video, ZIP — maks 200MB</p>
              </div>
            )}
          </div>

          {/* Subtitle (video only) */}
          {isVideo && (
            <div className="rounded-2xl border border-purple-200 bg-purple-50/30 p-4">
              <p className="text-xs font-bold text-purple-600 mb-2">🎵 Subtitle (Opsional)</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => subtitleRef.current?.click()}
                  className="rounded-xl bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-200 transition"
                >
                  {subtitle ? "Ganti Subtitle" : "Pilih File .vtt / .srt"}
                </button>
                {subtitle && <span className="text-xs text-purple-600 truncate">{subtitle.name}</span>}
                <input
                  ref={subtitleRef}
                  type="file"
                  accept=".vtt,.srt"
                  className="hidden"
                  onChange={(e) => setSubtitle(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul Materi *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Modul HTML & CSS"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Penjelasan singkat tentang materi..."
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none transition resize-none"
            />
          </div>

          {/* Classroom */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kelas Tujuan *</label>
            <select
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-400 focus:bg-white focus:outline-none transition"
              required
            >
              <option value="">Pilih kelas...</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs text-rose-600 font-medium">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || !file || !title || !classroomId}
              className="flex-1 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Mengupload..." : "Upload Materi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function MaterialsPage() {
  const { role } = useAuth();
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const isTeacher = role === "teacher";

  const fetchMaterials = useCallback(async () => {
    if (!role) return;
    setIsLoading(true);
    try {
      const endpoint = isTeacher ? "/teacher/materials" : "/student/materials";
      const res = await api.get(endpoint);
      setMaterials(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch materials", err);
    } finally {
      setIsLoading(false);
    }
  }, [role, isTeacher]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Filter
  const filtered = materials.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || m.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // Group by category for display
  const grouped = filtered.reduce<Record<string, CourseMaterial[]>>((acc, m) => {
    const cat = m.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

  // Stats
  const stats = {
    total: materials.length,
    document: materials.filter((m) => m.category === "document").length,
    image: materials.filter((m) => m.category === "image").length,
    video: materials.filter((m) => m.category === "video").length,
    other: materials.filter((m) => m.category === "other").length,
  };

  if (isLoading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Memuat materi...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Materi Pembelajaran</h1>
          <p className="text-sm text-slate-400 mt-1">
            {isTeacher ? "Kelola dan upload materi untuk kelas Anda" : "Akses seluruh materi kelas Anda"}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowUpload(true)}
            className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98]"
          >
            + Upload Materi
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["document", "image", "video", "other"] as const).map((cat) => {
          const c = catConfig[cat];
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? "all" : cat)}
              className={`rounded-2xl p-4 text-left transition-all border ${
                filterCategory === cat
                  ? "border-sky-300 bg-sky-50 shadow-sm"
                  : "border-slate-100 bg-white hover:border-slate-200"
              } card-float`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{c.icon}</span>
                <span className="text-xs font-bold text-slate-500">{c.label}</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{stats[cat]}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        <input
          type="text"
          placeholder="Cari materi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 card-float transition-all focus:border-sky-400 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.1)]"
        />
      </div>

      {/* Material List — grouped by category */}
      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center card-float">
          <p className="text-3xl mb-3">📚</p>
          <p className="text-sm font-semibold text-slate-500">Belum ada materi</p>
          {isTeacher && (
            <button
              onClick={() => setShowUpload(true)}
              className="mt-3 text-sm font-bold text-sky-500 hover:text-sky-600"
            >
              Upload materi pertama →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => {
            const c = catConfig[cat] || catConfig.other;
            return (
              <div key={cat}>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                  <span>{c.icon}</span> {c.label}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{items.length}</span>
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/materials/${item.id}`}
                      className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-4 transition-all hover:border-sky-100 hover:bg-sky-50/30 hover:-translate-y-0.5 card-float"
                    >
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shrink-0 ${c.bg}`}>
                        <span className="text-lg">{c.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{item.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.original_filename} • {formatFileSize(item.file_size)}
                          {item.teacher && ` • ${item.teacher.name}`}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-xl bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
                        {cat === "video" ? "Tonton" : cat === "image" ? "Lihat" : "Buka"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={fetchMaterials}
      />
    </div>
  );
}
