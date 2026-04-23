"use client";

import { useState } from "react";

const assignments = [
  {
    id: 1, category: "Network & Security", title: "Configuring PPL 2", desc: "Praktek Lab PPL 2 for packet switching",
    deadline: "Hari ini, 17:00", urgency: "4j lagi", urgencyColor: "text-rose-500", status: "To Do", statusColor: "bg-slate-100 text-slate-700",
  },
  {
    id: 2, category: "Mechanical Engineering", title: "Rapat Penting PPL 2", desc: "3 files terlampir",
    deadline: "Besok", urgency: "Besok", urgencyColor: "text-amber-500", status: "In Progress", statusColor: "bg-sky-50 text-sky-600",
  },
];

const nextWeek = [
  { id: 3, category: "Basic Laravel", title: "Technical Meeting", deadline: "28 Oktober 2026" },
];

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState("History");
  const [activeFilter, setActiveFilter] = useState("All Subject");
  const filters = ["All Subject", "Priority", "PPL"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tugas</h1>
        <p className="text-sm text-slate-400 mt-1">Kelola dan pantau tugas kelas</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
        {["History", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-semibold transition ${
              activeFilter === f
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                : "bg-white text-slate-500 card-float hover:bg-slate-50"
            }`}
          >
            {f === "Priority" ? "! Priority" : f}
          </button>
        ))}
      </div>

      {/* Due Soon */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900">Segera Deadline</h3>
          <span className="text-xs font-semibold text-sky-500">{assignments.length} Pending</span>
        </div>
        <div className="space-y-3">
          {assignments.map((a) => (
            <div key={a.id} className="rounded-3xl bg-white p-5 card-float transition hover:-translate-y-0.5">
              <p className="text-xs font-semibold text-sky-500">{a.category}</p>
              <h4 className="mt-1 font-bold text-slate-900">{a.title}</h4>
              <p className="mt-1 text-xs text-slate-400">{a.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">{a.deadline}</span>
                <span className={`text-xs font-bold ${a.urgencyColor}`}>{a.urgency}</span>
              </div>
              <div className="mt-3">
                <span className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${a.statusColor}`}>
                  {a.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Week */}
      <div>
        <h3 className="font-bold text-slate-900 mb-3">Minggu Depan</h3>
        <div className="space-y-3">
          {nextWeek.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-3xl bg-white p-5 card-float">
              <div>
                <p className="text-xs text-slate-400">{a.category}</p>
                <h4 className="mt-1 font-bold text-slate-900">{a.title}</h4>
                <p className="mt-1 text-xs text-slate-400">Deadline: {a.deadline}</p>
              </div>
              <span className="text-3xl">📘</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
