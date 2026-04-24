"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function UploadMaterialSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      fetchSchedules();
    };

    window.addEventListener("open-upload-material", handleOpen);
    return () => window.removeEventListener("open-upload-material", handleOpen);
  }, []);

  const fetchSchedules = async () => {
    setIsLoadingSchedules(true);
    try {
      const res = await api.get("/teacher/schedules");
      if (res.data && res.data.data) {
        setSchedules(res.data.data);
        if (res.data.data.length > 0) setSelectedScheduleId(res.data.data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch schedules", error);
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleId || !file || !title) {
        alert("Mohon isi semua data yang wajib");
        return;
    }

    setIsUploading(true);
    try {
      const selectedSchedule = schedules.find(s => s.id === selectedScheduleId);
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("schedule_id", selectedScheduleId);
      formData.append("classroom_id", selectedSchedule?.classroom?.id);
      formData.append("file", file);
      formData.append("is_published", "1");

      await api.post("/teacher/materials", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Materi berhasil diunggah!");
      setIsOpen(false);
      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      // Trigger refresh on materials page
      window.dispatchEvent(new Event("refresh-materials"));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Gagal mengunggah materi");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Upload Materi Baru</h2>
            <p className="text-sm text-slate-400 mt-0.5">Berikan materi terbaik untuk siswa Anda</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="h-10 w-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleUpload} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1.5 ml-1">Judul Materi</label>
            <input 
              required
              type="text" 
              placeholder="Contoh: Dasar-dasar React" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1.5 ml-1">Deskripsi</label>
            <textarea 
              rows={3}
              placeholder="Jelaskan isi materi secara singkat..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1.5 ml-1">Pilih Jadwal / Kelas</label>
              <select 
                required
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white transition"
              >
                {isLoadingSchedules ? (
                  <option>Memuat jadwal...</option>
                ) : (
                  schedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.subject.name} - {s.classroom.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1.5 ml-1">File Materi (PDF/DOCX/JPG)</label>
            <div className="relative group">
              <input 
                required
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${file ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-slate-50 group-hover:border-sky-400'}`}>
                {file ? (
                  <>
                    <p className="text-sm font-bold text-sky-600">{file.name}</p>
                    <p className="text-xs text-sky-400 mt-1">Klik untuk mengganti file</p>
                  </>
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-2">↑</div>
                    <p className="text-sm font-semibold text-slate-500">Pilih file atau seret ke sini</p>
                    <p className="text-xs text-slate-400 mt-1">Maksimum ukuran file: 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-2xl bg-white border border-slate-200 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isUploading}
              className="flex-[2] rounded-2xl bg-sky-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600 transition disabled:opacity-50 active:scale-[0.98]"
            >
              {isUploading ? "Mengunggah..." : "Upload Materi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
