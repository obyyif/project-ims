"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { CourseMaterial } from "@/types/api";

function formatFileSize(bytes?: number): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const catConfig: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  document: { icon: "📄", label: "Dokumen", color: "text-blue-600", bg: "bg-blue-50" },
  image: { icon: "🖼️", label: "Gambar", color: "text-emerald-600", bg: "bg-emerald-50" },
  video: { icon: "🎬", label: "Video", color: "text-purple-600", bg: "bg-purple-50" },
  other: { icon: "📦", label: "Lainnya", color: "text-orange-600", bg: "bg-orange-50" },
};

export default function MaterialsPage() {
  const { role } = useAuth();
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
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

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const filtered = materials.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || m.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const grouped = filtered.reduce<Record<string, CourseMaterial[]>>((acc, m) => {
    const cat = m.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

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
          <Link
            href="/materials/upload"
            className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98] text-center"
          >
            + Upload Materi
          </Link>
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

      {/* Material List */}
      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center card-float">
          <p className="text-3xl mb-3">📚</p>
          <p className="text-sm font-semibold text-slate-500">Belum ada materi</p>
          {isTeacher && (
            <Link href="/materials/upload" className="mt-3 inline-block text-sm font-bold text-sky-500 hover:text-sky-600">
              Upload materi pertama →
            </Link>
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
    </div>
  );
}
