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

interface FileItem { file: File; category: MaterialCategory; id: string; }
interface Classroom { id: string; name: string; }

export default function UploadMaterialPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: FileItem[] = Array.from(fileList).map((f) => ({
      file: f,
      category: resolveCategory(f.type),
      id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const clearFiles = () => setFiles([]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length || !classroomId) {
      setError("Pilih kelas dan minimal 1 file.");
      return;
    }

    setSubmitting(true);
    setError("");
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("classroom_id", classroomId);
      if (title) formData.append("title", title);
      if (description) formData.append("description", description);
      files.forEach((f) => formData.append("files[]", f.file));

      await api.post("/teacher/materials/batch", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      router.push("/materials");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Gagal mengupload materi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Group files by category for summary
  const grouped = files.reduce<Record<string, number>>((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + 1;
    return acc;
  }, {});

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Kembali ke Materi
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Materi</h1>
        <p className="text-sm text-slate-400 mt-1">Upload satu atau banyak file sekaligus — akan dikelompokkan otomatis</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left */}
        <div className="space-y-5">
          {/* Drop Zone */}
          <div className="rounded-3xl bg-white p-5 card-float">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">File ({files.length})</h3>
              {files.length > 0 && (
                <button type="button" onClick={clearFiles} className="text-xs font-semibold text-rose-500 hover:text-rose-600">Hapus semua</button>
              )}
            </div>

            <div
              className={`rounded-2xl border-2 border-dashed transition-all p-8 text-center cursor-pointer
                ${dragOver ? "border-sky-400 bg-sky-50/50" : files.length > 0 ? "border-slate-200 bg-slate-50/30 p-4" : "border-slate-200 bg-slate-50/50 hover:border-sky-300"}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }} />
              <div className="text-3xl mb-2">📂</div>
              <p className="text-sm font-semibold text-slate-500">
                {files.length > 0 ? "Tambah file lagi..." : "Drag & drop file atau klik untuk memilih"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Bisa pilih banyak file campuran — maks 200MB per file</p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-1.5 max-h-[400px] overflow-y-auto">
                {files.map((f) => {
                  const cat = catConfig[f.category];
                  return (
                    <div key={f.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 group">
                      <span className="text-lg shrink-0">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{f.file.name}</p>
                        <p className="text-[10px] text-slate-400">{formatFileSize(f.file.size)} • {cat.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                        className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="rounded-3xl bg-white p-5 card-float space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Detail</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul Grup (opsional)</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Kosongkan untuk menggunakan nama file asli"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Penjelasan singkat..."
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none transition resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kelas Tujuan *</label>
              <select value={classroomId} onChange={(e) => setClassroomId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-400 focus:bg-white focus:outline-none transition" required>
                <option value="">Pilih kelas...</option>
                {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Right — Summary */}
        <div>
          <div className="rounded-3xl bg-white p-5 card-float space-y-4 lg:sticky lg:top-24">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan</h3>

            {files.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Belum ada file dipilih</p>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total file</span>
                  <span className="text-slate-700 font-bold">{files.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ukuran total</span>
                  <span className="text-slate-700 font-medium">{formatFileSize(totalSize)}</span>
                </div>
                <hr className="border-slate-100" />
                {Object.entries(grouped).map(([cat, count]) => {
                  const c = catConfig[cat as MaterialCategory];
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>{c.icon}</span>
                        <span className={`text-xs font-semibold ${c.color}`}>{c.label}</span>
                      </span>
                      <span className="text-slate-700 font-bold">{count}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between">
                  <span className="text-slate-400">Kelas</span>
                  <span className="text-slate-700 font-medium">{classrooms.find(c => c.id === classroomId)?.name || "—"}</span>
                </div>
              </div>
            )}

            <hr className="border-slate-100" />

            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-600 font-medium">{error}</div>
            )}

            {/* Progress bar */}
            {submitting && (
              <div className="space-y-1">
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 text-center">{progress}%</p>
              </div>
            )}

            <button type="submit" disabled={submitting || !files.length || !classroomId}
              className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? `Mengupload... ${progress}%` : `Upload ${files.length} File`}
            </button>

            <button type="button" onClick={() => router.back()}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
