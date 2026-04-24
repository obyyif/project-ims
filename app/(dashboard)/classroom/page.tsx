"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const avatarColors = [
  "bg-sky-500", "bg-violet-500", "bg-amber-500", "bg-emerald-500",
  "bg-rose-500", "bg-indigo-500", "bg-cyan-500", "bg-pink-500",
];

export default function ClassroomPage() {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState("Students");
  const [search, setSearch] = useState("");
  const [classroomData, setClassroomData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        let classroomId = user?.classroom_id;
        
        // If teacher, they might need to select a classroom or we fetch their primary one
        // For simplicity, we use the first available classroom id if not in user object
        if (!classroomId && role === 'teacher') {
            const resSchedules = await api.get('/teacher/schedules');
            if (resSchedules.data?.data?.length > 0) {
                classroomId = resSchedules.data.data[0].classroom_id;
            }
        }

        if (classroomId) {
            const res = await api.get(`/classrooms/${classroomId}`);
            if (res.data && res.data.data) {
                setClassroomData(res.data.data);
            }
        }
      } catch (error) {
        console.error("Failed to fetch classroom data", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user || role) fetchClassroom();
  }, [user, role]);

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400 text-sm">Memuat data kelas...</div>;
  }

  if (!classroomData) {
    return (
        <div className="text-center py-20 bg-white rounded-3xl card-float">
            <p className="text-4xl mb-4">🏫</p>
            <p className="font-bold text-slate-600">Belum tergabung dalam kelas</p>
            <p className="text-sm text-slate-400 mt-1">Hubungi admin untuk info lebih lanjut</p>
        </div>
    );
  }

  const students = classroomData.students || [];
  const filteredStudents = students.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Detail Kelas</h1>
        <p className="text-sm text-slate-400 mt-1">Informasi kelas dan anggota</p>
      </div>

      {/* Class Info Card */}
      <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 p-6 text-white card-float-lg">
        <p className="text-xs text-sky-100 font-medium uppercase tracking-wider">SMKN 1 GARUT</p>
        <h2 className="mt-2 text-xl font-bold">{classroomData.name}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-sky-100">
          <span className="flex items-center gap-1.5">📅 {classroomData.academic_year || '2025/2026'}</span>
          <span className="flex items-center gap-1.5">👥 {students.length} Siswa</span>
          <span className="flex items-center gap-1.5">👤 Wali: {classroomData.teacher?.name || '-'}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        <input
          type="text"
          placeholder="Cari siswa atau jabatan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm placeholder:text-slate-400 transition-all focus:border-sky-400 card-float"
        />
      </div>

      {/* Members List */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3">Anggota Kelas</h3>
        <div className="space-y-2">
          {filteredStudents.length === 0 ? (
            <p className="text-center py-10 text-slate-400 text-sm">Tidak ada siswa ditemukan</p>
          ) : (
            filteredStudents.map((s: any, i: number) => (
              <div key={s.id} className="flex items-center justify-between rounded-2xl bg-white p-4 card-float transition hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shadow-sm ring-4 ring-white`}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-400 font-medium">NIS: {s.student_number || '-'}</p>
                  </div>
                </div>
                {s.gender && (
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${s.gender === 'L' ? 'bg-sky-50 text-sky-600' : 'bg-pink-50 text-pink-600'}`}>
                        {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
