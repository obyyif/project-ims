"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { CourseMaterial } from "@/types/api";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatFileSize(bytes?: number): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(filename?: string): string {
  return filename?.split(".").pop()?.toLowerCase() || "";
}

const catMeta: Record<string, { icon: string; label: string; color: string; bg: string; thumbBg: string; thumbColor: string }> = {
  document: { icon: "📄", label: "Dokumen", color: "text-blue-600", bg: "bg-blue-50", thumbBg: "bg-blue-100", thumbColor: "text-blue-500" },
  image: { icon: "🖼️", label: "Gambar", color: "text-emerald-600", bg: "bg-emerald-50", thumbBg: "bg-emerald-100", thumbColor: "text-emerald-500" },
  video: { icon: "🎬", label: "Video", color: "text-purple-600", bg: "bg-purple-50", thumbBg: "bg-purple-100", thumbColor: "text-purple-500" },
  other: { icon: "📦", label: "Lainnya", color: "text-orange-600", bg: "bg-orange-50", thumbBg: "bg-orange-100", thumbColor: "text-orange-500" },
};

// Extension-specific icons for richer display
const extIcons: Record<string, { svg: string; color: string }> = {
  pdf: { svg: "PDF", color: "text-red-500 bg-red-50" },
  doc: { svg: "DOC", color: "text-blue-600 bg-blue-50" },
  docx: { svg: "DOC", color: "text-blue-600 bg-blue-50" },
  xls: { svg: "XLS", color: "text-green-600 bg-green-50" },
  xlsx: { svg: "XLS", color: "text-green-600 bg-green-50" },
  ppt: { svg: "PPT", color: "text-amber-600 bg-amber-50" },
  pptx: { svg: "PPT", color: "text-amber-600 bg-amber-50" },
  txt: { svg: "TXT", color: "text-slate-600 bg-slate-100" },
  zip: { svg: "ZIP", color: "text-yellow-700 bg-yellow-50" },
  rar: { svg: "RAR", color: "text-yellow-700 bg-yellow-50" },
  mp4: { svg: "MP4", color: "text-purple-600 bg-purple-50" },
  mov: { svg: "MOV", color: "text-purple-600 bg-purple-50" },
  webm: { svg: "WEB", color: "text-purple-600 bg-purple-50" },
  png: { svg: "PNG", color: "text-pink-600 bg-pink-50" },
  jpg: { svg: "JPG", color: "text-pink-600 bg-pink-50" },
  jpeg: { svg: "JPG", color: "text-pink-600 bg-pink-50" },
  gif: { svg: "GIF", color: "text-pink-600 bg-pink-50" },
  webp: { svg: "WEB", color: "text-pink-600 bg-pink-50" },
};

// ── File Card (Google Drive style) ───────────────────────────────────────────

