"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { CourseMaterial, MaterialCategory } from "@/types/api";

// ── Helpers ──
function fmtSize(b?: number): string {
  if (!b) return "-";
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}
function ext(f?: string) { return f?.split(".").pop()?.toLowerCase() || ""; }

const CAT: Record<string, { icon: string; label: string; color: string; bg: string; tbg: string }> = {
  document: { icon: "📄", label: "Dokumen", color: "text-blue-600", bg: "bg-blue-50", tbg: "bg-blue-100" },
  image: { icon: "🖼️", label: "Gambar", color: "text-emerald-600", bg: "bg-emerald-50", tbg: "bg-emerald-100" },
  video: { icon: "🎬", label: "Video", color: "text-purple-600", bg: "bg-purple-50", tbg: "bg-purple-100" },
  other: { icon: "📦", label: "Lainnya", color: "text-orange-600", bg: "bg-orange-50", tbg: "bg-orange-100" },
};

const PREVIEWABLE = new Set(["pdf","png","jpg","jpeg","gif","webp","svg","mp4","webm","mov","txt","md","markdown","csv","json","xml"]);
function canPreview(m: CourseMaterial) {
  const e = ext(m.original_filename);
  if (m.category === "image" || m.category === "video") return true;
  return PREVIEWABLE.has(e);
}

