"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
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

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/** Strip batch suffix like " (1)", " (2)" to get base title */
function baseTitle(title: string): string {
  return title.replace(/\s*\(\d+\)\s*$/, "").trim();
}

/** Group materials by base title + classroom */
interface MaterialGroup {
  key: string;
  title: string;
  description?: string;
  classroom?: { id: string; name: string };
  teacher?: { id: string; name: string };
  files: CourseMaterial[];
  categories: Set<string>;
  totalSize: number;
  latestDate: string;
  representativeId: string; // ID of first material — used for URL
}

function groupMaterials(materials: CourseMaterial[]): MaterialGroup[] {
  const map = new Map<string, MaterialGroup>();

  for (const m of materials) {
    const base = baseTitle(m.title);
    const classId = m.classroom?.id || "none";
    const key = `${base}__${classId}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        title: base,
        description: m.description,
        classroom: m.classroom,
        teacher: m.teacher,
        files: [],
        categories: new Set(),
        totalSize: 0,
        latestDate: m.created_at,
        representativeId: m.id,
      });
    }

    const g = map.get(key)!;
    g.files.push(m);
    g.categories.add(m.category || "other");
    g.totalSize += m.file_size || 0;
    if (m.created_at > g.latestDate) g.latestDate = m.created_at;
  }

  return Array.from(map.values()).sort((a, b) => b.latestDate.localeCompare(a.latestDate));
}

// ── Grid Card (group) ──
function GroupCard({ g }: { g: MaterialGroup }) {
  const cats = Array.from(g.categories);
  const mainCat = CAT[cats[0]] || CAT.other;
  return (
    <Link href={`/materials/${g.representativeId}`}
      className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white overflow-hidden cursor-pointer transition-all hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5">
      <div className={`relative h-24 flex items-center justify-center ${mainCat.bg}`}>
        <div className="flex items-center gap-2">
          {cats.slice(0, 3).map((c) => (
            <span key={c} className="text-3xl">{CAT[c]?.icon || "📦"}</span>
          ))}
        </div>
        <div className="absolute top-2 right-2 rounded-lg bg-white/80 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-slate-600">
          {g.files.length} file
        </div>
      </div>
      <div className="p-3 min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-sky-600 transition">{g.title}</p>
        {g.description && <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{g.description}</p>}
        <div className="flex items-center gap-2 mt-2">
          {g.classroom && <span className="text-[10px] text-slate-500 bg-slate-100 rounded-md px-1.5 py-0.5 font-medium">{g.classroom.name}</span>}
          <span className="text-[10px] text-slate-400">{fmtSize(g.totalSize)}</span>
        </div>
      </div>
    </Link>
  );
}

// ── List Row (group) ──
function GroupRow({ g }: { g: MaterialGroup }) {
  const cats = Array.from(g.categories);
  const mainCat = CAT[cats[0]] || CAT.other;
  return (
    <Link href={`/materials/${g.representativeId}`}
      className="flex items-center gap-4 rounded-2xl bg-white p-4 border border-slate-200/80 cursor-pointer transition-all hover:border-sky-200 hover:shadow-sm hover:-translate-y-0.5 group">
      <div className={`h-12 w-12 rounded-xl ${mainCat.bg} flex items-center justify-center shrink-0`}>
        <span className="text-xl">{mainCat.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate group-hover:text-sky-600 transition">{g.title}</p>
        {g.description ? (
          <p className="text-[11px] text-slate-400 truncate">{g.description}</p>
        ) : (
          <p className="text-[11px] text-slate-400">{g.files.length} file • {fmtSize(g.totalSize)}</p>
        )}
      </div>
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        {g.classroom && <span className="text-[10px] font-medium text-slate-500 bg-slate-100 rounded-lg px-2 py-1">{g.classroom.name}</span>}
        <div className="flex -space-x-1">
          {cats.slice(0, 3).map((c) => (
            <span key={c} className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${CAT[c]?.bg || "bg-slate-100"}`}>
              {CAT[c]?.icon || "📦"}
            </span>
          ))}
        </div>
        <span className="text-[11px] text-slate-400 w-16 text-right">{g.files.length} file</span>
        <span className="text-[11px] text-slate-400 w-24 text-right">{fmtDate(g.latestDate)}</span>
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
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    const ep = role === "teacher" ? "/teacher/materials" : "/student/materials";
    api.get(ep)
      .then((r) => setMaterials(r.data?.data || []))
      .catch((err) => console.error("Failed to fetch materials", err))
      .finally(() => setIsLoading(false));
  }, [role]);

  const groups = groupMaterials(materials);
  const filtered = groups.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    (g.description || "").toLowerCase().includes(search.toLowerCase()) ||
    (g.classroom?.name || "").toLowerCase().includes(search.toLowerCase())
  );

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
          <p className="text-sm text-slate-400 mt-0.5">{groups.length} materi • {materials.length} file</p>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        <input type="text" placeholder="Cari materi, deskripsi, atau kelas..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-100 transition" />
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80">
          <p className="text-5xl mb-4">📂</p>
          <p className="font-bold text-slate-600">{groups.length === 0 ? "Belum ada materi" : "Tidak ada materi yang cocok"}</p>
          <p className="text-sm text-slate-400 mt-1">{groups.length === 0 ? "Materi yang diunggah akan muncul di sini" : "Coba kata kunci lain"}</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((g) => <GroupCard key={g.key} g={g} />)}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((g) => <GroupRow key={g.key} g={g} />)}
        </div>
      )}
    </div>
  );
}
