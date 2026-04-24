"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function MaterialsPage() {
  const { role } = useAuth();
  const [search, setSearch] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Stats
  const [totalItems, setTotalItems] = useState(0);
  const [completedItems, setCompletedItems] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const endpoint = role === "teacher" 
          ? "/teacher/materials" 
          : "/student/materials";
          
        const response = await api.get(endpoint);
        
        if (response.data && response.data.data) {
          // Grouping by subject or module
          // Since basic API might just return a flat array, we group by subject name temporarily
          const rawData = response.data.data;
          
          let groups: Record<string, any[]> = {};
          rawData.forEach((item: any) => {
            const subjectName = item.schedule?.subject?.name || "Lainnya";
            if (!groups[subjectName]) groups[subjectName] = [];
            groups[subjectName].push({
              id: item.id,
              title: item.title,
              size: "Unknown Size",
              type: item.file_path ? "PDF" : "LINK",
              completed: false, // Student tracking might depend on views later
            });
          });

          const formattedModules = Object.keys(groups).map((key, i) => ({
            id: `mod-${i}`,
            title: `Module: ${key}`,
            items: groups[key]
          }));

          setModules(formattedModules);

          // Update stats
          const t = rawData.length;
          setTotalItems(t);
          setCompletedItems(0); // Demo default
          setProgress(0);
        }
      } catch (error) {
        console.error("Failed to fetch materials", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (role) fetchMaterials();

    const handleRefresh = () => fetchMaterials();
    window.addEventListener('refresh-materials', handleRefresh);
    return () => window.removeEventListener('refresh-materials', handleRefresh);
  }, [role]);

  const isTeacher = role === 'teacher';

  if (isLoading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Memuat materi...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Materi Pembelajaran</h1>
          <p className="text-sm text-slate-400 mt-1">Akses seluruh materi kelas Anda</p>
        </div>
        {isTeacher && (
          <button 
            onClick={() => window.dispatchEvent(new Event('open-upload-material'))}
            className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98]"
          >
            + Upload Materi
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="rounded-3xl bg-white p-6 card-float">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-slate-900">Progress Materi</p>
          <span className="text-sm text-slate-500">{completedItems}/{totalItems} Materi</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">{progress}% silabus selesai</p>
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

      {/* Modules */}
      <div className="space-y-6">
        {modules.map((mod) => (
          <div key={mod.id}>
            <h3 className="text-sm font-bold text-slate-700 mb-3">{mod.title}</h3>

            {"locked" in mod && mod.locked ? (
              <div className="rounded-3xl bg-slate-100 border border-slate-200 p-6 text-center">
                <p className="text-2xl mb-2">🔒</p>
                <p className="text-sm font-semibold text-slate-500">
                  Selesaikan modul sebelumnya untuk membuka
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {mod.items
                  .filter((item: any) =>
                    item.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/materials/${item.id}`}
                      className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-4 transition-all hover:border-sky-100 hover:bg-sky-50/30 hover:-translate-y-0.5 card-float"
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl shrink-0 ${
                          item.type === "PDF"
                            ? "bg-rose-50 text-rose-500"
                            : "bg-violet-50 text-violet-500"
                        }`}
                      >
                        {item.type === "PDF" ? (
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>
                        ) : (
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.size} • {item.type}
                        </p>
                      </div>

                      {/* Status */}
                      {item.completed ? (
                        <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                      ) : (
                        <span className="shrink-0 rounded-xl bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
                          {item.type === "PDF" ? "Buka" : "Tonton"}
                        </span>
                      )}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
