"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { CourseMaterial, MaterialCategory } from "@/types/api";

// ── Category config ──
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

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function ext(f?: string) {
  return f?.split(".").pop()?.toLowerCase() || "";
}

// ── Grid Card ──
function MaterialCard({ m }: { m: CourseMaterial }) {
  const c = CAT[m.category || "other"] || CAT.other;
  return (
    <Link href={`/materials/${m.id}`} className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white overflow-hidden cursor-pointer transition-all hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5">
      {/* Thumbnail area */}
      <div className={`relative h-28 flex items-center justify-center ${c.bg}`}>
        <span className="text-4xl">{c.icon}</span>
        <span className={`absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${c.bg} ${c.color} border border-current/10`}>
          {c.label}
        </span>
      </div>
      {/* Info */}
      <div className="p-3 min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-sky-600 transition">{m.title}</p>
        <p className="text-[10px] text-slate-400 truncate mt-0.5">{m.original_filename}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-slate-400">{fmtSize(m.file_size)}</span>
          <span className="text-[10px] text-slate-300">•</span>
          <span className="text-[10px] text-slate-400">{fmtDate(m.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}

// ── List Row ──
function MaterialRow({ m }: { m: CourseMaterial }) {
  const c = CAT[m.category || "other"] || CAT.other;
  return (
    <Link href={`/materials/${m.id}`} className="flex items-center gap-4 rounded-2xl bg-white p-4 border border-slate-200/80 cursor-pointer transition-all hover:border-sky-200 hover:shadow-sm hover:-translate-y-0.5 group">
      <div className={`h-11 w-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
        <span className="text-xl">{c.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-sky-600 transition">{m.title}</p>
        <p className="text-[11px] text-slate-400 truncate">{m.original_filename}</p>
      </div>
      <div className="hidden sm:flex items-center gap-4 shrink-0 text-[11px] text-slate-400">
        <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${c.bg} ${c.color}`}>{c.label}</span>
        <span className="w-16 text-right">{fmtSize(m.file_size)}</span>
        <span className="w-24 text-right">{fmtDate(m.created_at)}</span>
      </div>
      <svg className="h-4 w-4 text-slate-300 group-hover:text-sky-400 transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
    </Link>
  );
}

// ── Main Page ──
export default function MaterialsPage() {
  const { role } = useAuth();
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const ep = role === "teacher" ? "/teacher/materials" : "/student/materials";
    api.get(ep)
      .then((r) => setMaterials(r.data?.data || []))
      .catch((err) => console.error("Failed to fetch materials", err))
      .finally(() => setIsLoading(false));
  }, [role]);

  const filtered = materials.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.original_filename || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || m.category === filterCat;
    return matchSearch && matchCat;
  });

  const counts: Record<string, number> = { all: materials.length };
  materials.forEach((m) => { counts[m.category || "other"] = (counts[m.category || "other"] || 0) + 1; });

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-8 w-8 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
        <p className="text-sm text-slate-400">Memuat materi...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Materi Pembelajaran</h1>
          <p className="text-sm text-slate-400 mt-0.5">{materials.length} materi tersedia</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`px-3 py-2 text-xs font-medium transition ${viewMode === "grid" ? "bg-sky-50 text-sky-600" : "text-slate-400 hover:text-slate-600"}`}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
            </button>
            <button onClick={() => setViewMode("list")} className={`px-3 py-2 text-xs font-medium transition ${viewMode === "list" ? "bg-sky-50 text-sky-600" : "text-slate-400 hover:text-slate-600"}`}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
            </button>
          </div>
          {role === "teacher" && (
            <Link href="/materials/upload" className="rounded-2xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition">
              + Upload
            </Link>
          )}
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input type="text" placeholder="Cari materi..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-100 transition" />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { key: "all", icon: "📁", label: `Semua (${counts.all})` },
            ...Object.entries(CAT).map(([k, v]) => ({ key: k, icon: v.icon, label: `${v.label} (${counts[k] || 0})` })),
          ].map((it) => (
            <button key={it.key} onClick={() => setFilterCat(it.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition
                ${filterCat === it.key ? "bg-sky-500 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-sky-50"}`}>
              <span className="text-sm">{it.icon}</span>{it.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80">
          <p className="text-5xl mb-4">📂</p>
          <p className="font-bold text-slate-600">{materials.length === 0 ? "Belum ada materi" : "Tidak ada materi yang cocok"}</p>
          <p className="text-sm text-slate-400 mt-1">{materials.length === 0 ? "Materi yang diunggah akan muncul di sini" : "Coba kata kunci atau filter lain"}</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((m) => <MaterialCard key={m.id} m={m} />)}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => <MaterialRow key={m.id} m={m} />)}
        </div>
      )}
    </div>
  );
}
