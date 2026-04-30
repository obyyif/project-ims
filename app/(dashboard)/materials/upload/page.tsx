"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { MaterialCategory } from "@/types/api";

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
    mimeType.includes("pdf") || mimeType.includes("word") ||
    mimeType.includes("spreadsheet") || mimeType.includes("excel") ||
    mimeType.includes("presentation") || mimeType.includes("powerpoint") ||
    mimeType.startsWith("text/")
  ) return "document";
  return "other";
}

const catConfig: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  document: { icon: "📄", label: "Dokumen", color: "text-blue-600", bg: "bg-blue-50" },
  image: { icon: "🖼️", label: "Gambar", color: "text-emerald-600", bg: "bg-emerald-50" },
  video: { icon: "🎬", label: "Video", color: "text-purple-600", bg: "bg-purple-50" },
  other: { icon: "📦", label: "Lainnya", color: "text-orange-600", bg: "bg-orange-50" },
};

interface Classroom { id: string; name: string; }

export default function UploadMaterialPage() {
  const router = useRouter();
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

  useEffect(() => {
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
  }, []);

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
      if (isVideo && subtitle) formData.append("subtitle", subtitle);

      await api.post("/teacher/materials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/materials");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Gagal mengupload materi.");
    } finally {
      setSubmitting(false);
    }
  };

  const cat = detectedCategory ? catConfig[detectedCategory] : null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Kembali ke Materi
      </button>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Materi Baru</h1>
        <p className="text-sm text-slate-400 mt-1">Unggah materi pembelajaran untuk kelas Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left — Form */}
        <div className="space-y-5">
          {/* Drag & Drop */}
          <div className="rounded-3xl bg-white p-6 card-float">
            <h3 className="text-sm font-bold text-slate-900 mb-4">File Materi</h3>
            <div
              className={`rounded-2xl border-2 border-dashed transition-all p-8 text-center cursor-pointer
                ${dragOver ? "border-sky-400 bg-sky-50/50" : file ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200 bg-slate-50/50 hover:border-sky-300"}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
            >
              <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} />
              {file ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl">{cat?.icon}</span>
                    <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase ${cat?.bg} ${cat?.color}`}>
                      {cat?.label}
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

            {/* Subtitle for video */}
            {isVideo && (
              <div className="mt-4 rounded-2xl border border-purple-200 bg-purple-50/30 p-4">
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
                  <input ref={subtitleRef} type="file" accept=".vtt,.srt" className="hidden" onChange={(e) => setSubtitle(e.target.files?.[0] || null)} />
                </div>
              </div>
            )}
          </div>

          {/* Detail Fields */}
          <div className="rounded-3xl bg-white p-6 card-float space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Detail Materi</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul Materi *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Modul HTML & CSS Dasar"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Penjelasan singkat tentang materi ini..."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none transition resize-none"
              />
            </div>

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
          </div>
        </div>

        {/* Right — Summary & Submit */}
        <div className="space-y-5">
          <div className="rounded-3xl bg-white p-6 card-float space-y-4 lg:sticky lg:top-24">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">File</span>
                <span className="text-slate-700 font-medium truncate ml-4 max-w-[180px]">{file?.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ukuran</span>
                <span className="text-slate-700 font-medium">{file ? formatFileSize(file.size) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tipe</span>
                <span className={`font-bold ${cat?.color || "text-slate-400"}`}>{cat?.label || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kelas</span>
                <span className="text-slate-700 font-medium">{classrooms.find(c => c.id === classroomId)?.name || "—"}</span>
              </div>
              {isVideo && subtitle && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtitle</span>
                  <span className="text-purple-600 font-medium truncate ml-4 max-w-[180px]">{subtitle.name}</span>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs text-rose-600 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !file || !title || !classroomId}
              className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Mengupload..." : "Upload Materi"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
