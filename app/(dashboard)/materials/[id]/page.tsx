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

function baseTitle(title: string): string {
  return title.replace(/\s*\(\d+\)\s*$/, "").trim();
}

function canPreview(m: CourseMaterial): boolean {
  const e = ext(m.original_filename);
  return m.category === "image" || m.category === "video" || e === "pdf" ||
    ["txt", "md", "markdown", "csv", "json", "xml"].includes(e);
}

// ── File Card (Drive-style) ──
function FileCard({ m, onPreview }: { m: CourseMaterial; onPreview: () => void }) {
  const c = CAT[m.category || "other"] || CAT.other;
  const e = ext(m.original_filename);
  const previewable = canPreview(m);

  const download = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    const url = m.file_url || m.download_url;
    if (url) { const a = document.createElement("a"); a.href = url; a.download = m.original_filename || "file"; a.click(); }
  };

  return (
    <div
      onDoubleClick={previewable ? onPreview : undefined}
      className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white overflow-hidden cursor-pointer transition-all hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div className={`relative h-28 flex items-center justify-center ${c.bg}`}>
        <span className="text-4xl">{c.icon}</span>
        <span className={`absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${c.bg} ${c.color} border border-current/10`}>
          .{e || "?"}
        </span>
      </div>
      {/* Info */}
      <div className="p-3 min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-900 truncate">{m.original_filename || m.title}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-slate-400">{fmtSize(m.file_size)}</span>
          <button onClick={download} className="opacity-0 group-hover:opacity-100 rounded-lg bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-600 hover:bg-sky-100 transition" title="Download">
            📥
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Preview Overlay ──
function PreviewOverlay({ material, onClose, role }: {
  material: CourseMaterial; onClose: () => void; role?: string;
}) {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [vidError, setVidError] = useState(false);
  const e = ext(material.original_filename);
  const c = CAT[material.category || "other"] || CAT.other;
  const isImage = material.category === "image";
  const isVideo = material.category === "video";
  const isPdf = e === "pdf";
  const isText = ["txt", "md", "markdown", "csv", "json", "xml"].includes(e);
  const fileUrl = material.file_url || material.download_url;

  useEffect(() => {
    if (isText && material.id) {
      const ep = role === "teacher"
        ? `/teacher/materials/${material.id}/content`
        : `/student/materials/${material.id}/content`;
      api.get(ep)
        .then((r) => setTextContent(r.data?.content || ""))
        .catch(() => setTextContent("File tidak ditemukan atau belum tersedia."));
    }
  }, [material.id, isText, role]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => { if (ev.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const download = () => {
    if (fileUrl) { const a = document.createElement("a"); a.href = fileUrl; a.download = material.original_filename || "file"; a.click(); }
  };

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[81] flex items-center justify-center p-8">
        <div className="flex flex-col w-[900px] max-h-[80vh] rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 shrink-0">
            <span className="text-lg">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{material.original_filename}</p>
              <p className="text-[11px] text-slate-400">{fmtSize(material.file_size)}</p>
            </div>
            <button onClick={download} className="rounded-xl bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600 hover:bg-sky-100 transition">📥 Download</button>
            <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center">
            {isImage && fileUrl && !imgError ? (
              <div className="p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fileUrl} alt={material.title} className="max-w-full max-h-[60vh] object-contain rounded-lg" onError={() => setImgError(true)} />
              </div>
            ) : isImage && (imgError || !fileUrl) ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <span className="text-6xl">🖼️</span>
                <p className="text-sm text-slate-500">Gambar tidak dapat dimuat</p>
              </div>
            ) : isVideo && fileUrl ? (
              <div className="w-full p-6">
                <div className="w-full max-w-3xl mx-auto aspect-video rounded-lg overflow-hidden bg-black">
                  <video src={fileUrl} controls className="w-full h-full" onError={() => setVidError(true)} />
                </div>
                {vidError && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 mx-auto max-w-3xl">
                    <span>⚠️</span>
                    <p className="text-xs text-amber-700">Video rusak atau format tidak didukung. Hubungi guru bersangkutan.</p>
                  </div>
                )}
              </div>
            ) : isPdf && fileUrl ? (
              <iframe src={fileUrl} className="w-full h-[65vh]" title={material.title} />
            ) : isText ? (
              <div className="w-full p-5 max-h-[65vh] overflow-auto">
                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed bg-white rounded-xl p-4 border border-slate-100">
                  {textContent === null ? "Memuat..." : textContent}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-12">
                <span className="text-6xl">{c.icon}</span>
                <p className="text-sm font-semibold text-slate-700">Preview tidak tersedia</p>
                <p className="text-xs text-slate-400">File .{e} tidak dapat dipratinjau</p>
                <button onClick={download} className="mt-2 rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition">
                  📥 Download
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-2.5 border-t border-slate-100 text-xs text-slate-400 text-center shrink-0">
            Esc untuk tutup
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Detail Page ──
export default function MaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { role } = useAuth();
  const [material, setMaterial] = useState<CourseMaterial | null>(null);
  const [relatedFiles, setRelatedFiles] = useState<CourseMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<CourseMaterial | null>(null);

  // 1. Load the representative material
  useEffect(() => {
    const ep = role === "teacher" ? `/teacher/materials/${id}` : `/student/materials/${id}`;
    api.get(ep)
      .then((r) => setMaterial(r.data?.data || r.data))
      .catch(() => setError("Materi tidak ditemukan"))
      .finally(() => setIsLoading(false));
  }, [id, role]);

  // 2. Load all materials, find related files (same base title + classroom)
  useEffect(() => {
    if (!material) return;
    const ep = role === "teacher" ? "/teacher/materials" : "/student/materials";
    api.get(ep).then((r) => {
      const all: CourseMaterial[] = r.data?.data || [];
      const base = baseTitle(material.title);
      const classId = material.classroom?.id;
      const related = all.filter((m) =>
        baseTitle(m.title) === base &&
        (m.classroom?.id || "none") === (classId || "none")
      );
      setRelatedFiles(related.length > 0 ? related : [material]);
    }).catch(() => setRelatedFiles([material]));
  }, [material, role]);

  const downloadAll = () => {
    relatedFiles.forEach((m, i) => {
      setTimeout(() => {
        const url = m.file_url || m.download_url;
        if (url) { const a = document.createElement("a"); a.href = url; a.download = m.original_filename || "file"; a.click(); }
      }, i * 300);
    });
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
        ← Kembali
      </Link>
    </div>
  );

  const groupTitle = baseTitle(material.title);

  return (
    <>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/materials" className="text-slate-400 hover:text-sky-500 transition font-medium">Materi</Link>
          <svg className="h-3.5 w-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          <span className="text-slate-700 font-medium truncate max-w-xs">{groupTitle}</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-slate-200/80">
          <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
            <span className="text-2xl">📁</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900">{groupTitle}</h1>
            {material.description && <p className="text-sm text-slate-500 mt-1">{material.description}</p>}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              {material.classroom && <span className="bg-slate-100 text-slate-600 rounded-lg px-2 py-0.5 font-medium">{material.classroom.name}</span>}
              {material.teacher && <span>👤 {material.teacher.name}</span>}
              <span>{relatedFiles.length} file</span>
              <span>{fmtSize(relatedFiles.reduce((s, m) => s + (m.file_size || 0), 0))}</span>
            </div>
          </div>
          {relatedFiles.length > 1 && (
            <button onClick={downloadAll} className="shrink-0 rounded-2xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition">
              📥 Download Semua
            </button>
          )}
        </div>

        {/* File Gallery — Drive style */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-700">File ({relatedFiles.length})</h2>
            <p className="text-[11px] text-slate-400">Double-click untuk preview</p>
          </div>

          {relatedFiles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
              <span className="text-5xl">📭</span>
              <p className="mt-3 font-medium text-slate-600">Tidak ada file</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {relatedFiles.map((m) => (
                <FileCard key={m.id} m={m} onPreview={() => setPreview(m)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview via Portal */}
      {preview && (
        <Portal>
          <PreviewOverlay material={preview} onClose={() => setPreview(null)} role={role || undefined} />
        </Portal>
      )}
    </>
  );
}
