"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const students = [
  {
    name: "Junior NN",
    role: "Class President",
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Gabrin muhammad",
    role: "Secretary",
    img: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "Diva Paskib",
    role: "Treasurer",
    img: "https://i.pravatar.cc/100?img=3",
  },
];

const classmates = [
  {
    name: "Rifki ee",
    id: "ID:075654324",
    img: "https://i.pravatar.cc/100?img=4",
  },
  {
    name: "Kang fawwaz bc",
    id: "ID:54354324",
    img: "https://i.pravatar.cc/100?img=5",
  },
];

export default function ClassroomDetail() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-[350px] bg-white rounded-2xl shadow-lg p-4">

        {/* Header */}
        <div className="flex items-center mb-3">
          <button
            className="text-blue-500 text-sm"
            onClick={() => router.back()}
          >
            ← Back
          </button>

          <h1 className="flex-1 text-center font-semibold">
            Classroom Detail
          </h1>
        </div>

        {/* Card */}
        <div className="bg-blue-600 text-white rounded-xl p-4">
          <p className="text-xs opacity-80">Vocational High School</p>
          <h2 className="text-lg font-bold mt-1">
            XI-Pengembangan Perangkat Lunak Dan Gim
          </h2>
          <div className="mt-3 text-sm">
            📅 Academic Year 2026/2027
          </div>
          <div className="text-sm mt-1">
            👥 34 student
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-4 border-b">
          <button
            className="text-blue-600 border-b-2 border-blue-600 pb-1 text-sm"
            onClick={() => alert("Tab Students")}
          >
            Students
          </button>

          <button
            className="text-gray-400 text-sm"
            onClick={() => alert("Tab Subject")}
          >
            Subject
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search Classmates or roles..."
          className="w-full mt-3 p-2 rounded-lg bg-gray-100 text-sm outline-none"
        />

        {/* Class Leader */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">
            Class Leader
          </h3>

          {students.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between mb-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={s.img}
                  alt={s.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">
                    {s.name}
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {s.role}
                  </span>
                </div>
              </div>

              <button
                className="text-gray-500"
                onClick={() => alert(`Chat dengan ${s.name}`)}
              >
                💬
              </button>
            </div>
          ))}
        </div>

        {/* Classmates */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">
            Classmates
          </h3>

          {classmates.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between mb-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">
                    {c.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {c.id}
                  </p>
                </div>
              </div>

              <input
                type="radio"
                onChange={() => alert(`Pilih ${c.name}`)}
              />
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg text-sm mt-3"
          onClick={() => alert("Lihat semua classmates")}
        >
          View All Classmates
        </button>

      </div>
    </div>
  );
}