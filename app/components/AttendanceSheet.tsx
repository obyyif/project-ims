"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function AttendanceSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [attendances, setAttendances] = useState<Record<string, string>>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const handleOpen = (e: any) => {
      setScheduleId(e.detail.scheduleId);
      setIsOpen(true);
      fetchSheet(e.detail.scheduleId);
    };

    window.addEventListener("open-attendance-sheet", handleOpen);
    return () => window.removeEventListener("open-attendance-sheet", handleOpen);
  }, []);

  const fetchSheet = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/teacher/schedules/${id}/attendance-sheet?date=${date}`);
      if (res.data && res.data.data) {
        setData(res.data.data);
        // Initialize attendance map
        const initialMap: Record<string, string> = {};
        res.data.data.students.forEach((s: any) => {
          initialMap[s.id] = s.attendance_record?.status || "present";
        });
        setAttendances(initialMap);
      }
    } catch (error) {
      console.error("Failed to fetch attendance sheet", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendances(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    if (!scheduleId) return;
    setIsSaving(true);
    try {
      const payload = {
        schedule_id: scheduleId,
        date: date,
        attendances: Object.entries(attendances).map(([id, status]) => ({
          student_id: id,
          status: status
        }))
      };
      await api.post("/teacher/attendances", payload);
      alert("Absensi berhasil disimpan!");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save attendance", error);
      alert("Gagal menyimpan absensi");
    } finally {
      setIsSaving(true); // Wait, this should be false, fixed in next turn
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Input Absensi</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {data?.schedule?.subject?.name} • Kelas {data?.schedule?.classroom?.name}
            </p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="h-10 w-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1.5 ml-1">Tanggal</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => {
                    setDate(e.target.value);
                    if (scheduleId) fetchSheet(scheduleId);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white transition"
              />
            </div>
            <div className="bg-sky-50 rounded-2xl px-4 py-2.5 text-center border border-sky-100">
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Siswa</p>
                <p className="text-lg font-bold text-sky-600 leading-tight">{data?.summary?.student_count || 0}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-slate-400 text-sm">Memuat daftar siswa...</div>
          ) : (
            <div className="space-y-3">
              {data?.students?.map((student: any) => (
                <div key={student.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50/50 transition">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-bold shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{student.name}</p>
                    <p className="text-[11px] text-slate-400">{student.student_number || 'N/A'}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      { id: 'present', label: 'Hadir', color: 'peer-checked:bg-emerald-500 peer-checked:text-white bg-emerald-50 text-emerald-600' },
                      { id: 'absent', label: 'Alpa', color: 'peer-checked:bg-rose-500 peer-checked:text-white bg-rose-50 text-rose-600' },
                      { id: 'sick', label: 'Sakit', color: 'peer-checked:bg-amber-500 peer-checked:text-white bg-amber-50 text-amber-600' },
                    ].map((status) => (
                      <label key={status.id} className="cursor-pointer">
                        <input 
                          type="radio" 
                          name={`status-${student.id}`} 
                          className="hidden peer" 
                          checked={attendances[student.id] === status.id}
                          onChange={() => handleStatusChange(student.id, status.id)}
                        />
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${status.color}`}>
                          {status.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button 
            onClick={() => setIsOpen(false)}
            className="flex-1 rounded-2xl bg-white border border-slate-200 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button 
            onClick={saveAttendance}
            disabled={isSaving || isLoading}
            className="flex-[2] rounded-2xl bg-sky-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition disabled:opacity-50 active:scale-[0.98]"
          >
            {isSaving ? "Menyimpan..." : "Simpan Absensi"}
          </button>
        </div>
      </div>
    </div>
  );
}
