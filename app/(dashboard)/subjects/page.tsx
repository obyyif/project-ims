"use client";

import { useState } from "react";

const coreVocational = [
  { id: 1, title: "Web Development", teacher: "Bpk. Andriansyah Maulana", icon: "🌐", color: "from-sky-500 to-cyan-400" },
  { id: 2, title: "Flutter", teacher: "Ibu. Revy Cahya", icon: "💙", color: "from-blue-500 to-indigo-400" },
  { id: 3, title: "Database System", teacher: "Bpk. Asep Ulumudin", icon: "🗄️", color: "from-violet-500 to-purple-400" },
];

const generalEducation = [
  { id: 4, title: "Profesional Matematika", teacher: "Ibu. Heti Kusmawati", icon: "🧠", color: "from-amber-400 to-orange-400" },
];

export default function SubjectsPage() {
  const [activeSemester, setActiveSemester] = useState("Current");
  const semesters = ["Current", "Semester 1", "Semester 2"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mata Pelajaran</h1>
        <p className="text-sm text-slate-400 mt-1">Daftar mata pelajaran semester aktif</p>
      </div>

      {/* Semester tabs */}
      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1">
        {semesters.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSemester(tab)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
              activeSemester === tab
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Core Vocational */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Core Vocational</h2>
            <div className="mt-1 h-0.5 w-16 rounded-full bg-sky-500" />
          </div>
          <span className="rounded-2xl bg-sky-100 px-3 py-1 text-xs font-bold text-sky-600">
            {coreVocational.length} Mapel
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coreVocational.map((sub) => (
            <div key={sub.id} className="rounded-3xl bg-white p-5 card-float transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{sub.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{sub.teacher}</p>
                  <button className="mt-4 rounded-2xl bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 active:scale-[0.97]">
                    Lihat Materi
                  </button>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-3xl shrink-0">
                  {sub.icon}
                </div>
              </div>
              <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${sub.color}`} />
            </div>
          ))}
        </div>
      </div>

      {/* General Education */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">General Education</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {generalEducation.map((sub) => (
            <div key={sub.id} className="rounded-3xl bg-white p-5 card-float transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{sub.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{sub.teacher}</p>
                  <button className="mt-4 rounded-2xl bg-sky-100 px-4 py-2 text-xs font-bold text-sky-600 transition hover:bg-sky-200 active:scale-[0.97]">
                    Lihat Materi
                  </button>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-3xl shrink-0">
                  {sub.icon}
                </div>
              </div>
              <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${sub.color}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
