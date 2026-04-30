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
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { role } = useAuth();
  const [material, setMaterial] = useState<CourseMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMaterial = async () => {
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
  }, [role, params.id]);

  const handleDownload = async () => {
    if (!material) return;
    try {
      const endpoint = `/student/materials/${material.id}/download`;
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
      alert("Gagal mengunduh file.");
    }
  };

  if (isLoading) return <LoadingSpinner text="Memuat materi..." />;
  if (error) return <ApiError message={error} onRetry={fetchMaterial} />;
  if (!material) return null;

  const fileIcon = material.file_type?.includes("pdf") ? "📄" : material.file_type?.includes("image") ? "🖼️" : "📁";

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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-2xl shrink-0">
            {fileIcon}
          </div>
          <div className="flex-1 min-w-0">
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
              <span>
                {new Date(material.created_at).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* File Info & Download */}
      {material.file_path && (
        <div className="rounded-3xl bg-white p-6 card-float">
          <h3 className="text-sm font-bold text-slate-900 mb-4">File Materi</h3>
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 shrink-0">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M9 15h6M9 11h6" />
                </svg>
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
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
