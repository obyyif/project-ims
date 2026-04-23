"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const materialData = {
  title: "Responsive Design With CSS",
  subject: "Web Development",
  teacher: "Andriansyah Maulana",
  duration: "90 menit",
  school: "SMKN 1 Garut",
  level: "Intermediate",
  description: [
    "Tampilan kurikulum lengkap yang mencakup pemutar video di bagian atas untuk tutorial.",
    "Fokus pada detail satu materi spesifik dengan deskripsi bersih dan navigasi intuitif.",
    "Mencakup konsep dasar media queries, flexbox, dan grid layout untuk membangun website yang responsif.",
  ],
  resources: [
    { name: "Panduan_Responsive_CSS.pdf", type: "PDF", size: "5.2 MB" },
    { name: "Video Tutorial Konfigurasi", type: "VIDEO", duration: "01:33:00" },
  ],
};

export default function MaterialDetailPage() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/materials" className="text-slate-400 hover:text-sky-500 transition">
          Materi
        </Link>
        <svg className="h-4 w-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        <span className="text-slate-700 font-medium truncate">{materialData.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hero / Thumbnail */}
          <div className="relative h-48 sm:h-64 md:h-72 rounded-3xl overflow-hidden card-float group">
            <Image
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800"
              alt="Course thumbnail"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-2xl bg-sky-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
              {materialData.level}
            </span>
            {/* Play button overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-xl transition-transform hover:scale-110 active:scale-95">
                {isPlaying ? (
                  <div className="flex gap-1.5">
                    <div className="h-5 w-1.5 rounded-full bg-sky-500" />
                    <div className="h-5 w-1.5 rounded-full bg-sky-500" />
                  </div>
                ) : (
                  <svg className="h-6 w-6 text-sky-500 ml-1" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                )}
              </div>
            </button>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl leading-tight">
              {materialData.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                {materialData.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {materialData.school}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-3xl bg-white p-6 card-float">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Deskripsi
            </h3>
            <div className="space-y-3">
              {materialData.description.map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-400" />
                  <p className="text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Teacher Card */}
          <div className="rounded-3xl bg-white p-6 card-float">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Pengajar
            </h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                A
              </div>
              <div>
                <p className="font-bold text-slate-900">{materialData.teacher}</p>
                <p className="text-xs text-slate-400">{materialData.subject}</p>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="rounded-3xl bg-white p-6 card-float">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Resources
            </h3>
            <div className="space-y-3">
              {materialData.resources.map((res, i) => (
                <button
                  key={i}
                  onClick={() => alert(`Download: ${res.name}`)}
                  className={`w-full flex items-center gap-3 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 active:scale-[0.98] ${
                    res.type === "PDF"
                      ? "border-rose-100 bg-rose-50/50 hover:bg-rose-50"
                      : "border-sky-100 bg-sky-50/50 hover:bg-sky-50"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    res.type === "PDF" ? "bg-white text-rose-500" : "bg-white text-sky-500"
                  } shadow-sm`}>
                    {res.type === "PDF" ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    )}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{res.name}</p>
                    <p className="text-xs text-slate-400">
                      {res.type === "PDF" ? res.size : res.duration} • {res.type}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setIsCompleted(!isCompleted)}
            className={`w-full rounded-2xl py-4 font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-[0.97] ${
              isCompleted
                ? "bg-emerald-500 text-white shadow-emerald-200"
                : "bg-sky-500 text-white shadow-sky-200 hover:bg-sky-600"
            }`}
          >
            {isCompleted ? "✓ Selesai" : "Tandai Selesai"}
          </button>
        </div>
      </div>
    </div>
  );
}
