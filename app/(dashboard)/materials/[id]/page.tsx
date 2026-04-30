"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Portal from "@/app/components/Portal";
import type { CourseMaterial } from "@/types/api";

// ── Helpers ──
const CAT: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  document: { icon: "📄", label: "Dokumen", color: "text-sky-600", bg: "bg-sky-50" },
  image:    { icon: "🖼️", label: "Gambar",  color: "text-emerald-600", bg: "bg-emerald-50" },
  video:    { icon: "🎬", label: "Video",   color: "text-purple-600", bg: "bg-purple-50" },
  other:    { icon: "📦", label: "Lainnya", color: "text-amber-600", bg: "bg-amber-50" },
};

function fmtSize(b?: number): string {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function ext(f?: string) {
  return f?.split(".").pop()?.toLowerCase() || "";
}

export default function MaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { role } = useAuth();
  const [material, setMaterial] = useState<CourseMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [textContent, setTextContent] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [vidError, setVidError] = useState(false);

  useEffect(() => {
    const ep = role === "teacher" ? `/teacher/materials/${id}` : `/student/materials/${id}`;
    api.get(ep)
      .then((r) => setMaterial(r.data?.data || r.data))
      .catch(() => setError("Materi tidak ditemukan"))
      .finally(() => setIsLoading(false));
  }, [id, role]);

  // Load text content for previewable text files
  useEffect(() => {
    if (!material) return;
    const e = ext(material.original_filename);
    const isText = ["txt", "md", "markdown", "csv", "json", "xml"].includes(e);
    if (isText) {
      const ep = role === "teacher"
        ? `/teacher/materials/${material.id}/content`
        : `/student/materials/${material.id}/content`;
      api.get(ep)
        .then((r) => setTextContent(r.data?.content || ""))
        .catch(() => setTextContent("File tidak ditemukan atau belum tersedia di server."));
    }
  }, [material, role]);

  const download = () => {
    if (!material) return;
    const url = material.file_url || material.download_url;
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = material.original_filename || "file";
      a.click();
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <svg className="h-8 w-8 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
    </div>
  );

  if (error || !material) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80">
      <p className="text-5xl mb-4">😕</p>
      <p className="font-bold text-slate-600">{error || "Materi tidak ditemukan"}</p>
      <Link href="/materials" className="inline-block mt-4 rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition">
        ← Kembali ke Materi
      </Link>
    </div>
  );

  const e = ext(material.original_filename);
  const c = CAT[material.category || "other"] || CAT.other;
  const isImage = material.category === "image";
  const isVideo = material.category === "video";
  const isPdf = e === "pdf";
  const isText = ["txt", "md", "markdown", "csv", "json", "xml"].includes(e);
  const fileUrl = material.file_url || material.download_url;

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/materials" className="text-slate-400 hover:text-sky-500 transition font-medium">Materi</Link>
        <svg className="h-3.5 w-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        <span className="text-slate-700 font-medium truncate max-w-xs">{material.title}</span>
      </div>

      {/* Header card */}
      <div className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-slate-200/80">
        <div className={`h-14 w-14 rounded-2xl ${c.bg} flex items-center justify-center shrink-0`}>
          <span className="text-2xl">{c.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-slate-900">{material.title}</h1>
          {material.description && <p className="text-sm text-slate-500 mt-1">{material.description}</p>}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
            <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${c.bg} ${c.color}`}>{c.label}</span>
            <span>{material.original_filename}</span>
            <span>{fmtSize(material.file_size)}</span>
            {material.teacher && <span>👤 {material.teacher.name}</span>}
            <span>📅 {new Date(material.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
        <button onClick={download} className="shrink-0 rounded-2xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition">
          📥 Download
        </button>
      </div>

      {/* Preview area */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <span className="text-sm">{c.icon}</span>
          <span className="text-xs font-semibold text-slate-700">Preview</span>
          <span className="text-[10px] text-slate-400 ml-auto">.{e}</span>
        </div>

        <div className="relative bg-slate-50">
          {/* Image preview */}
          {isImage && fileUrl && !imgError ? (
            <div className="flex items-center justify-center p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fileUrl}
                alt={material.title}
                className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm"
                onError={() => setImgError(true)}
              />
            </div>
          ) : isImage && (imgError || !fileUrl) ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="text-6xl">🖼️</span>
              <p className="text-sm font-medium text-slate-500">Gambar tidak dapat dimuat</p>
              <p className="text-xs text-slate-400">File mungkin rusak atau belum tersedia</p>
            </div>

          /* Video preview */
          ) : isVideo && fileUrl ? (
            <div className="flex flex-col items-center p-6">
              <div className="w-full max-w-3xl aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src={fileUrl}
                  controls
                  className="w-full h-full"
                  onError={() => setVidError(true)}
                />
              </div>
              {vidError && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5">
                  <span className="text-sm">⚠️</span>
                  <p className="text-xs text-amber-700">Video rusak atau format tidak didukung. Silakan hubungi guru yang bersangkutan.</p>
                </div>
              )}
            </div>

          /* PDF preview */
          ) : isPdf && fileUrl ? (
            <iframe src={fileUrl} className="w-full h-[600px]" title={material.title} />

          /* Text preview */
          ) : isText ? (
            <div className="p-5 max-h-[500px] overflow-auto">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed bg-white rounded-xl p-4 border border-slate-100">
                {textContent === null ? "Memuat..." : textContent}
              </pre>
            </div>

          /* No preview */
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="text-6xl">{c.icon}</span>
              <p className="text-sm font-semibold text-slate-700">Preview tidak tersedia</p>
              <p className="text-xs text-slate-400">File .{e} tidak dapat dipratinjau. Silakan download untuk membuka.</p>
              <button onClick={download} className="mt-2 rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition">
                📥 Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