// ── Context Menu ──
function CtxMenu({ x, y, items, onClose }: { x: number; y: number; items: { label: string; icon: string; action: () => void; danger?: boolean }[]; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[70]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div className="fixed z-[71] w-52 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 animate-fade-up" style={{ left: x, top: y }}>
        {items.map((it, i) => (
          <button key={i} onClick={() => { it.action(); onClose(); }}
            className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition hover:bg-slate-50 ${it.danger ? "text-rose-500" : "text-slate-700"}`}>
            <span className="text-sm">{it.icon}</span>{it.label}
          </button>
        ))}
      </div>
    </>
  );
}

// ── Preview Overlay ──
function PreviewOverlay({ material, materials, onClose, onNavigate, role }: {
  material: CourseMaterial; materials: CourseMaterial[];
  onClose: () => void; onNavigate: (m: CourseMaterial) => void; role?: string;
}) {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const idx = materials.findIndex((m) => m.id === material.id);
  const prev = idx > 0 ? materials[idx - 1] : null;
  const next = idx < materials.length - 1 ? materials[idx + 1] : null;
  const e = ext(material.original_filename);
  const isImage = material.category === "image";
  const isVideo = material.category === "video";
  const isPdf = e === "pdf";
  const isText = ["txt","md","markdown","csv","json","xml"].includes(e);
  const fileUrl = material.file_url || material.download_url;

  useEffect(() => {
    if (isText && material.id) {
      const endpoint = role === "teacher" ? `/teacher/materials/${material.id}` : `/student/materials/${material.id}/content`;
      if (role === "teacher") {
        // For teacher, fetch file directly
        if (fileUrl) fetch(fileUrl).then(r => r.text()).then(setTextContent).catch(() => setTextContent("Gagal memuat konten."));
      } else {
        api.get(endpoint).then(r => setTextContent(r.data?.content || "")).catch(() => setTextContent("Gagal memuat konten."));
      }
    }
  }, [material.id, isText, role, fileUrl]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
      if (ev.key === "ArrowLeft" && prev) onNavigate(prev);
      if (ev.key === "ArrowRight" && next) onNavigate(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate, prev, next]);

  const download = () => { if (fileUrl) { const a = document.createElement("a"); a.href = fileUrl; a.download = material.original_filename || "file"; a.click(); } };

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/70" onClick={onClose} />
      <div className="fixed inset-4 z-[81] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 shrink-0">
          <span className="text-lg">{CAT[material.category || "other"]?.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{material.title}</p>
            <p className="text-[11px] text-slate-400">{material.original_filename} • {fmtSize(material.file_size)}</p>
          </div>
          <button onClick={download} className="rounded-xl bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600 hover:bg-sky-100 transition">📥 Download</button>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center relative">
          {/* Nav arrows */}
          {prev && <button onClick={() => onNavigate(prev)} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 shadow p-2 text-slate-600 hover:bg-white transition"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg></button>}
          {next && <button onClick={() => onNavigate(next)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 shadow p-2 text-slate-600 hover:bg-white transition"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></button>}

          {isImage && fileUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fileUrl} alt={material.title} className="max-w-full max-h-full object-contain p-4" />
          ) : isVideo && fileUrl ? (
            <div className="w-full max-w-4xl p-4">
              <div className="relative rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
                <video controls className="absolute inset-0 w-full h-full object-contain" preload="metadata" onError={() => setBroken(true)}>
                  <source src={fileUrl} type={material.file_type || "video/mp4"} />
                  {material.subtitle_url && <track kind="subtitles" src={material.subtitle_url} srcLang="id" label="Indonesia" default />}
                </video>
              </div>
              {broken && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                  <span className="text-amber-500">⚠️</span>
                  <p className="text-xs text-amber-700">Video tidak dapat diputar. Silakan hubungi guru pengampu.</p>
                </div>
              )}
            </div>
          ) : isPdf && fileUrl ? (
            <iframe src={fileUrl} className="w-full h-full border-0" title={material.title} />
          ) : isText ? (
            <div className="w-full max-w-3xl p-6">
              <pre className="bg-white rounded-xl border border-slate-200 p-5 text-sm text-slate-700 whitespace-pre-wrap font-mono overflow-auto max-h-[70vh]">
                {textContent === null ? "Memuat..." : textContent}
              </pre>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="text-5xl mb-4">{CAT[material.category || "other"]?.icon}</div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Preview tidak tersedia</p>
              <p className="text-xs text-slate-400 mb-4">File .{e} tidak dapat dipratinjau. Silakan download untuk membuka.</p>
              <button onClick={download} className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition">
                📥 Download {material.original_filename}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-slate-100 text-xs text-slate-400 shrink-0">
          <span>{idx + 1} / {materials.length}</span>
          <span>← → untuk navigasi • Esc untuk tutup</span>
        </div>
      </div>
    </>
  );
}

// ── File Card ──
function FileCard({ m, selected, onClick, onDoubleClick, onContextMenu }: {
  m: CourseMaterial; selected: boolean;
  onClick: (e: React.MouseEvent) => void; onDoubleClick: () => void; onContextMenu: (e: React.MouseEvent) => void;
}) {
  const c = CAT[m.category || "other"] || CAT.other;
  const e = ext(m.original_filename);
  const isImg = m.category === "image";
  return (
    <div
      onClick={onClick} onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
      className={`group flex flex-col rounded-2xl border overflow-hidden cursor-pointer transition-all select-none
        ${selected ? "border-sky-400 ring-2 ring-sky-200 shadow-md" : "border-slate-200/80 bg-white hover:border-sky-200 hover:shadow-sm hover:-translate-y-0.5"}`}
    >
      <div className={`relative h-32 flex items-center justify-center ${isImg && m.file_url ? "" : c.tbg}`}>
        {isImg && m.file_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.file_url} alt={m.title} className="w-full h-full object-cover" />
        ) : m.category === "video" ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-sm">
              <svg className="h-5 w-5 text-purple-500 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21" /></svg>
            </div>
            <span className="text-[10px] font-bold text-purple-400 uppercase">{e}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <span className="rounded-xl px-2.5 py-1.5 text-sm font-black text-slate-500 bg-white/60">.{e || "?"}</span>
            <span className="text-[10px] text-slate-400">{fmtSize(m.file_size)}</span>
          </div>
        )}
        <span className={`absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${c.bg} ${c.color}`}>{c.label}</span>
        {selected && <div className="absolute top-2 left-2 h-5 w-5 rounded-full bg-sky-500 flex items-center justify-center"><svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></div>}
      </div>
      <div className="p-2.5 min-w-0">
        <p className="text-xs font-semibold text-slate-900 truncate">{m.title}</p>
        <p className="text-[10px] text-slate-400 truncate mt-0.5">{m.original_filename}</p>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function MaterialsPage() {
  const { role } = useAuth();
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<CourseMaterial | null>(null);
  const [ctx, setCtx] = useState<{ x: number; y: number; material?: CourseMaterial } | null>(null);
  const lastClickRef = useRef<string | null>(null);
  const isTeacher = role === "teacher";

  const fetchMaterials = useCallback(async () => {
    if (!role) return;
    setIsLoading(true);
    try {
      const ep = isTeacher ? "/teacher/materials" : "/student/materials";
      const res = await api.get(ep);
      setMaterials(res.data?.data || []);
    } catch { /* empty */ } finally { setIsLoading(false); }
  }, [role, isTeacher]);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  const filtered = materials.filter((m) => {
    const s = m.title.toLowerCase().includes(search.toLowerCase()) || (m.original_filename || "").toLowerCase().includes(search.toLowerCase());
    const c = filterCat === "all" || m.category === filterCat;
    return s && c;
  });

  const stats = { document: 0, image: 0, video: 0, other: 0 };
  materials.forEach((m) => { const k = m.category || "other"; if (k in stats) stats[k as keyof typeof stats]++; });

  // Selection
  const handleClick = (m: CourseMaterial, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      setSelected((prev) => { const n = new Set(prev); n.has(m.id) ? n.delete(m.id) : n.add(m.id); return n; });
    } else if (e.shiftKey && lastClickRef.current) {
      const ids = filtered.map(f => f.id);
      const a = ids.indexOf(lastClickRef.current);
      const b = ids.indexOf(m.id);
      const [start, end] = a < b ? [a, b] : [b, a];
      setSelected(new Set(ids.slice(start, end + 1)));
    } else {
      setSelected(new Set([m.id]));
    }
    lastClickRef.current = m.id;
  };

  // Context menu
  const handleCtx = (m: CourseMaterial, e: React.MouseEvent) => {
    e.preventDefault();
    if (!selected.has(m.id)) setSelected(new Set([m.id]));
    setCtx({ x: Math.min(e.clientX, window.innerWidth - 220), y: Math.min(e.clientY, window.innerHeight - 200), material: m });
  };

  const downloadFile = (m: CourseMaterial) => {
    const url = m.file_url || m.download_url;
    if (url) { const a = document.createElement("a"); a.href = url; a.download = m.original_filename || "file"; document.body.appendChild(a); a.click(); a.remove(); }
  };

  const downloadSelected = () => {
    const sel = materials.filter(m => selected.has(m.id));
    sel.forEach((m, i) => setTimeout(() => downloadFile(m), i * 500));
  };

  const ctxItems = () => {
    const items: { label: string; icon: string; action: () => void; danger?: boolean }[] = [];
    if (ctx?.material && canPreview(ctx.material)) items.push({ label: "Preview", icon: "👁", action: () => setPreview(ctx.material!) });
    if (selected.size === 1 && ctx?.material) items.push({ label: "Download", icon: "📥", action: () => downloadFile(ctx.material!) });
    if (selected.size > 1) items.push({ label: `Download ${selected.size} file`, icon: "📥", action: downloadSelected });
    if (isTeacher && ctx?.material) items.push({ label: "Hapus", icon: "🗑", action: async () => {
      if (!confirm("Hapus materi ini?")) return;
      try { await api.delete(`/teacher/materials/${ctx.material!.id}`); fetchMaterials(); } catch { /* empty */ }
    }, danger: true });
    return items;
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-8 w-8 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
        <p className="text-sm text-slate-400">Memuat materi...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5" onContextMenu={(e) => { if (!(e.target as HTMLElement).closest("[data-file]")) { e.preventDefault(); setCtx(null); } }}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Materi Pembelajaran</h1>
          <p className="text-sm text-slate-400 mt-1">{materials.length} file • Double-click untuk preview</p>
        </div>
        {isTeacher && (
          <Link href="/materials/upload" className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 active:scale-[0.98] transition text-center">+ Upload</Link>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input type="text" placeholder="Cari file..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-sky-400 focus:outline-none transition" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setFilterCat("all")} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filterCat === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}>
            Semua ({materials.length})
          </button>
          {(["document","image","video","other"] as const).map((cat) => {
            if (!stats[cat]) return null;
            const c = CAT[cat];
            return <button key={cat} onClick={() => setFilterCat(filterCat === cat ? "all" : cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filterCat === cat ? "bg-slate-900 text-white" : `${c.bg} ${c.color}`}`}>
              {c.icon} {c.label} ({stats[cat]})
            </button>;
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
          <p className="text-4xl mb-3">📂</p>
          <p className="text-base font-semibold text-slate-600">{search ? "Tidak ada file yang cocok" : "Belum ada materi"}</p>
          <p className="text-sm text-slate-400 mt-1">{isTeacher && !search ? "Upload materi pertama untuk memulai" : "Coba kata kunci lain"}</p>
          {isTeacher && !search && (
            <Link href="/materials/upload" className="mt-4 inline-block rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition">+ Upload Materi</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((m) => (
            <div key={m.id} data-file>
              <FileCard m={m} selected={selected.has(m.id)}
                onClick={(e) => handleClick(m, e)}
                onDoubleClick={() => canPreview(m) ? setPreview(m) : downloadFile(m)}
                onContextMenu={(e) => handleCtx(m, e)} />
            </div>
          ))}
        </div>
      )}

      {/* Selection bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-5 py-3 shadow-2xl animate-fade-up">
          <span className="text-xs font-medium">{selected.size} file dipilih</span>
          <button onClick={downloadSelected} className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/30 transition">📥 Download</button>
          <button onClick={() => setSelected(new Set())} className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20 transition">Batal</button>
        </div>
      )}

      {/* Context Menu */}
      {ctx && <CtxMenu x={ctx.x} y={ctx.y} items={ctxItems()} onClose={() => setCtx(null)} />}

      {/* Preview Overlay */}
      {preview && <PreviewOverlay material={preview} materials={filtered} onClose={() => setPreview(null)} onNavigate={setPreview} role={role || undefined} />}
    </div>
  );
}
