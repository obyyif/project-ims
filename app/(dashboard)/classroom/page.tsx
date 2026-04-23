"use client";

import { useState } from "react";

const leaders = [
  { name: "Junior NN", role: "Ketua Kelas", img: "J" },
  { name: "Gabrin Muhammad", role: "Sekretaris", img: "G" },
  { name: "Diva Paskib", role: "Bendahara", img: "D" },
];

const classmates = [
  { name: "Rifki Pratama", id: "ID: 075654324", img: "R" },
  { name: "Fawwaz Baskara", id: "ID: 054354324", img: "F" },
  { name: "Ahmad Fadlan", id: "ID: 043256789", img: "A" },
  { name: "Siti Nurjanah", id: "ID: 087654321", img: "S" },
  { name: "Rizky Maulana", id: "ID: 065432198", img: "R" },
];

const avatarColors = [
  "bg-sky-500", "bg-violet-500", "bg-amber-500", "bg-emerald-500",
  "bg-rose-500", "bg-indigo-500", "bg-cyan-500", "bg-pink-500",
];

export default function ClassroomPage() {
  const [activeTab, setActiveTab] = useState("Students");
  const [search, setSearch] = useState("");

  const filteredClassmates = classmates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Detail Kelas</h1>
        <p className="text-sm text-slate-400 mt-1">Informasi kelas dan anggota</p>
      </div>

      {/* Class Info Card */}
      <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 p-6 text-white card-float-lg">
        <p className="text-xs text-sky-100 font-medium uppercase tracking-wider">Vocational High School</p>
        <h2 className="mt-2 text-xl font-bold">XI - Pengembangan Perangkat Lunak Dan Gim</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-sky-100">
          <span className="flex items-center gap-1.5">📅 Tahun Ajaran 2026/2027</span>
          <span className="flex items-center gap-1.5">👥 34 siswa</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {["Students", "Subject"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 ${
              activeTab === tab
                ? "text-sky-600 border-sky-500"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        <input
          type="text"
          placeholder="Cari siswa atau jabatan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm placeholder:text-slate-400 transition-all focus:border-sky-400 focus:bg-white"
        />
      </div>

      {/* Leaders */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3">Pengurus Kelas</h3>
        <div className="space-y-2">
          {leaders.map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl bg-white p-4 card-float">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                  {s.img}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                  <span className="inline-block mt-0.5 rounded-lg bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-600">
                    {s.role}
                  </span>
                </div>
              </div>
              <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                💬
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Classmates */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3">Anggota Kelas</h3>
        <div className="space-y-2">
          {filteredClassmates.map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl bg-white p-4 card-float">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${avatarColors[(i + 3) % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                  {c.img}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
