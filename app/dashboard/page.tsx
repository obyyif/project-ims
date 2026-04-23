"use client";

import Link from "next/link";
import { useState } from "react";

const initialSchedule = [
  { id: "ppl-2", title: "Kelas XI - PPL 2", time: "06.00 - 09.30", location: "Lab PPL" },
  { id: "ppl-1", title: "Kelas XI - PPL 1", time: "06.00 - 07.00", location: "Kelas Letter U" },
  { id: "ppl-3", title: "Kelas XI - PPL 3", time: "09.45 - 12.30", location: "Lab PPL" },
  { id: "ppl-4", title: "Kelas XI - PPL 4", time: "13.00 - 15.45", location: "Ruang Teori" },
];

const initialMaterials = [
  { id: "database", title: "Database", progress: 50, teacher: "Andriansyah Maulana", color: "from-sky-500 to-cyan-400" },
  { id: "mysql", title: "MySql", progress: 65, teacher: "Andriansyah Maulana", color: "from-orange-400 to-orange-500" },
  { id: "laravel", title: "Laravel", progress: 25, teacher: "Andriansyah Maulana", color: "from-violet-400 to-fuchsia-500" },
  { id: "filament", title: "Filament", progress: 30, teacher: "Andriansyah Maulana", color: "from-slate-300 to-slate-400" },
];