function FileCard({ material }: { material: CourseMaterial }) {
  const cat = catMeta[material.category || "other"] || catMeta.other;
  const ext = getFileExtension(material.original_filename);
  const extInfo = extIcons[ext];
  const isImage = material.category === "image";
  const isVideo = material.category === "video";

  return (
    <Link
      href={`/materials/${material.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Thumbnail area */}
      <div className={`relative h-36 flex items-center justify-center ${isImage && material.file_url ? "bg-[repeating-conic-gradient(#f8fafc_0%_25%,white_0%_50%)] bg-[length:16px_16px]" : cat.thumbBg}`}>
        {isImage && material.file_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={material.file_url}
            alt={material.title}
            className="w-full h-full object-cover"
          />
        ) : isVideo ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 shadow-sm">
              <svg className="h-6 w-6 text-purple-500 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-purple-400 uppercase">{ext}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {/* Extension badge */}
            <div className={`rounded-xl px-3 py-2 text-base font-black ${extInfo?.color || "text-slate-500 bg-slate-100"}`}>
              .{ext || "?"}
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              {formatFileSize(material.file_size)}
            </span>
          </div>
        )}

        {/* Category pill — top right */}
        <span className={`absolute top-2 right-2 rounded-lg px-1.5 py-0.5 text-[9px] font-bold uppercase ${cat.bg} ${cat.color}`}>
          {cat.label}
        </span>
      </div>

      {/* Info area */}
      <div className="flex-1 p-3 flex flex-col gap-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-sky-600 transition-colors">
          {material.title}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="truncate">{material.original_filename}</span>
          <span>•</span>
          <span className="shrink-0">{formatFileSize(material.file_size)}</span>
        </div>
        {material.teacher && (
          <p className="text-[11px] text-slate-400 truncate mt-auto pt-1">
            {material.teacher.name}
          </p>
        )}
      </div>
    </Link>
  );
}

// ── View Toggle ──────────────────────────────────────────────────────────────

function ViewToggle({ view, onChange }: { view: "grid" | "list"; onChange: (v: "grid" | "list") => void }) {
  return (
    <div className="flex rounded-xl border border-slate-200 p-0.5">
      <button
        onClick={() => onChange("grid")}
        className={`rounded-lg p-1.5 transition ${view === "grid" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
        title="Grid view"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
      </button>
      <button
        onClick={() => onChange("list")}
        className={`rounded-lg p-1.5 transition ${view === "list" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
        title="List view"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
      </button>
    </div>
  );
}

// ── List Row ─────────────────────────────────────────────────────────────────

function FileRow({ material }: { material: CourseMaterial }) {
  const cat = catMeta[material.category || "other"] || catMeta.other;
  const ext = getFileExtension(material.original_filename);
  const extInfo = extIcons[ext];

  return (
    <Link
      href={`/materials/${material.id}`}
      className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 transition-all hover:border-sky-200 hover:bg-sky-50/30"
    >
      {/* Icon */}
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${extInfo?.color || cat.thumbBg}`}>
        <span className="text-xs font-black">.{ext || "?"}</span>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-sky-600 transition-colors">{material.title}</p>
        <p className="text-[11px] text-slate-400 truncate">{material.original_filename}</p>
      </div>

      {/* Meta */}
      <span className={`hidden sm:inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${cat.bg} ${cat.color}`}>
        {cat.label}
      </span>
      <span className="text-xs text-slate-400 shrink-0 w-16 text-right">{formatFileSize(material.file_size)}</span>
      {material.teacher && (
        <span className="hidden md:inline-block text-xs text-slate-400 truncate max-w-[120px]">{material.teacher.name}</span>
      )}
    </Link>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function MaterialsPage() {
  const { role } = useAuth();
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  const filtered = materials.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.original_filename || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || m.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const stats = {
    document: materials.filter((m) => m.category === "document").length,
    image: materials.filter((m) => m.category === "image").length,
    video: materials.filter((m) => m.category === "video").length,
    other: materials.filter((m) => m.category === "other").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
          <p className="text-sm text-slate-400">Memuat materi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Materi Pembelajaran</h1>
          <p className="text-sm text-slate-400 mt-1">
            {materials.length} file • {isTeacher ? "Kelola materi kelas Anda" : "Akses materi kelas Anda"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          {isTeacher && (
            <Link
              href="/materials/upload"
              className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98] text-center"
            >
              + Upload
            </Link>
          )}
        </div>
      </div>

      {/* Toolbar: Search + Category filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input
            type="text"
            placeholder="Cari file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none"
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterCategory("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterCategory === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            Semua ({materials.length})
          </button>
          {(["document", "image", "video", "other"] as const).map((cat) => {
            const c = catMeta[cat];
            const count = stats[cat];
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(filterCategory === cat ? "all" : cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  filterCategory === cat
                    ? "bg-slate-900 text-white"
                    : `${c.bg} ${c.color} hover:opacity-80`
                }`}
              >
                {c.icon} {c.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* File Grid / List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-3xl mb-3">📂</p>
          <p className="text-sm font-semibold text-slate-500">
            {search ? "Tidak ada file yang cocok" : "Belum ada materi"}
          </p>
          {isTeacher && !search && (
            <Link href="/materials/upload" className="mt-3 inline-block text-sm font-bold text-sky-500 hover:text-sky-600">
              Upload materi pertama →
            </Link>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((m) => <FileCard key={m.id} material={m} />)}
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((m) => <FileRow key={m.id} material={m} />)}
        </div>
      )}
    </div>
  );
}
