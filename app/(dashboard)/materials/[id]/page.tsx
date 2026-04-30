"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { CourseMaterial } from "@/types/api";
import { LoadingSpinner, ApiError } from "@/app/components/ErrorBoundary";

function formatFileSize(bytes?: number): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const categoryConfig: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  document: { icon: "📄", label: "Dokumen", color: "text-blue-600", bg: "bg-blue-50" },
  image: { icon: "🖼️", label: "Gambar", color: "text-emerald-600", bg: "bg-emerald-50" },
  video: { icon: "🎬", label: "Video", color: "text-purple-600", bg: "bg-purple-50" },
  other: { icon: "📦", label: "File Lainnya", color: "text-orange-600", bg: "bg-orange-50" },
};

// ── Viewer Components ────────────────────────────────────────────────

function DocumentViewer({ material }: { material: CourseMaterial }) {
  const fileUrl = material.file_url || material.download_url;
  const isPdf = material.file_type?.includes("pdf");
  const isText = material.file_type?.startsWith("text/");

  if (isPdf && fileUrl) {
    return (
      <div className="rounded-2xl overflow-hidden border border-slate-200">
        <iframe
          src={`${fileUrl}#toolbar=1&navpanes=0`}
          className="w-full h-[600px]"
          title={material.title}
        />
      </div>
    );
  }

  if (isText && fileUrl) {
    return <TextFileViewer url={fileUrl} />;
  }

  // For Word/Excel/PPT — show preview info + Google Docs viewer fallback
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center space-y-3">
      <div className="text-5xl">📄</div>
      <p className="text-sm font-semibold text-slate-700">{material.original_filename}</p>
      <p className="text-xs text-slate-400">
        File ini tidak dapat ditampilkan langsung di browser. Silakan download untuk membuka.
      </p>
    </div>
  );
}

function TextFileViewer({ url }: { url: string }) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((r) => r.text())
      .then((text) => setContent(text))
      .catch(() => setContent("Gagal memuat konten file."))
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) return <div className="p-6 text-center text-sm text-slate-400">Memuat teks...</div>;

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 text-slate-300 p-5 overflow-auto max-h-[600px]">
        <pre className="text-xs leading-relaxed font-mono whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  );
}

function ImageViewer({ material }: { material: CourseMaterial }) {
  const [zoomed, setZoomed] = useState(false);
  const fileUrl = material.file_url || material.download_url;

  if (!fileUrl) return null;

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in bg-[repeating-conic-gradient(#f1f5f9_0%_25%,white_0%_50%)] bg-[length:20px_20px]"
        onClick={() => setZoomed(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fileUrl}
          alt={material.title}
          className="w-full max-h-[600px] object-contain"
        />
      </div>

      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
            onClick={() => setZoomed(false)}
          >
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fileUrl}
            alt={material.title}
            className="max-w-[95vw] max-h-[95vh] object-contain"
          />
        </div>
      )}
    </>
  );
}

function VideoPlayer({ material }: { material: CourseMaterial }) {
  const fileUrl = material.file_url || material.download_url;

  if (!fileUrl) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black">
      <video
        controls
        className="w-full max-h-[600px]"
        preload="metadata"
        crossOrigin="anonymous"
      >
        <source src={fileUrl} type={material.file_type || "video/mp4"} />
        {material.subtitle_url && (
          <track
            kind="subtitles"
            src={material.subtitle_url}
            srcLang="id"
            label="Indonesia"
            default
          />
        )}
        Browser Anda tidak mendukung pemutaran video.
      </video>
    </div>
  );
}

function OtherFilePreview({ material }: { material: CourseMaterial }) {
  const ext = material.original_filename?.split(".").pop()?.toUpperCase() || "FILE";

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center space-y-3">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 text-3xl font-bold text-orange-500">
        .{ext.toLowerCase()}
      </div>
      <p className="text-sm font-semibold text-slate-700">{material.original_filename}</p>
      <p className="text-xs text-slate-400">
        Tipe file ini tidak dapat ditampilkan langsung. Silakan download untuk membuka.
      </p>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { role } = useAuth();
  const [material, setMaterial] = useState<CourseMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMaterial = async () => {
    setIsLoading(true);
    try {
      const endpoint = role === "teacher"
        ? `/teacher/materials/${params.id}`
        : `/student/materials/${params.id}`;
      const res = await api.get(endpoint);
      setMaterial(res.data?.data || res.data);
      setError("");
    } catch {
      setError("Materi tidak ditemukan atau akses ditolak.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role && params.id) fetchMaterial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, params.id]);

  const handleDownload = async () => {
    if (!material) return;
    try {
      const endpoint = role === "teacher"
        ? `/teacher/materials/${material.id}`
        : `/student/materials/${material.id}/download`;
      const res = await api.get(endpoint, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", material.original_filename || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open file_url directly
      if (material.file_url) {
        window.open(material.file_url, "_blank");
      } else {
        alert("Gagal mengunduh file.");
      }
    }
  };

  if (isLoading) return <LoadingSpinner text="Memuat materi..." />;
  if (error) return <ApiError message={error} onRetry={fetchMaterial} />;
  if (!material) return null;

  const cat = categoryConfig[material.category || "other"] || categoryConfig.other;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      {/* Material Header */}
      <div className="rounded-3xl bg-white p-6 md:p-8 card-float">
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.bg} text-2xl shrink-0`}>
            {cat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`rounded-xl ${cat.bg} px-2.5 py-1 text-[10px] font-bold uppercase ${cat.color}`}>
                {cat.label}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{material.title}</h1>
            {material.description && (
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{material.description}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-4 text-xs text-slate-400">
              {material.teacher && (
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  {material.teacher.name}
                </span>
              )}
              {material.classroom && (
                <span className="rounded-xl bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-600">
                  {material.classroom.name}
                </span>
              )}
              <span>{formatFileSize(material.file_size)}</span>
              <span>
                {new Date(material.created_at).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* File Viewer — based on category */}
      <div className="rounded-3xl bg-white p-6 card-float">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Preview Materi</h3>
          {material.subtitle_url && (
            <span className="rounded-xl bg-purple-50 px-2.5 py-1 text-[10px] font-bold text-purple-600">
              🎵 Subtitle tersedia
            </span>
          )}
        </div>

        {material.category === "document" && <DocumentViewer material={material} />}
        {material.category === "image" && <ImageViewer material={material} />}
        {material.category === "video" && <VideoPlayer material={material} />}
        {(material.category === "other" || !material.category) && <OtherFilePreview material={material} />}
      </div>

      {/* File Info & Download */}
      <div className="rounded-3xl bg-white p-6 card-float">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Detail File</h3>
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${cat.bg} text-lg shrink-0`}>
              {cat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{material.original_filename || "File"}</p>
              <p className="text-xs text-slate-400">
                {material.file_type} • {formatFileSize(material.file_size)}
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98] shrink-0"
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