export default function DashboardPage() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [materials, setMaterials] = useState(initialMaterials);
  const [activeScheduleEdit, setActiveScheduleEdit] = useState<string | null>(null);
  const [activeMaterialEdit, setActiveMaterialEdit] = useState<string | null>(null);
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const [newScheduleTitle, setNewScheduleTitle] = useState("");
  const [newScheduleTime, setNewScheduleTime] = useState("");
  const [newScheduleLocation, setNewScheduleLocation] = useState("");

  const handleScheduleChange = (id: string, field: string, value: string) => {
    setSchedule((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleMaterialChange = (id: string, field: string, value: string) => {
    setMaterials((current) => current.map((item) => (item.id === id ? { ...item, [field]: field === "progress" ? Number(value) : value } : item)));
  };

  const handleAddSchedule = () => {
    if (!newScheduleTitle || !newScheduleTime || !newScheduleLocation) return;
    const newId = `schedule-${Date.now()}`;
    setSchedule((current) => [
      ...current,
      {
        id: newId,
        title: newScheduleTitle,
        time: newScheduleTime,
        location: newScheduleLocation,
      },
    ]);
    setNewScheduleTitle("");
    setNewScheduleTime("");
    setNewScheduleLocation("");
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedule((current) => current.filter((item) => item.id !== id));
  };

  const displaySchedule = showAllSchedules ? schedule : schedule.slice(0, 2);

  return (
    <main className="min-h-screen bg-sky-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-xl space-y-6">
        <header className="rounded-4xl bg-sky-600 p-6 text-white shadow-[0_25px_70px_rgba(14,165,233,0.18)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-sky-100">Dashboard</p>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Hello, Andriansyah!</h1>
              <p className="mt-2 text-sm text-sky-100/90">Guru, SMKN 1 GARUT PPL</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-sky-700 shadow-xl shadow-sky-200/40">
              <span className="text-xl font-semibold">A</span>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-4xl bg-white p-6 shadow-[0_18px_60px_rgba(14,165,233,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-500">Tingkat Kehadiran</p>
            <p className="mt-4 text-4xl font-semibold text-sky-700">100%</p>
          </div>
          <div className="rounded-4xl bg-sky-50 p-6 shadow-[0_18px_60px_rgba(14,165,233,0.08)] border border-sky-100">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Tambah Tugas</p>
            <p className="mt-4 text-4xl font-semibold text-sky-900">15/15</p>
          </div>
        </section>

        <section className="rounded-4xl bg-white p-6 shadow-[0_25px_70px_rgba(14,165,233,0.08)] border-t-4 border-sky-500/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Jadwal Hari Ini</h2>
              <p className="text-sm text-slate-500">Class Schedule</p>
            </div>
            <button onClick={() => setShowAllSchedules(!showAllSchedules)} className="rounded-full border border-sky-100 px-4 py-2 text-sm text-sky-700 transition hover:bg-sky-50">
              {showAllSchedules ? "Sembunyikan" : "View All"}
            </button>
          </div>

          {showAllSchedules && (
            <div className="mt-6 rounded-3xl bg-sky-50 p-4 border border-sky-100">
              <h3 className="text-lg font-semibold text-slate-950 mb-4">Tambah Jadwal Baru</h3>
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Nama Kelas"
                  value={newScheduleTitle}
                  onChange={(e) => setNewScheduleTitle(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  placeholder="Waktu (contoh: 06.00 - 09.30)"
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  placeholder="Tempat"
                  value={newScheduleLocation}
                  onChange={(e) => setNewScheduleLocation(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
                <button onClick={handleAddSchedule} className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
                  Tambah Jadwal
                </button>
              </div>
            </div>
          )}

          <div className={`mt-6 ${showAllSchedules ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}`}>
            {displaySchedule.map((item) => (
              <div key={item.id} className="rounded-3xl border border-sky-100 bg-sky-50 p-4 shadow-sm">
                {activeScheduleEdit === item.id ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-900">Nama Kelas</label>
                    <input
                      value={item.title}
                      onChange={(event) => handleScheduleChange(item.id, "title", event.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                    />
                    <label className="block text-sm font-semibold text-slate-900">Waktu</label>
                    <input
                      value={item.time}
                      onChange={(event) => handleScheduleChange(item.id, "time", event.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                    />
                    <label className="block text-sm font-semibold text-slate-900">Tempat</label>
                    <input
                      value={item.location}
                      onChange={(event) => handleScheduleChange(item.id, "location", event.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                    />
                    <button type="button" onClick={() => setActiveScheduleEdit(null)} className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 h-28 rounded-3xl bg-linear-to-br from-slate-900 via-slate-700 to-slate-800" />
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {item.time} · {item.location}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button type="button" onClick={() => setActiveScheduleEdit(item.id)} className="flex-1 rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
                        Edit
                      </button>
                      {showAllSchedules && (
                        <button type="button" onClick={() => handleDeleteSchedule(item.id)} className="flex-1 rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 border border-red-200">
                          Hapus
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-4xl bg-sky-50 p-6 shadow-[0_25px_70px_rgba(14,165,233,0.08)] border border-sky-100">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">Materi</h2>
            <span className="text-sm text-sky-600">Progress</span>
          </div>
          <div className="space-y-4">
            {materials.map((item) => (
              <div key={item.id} className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm">
                {activeMaterialEdit === item.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900">Materi</label>
                      <input
                        value={item.title}
                        onChange={(event) => handleMaterialChange(item.id, "title", event.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900">Pengajar</label>
                      <input
                        value={item.teacher}
                        onChange={(event) => handleMaterialChange(item.id, "teacher", event.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900">Progress (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.progress}
                        onChange={(event) => handleMaterialChange(item.id, "progress", event.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                      />
                    </div>
                    <button type="button" onClick={() => setActiveMaterialEdit(null)} className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-950">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.teacher}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{item.progress}%</span>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full bg-linear-to-r ${item.color}`} style={{ width: `${item.progress}%` }} />
                    </div>
                    <button type="button" onClick={() => setActiveMaterialEdit(item.id)} className="mt-4 rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
                      Edit
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <nav className="sticky bottom-0 z-10 rounded-4xl bg-white/95 px-4 py-4 shadow-[0_-18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6">
          <div className="grid grid-cols-2 gap-2 text-center text-sm text-slate-600 sm:grid-cols-4">
            {[
              { label: "Home", href: "/dashboard" },
              { label: "Students", href: "#" },
              { label: "Courses", href: "#" },
              { label: "Profile", href: "/profile" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="rounded-3xl px-3 py-3 transition hover:bg-slate-100">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
}
