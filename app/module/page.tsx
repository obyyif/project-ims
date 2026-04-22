"use client";

import React, { useState } from 'react';

export default function ModuleDetails() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Data konten dipisahkan agar JSX lebih bersih
  const content = {
    title: "Responsive Desain With CSS",
    duration: "90 menit",
    school: "SMKN 1 GARUT",
    lessons: [
      "Tampilan kurikulum lengkap yang mencakup pemutar video di bagian atas untuk tutorial.",
      "Web Dev Lesson Details: Fokus pada detail satu materi spesifik dengan deskripsi bersih."
    ]
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex justify-center items-start p-4 md:p-8 font-sans antialiased text-gray-900">
      
      {/* Container Utama */}
      <div className="w-full max-w-[390px] bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="relative flex items-center justify-center pt-8 pb-4 px-6">
          <button 
            onClick={() => alert("Back")}
            className="absolute left-6 p-2 hover:bg-gray-100 active:scale-90 rounded-full transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-lg font-extrabold tracking-tight">Module Details</h1>
        </div>

        <div className="px-6 pb-10">
          {/* Hero Image / Video Thumbnail */}
          <div className="relative w-full h-[220px] rounded-[28px] overflow-hidden mb-6 shadow-sm group">
            <img 
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800" 
              alt="Course"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10" />
            <span className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[12px] font-bold shadow-lg">
              Intermediate
            </span>
          </div>

          {/* Title Section */}
          <h2 className="text-[28px] font-black leading-tight mb-4 tracking-tighter text-gray-900">
            {content.title.split(' ').map((w, i) => i === 2 ? <React.Fragment key={i}><br/>{w} </React.Fragment> : w + ' ')}
          </h2>

          {/* Info Bar */}
          <div className="flex items-center gap-6 text-gray-500 mb-8">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <span className="text-lg">🕒</span> {content.duration}
            </div>
            <div className="flex items-center gap-2 font-bold text-[12px] uppercase tracking-widest text-gray-400">
              <span className="text-blue-500 text-lg">📍</span> {content.school}
            </div>
          </div>

          {/* Description Points */}
          <div className="space-y-4 mb-10">
            {content.lessons.map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-blue-500 font-bold text-xl leading-none">•</span>
                <p className="text-[14px] leading-relaxed font-medium text-gray-600">{text}</p>
              </div>
            ))}
          </div>

          {/* Resources Card */}
          <div className="mb-10">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Resources</h3>
            <div 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-5 rounded-[24px] flex items-center gap-4 border-2 transition-all active:scale-[0.96] cursor-pointer ${
                isPlaying ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-50'
              }`}
            >
              <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center justify-center w-12 h-12">
                {isPlaying ? (
                  <div className="flex gap-1"><div className="w-1.5 h-4 bg-blue-500 rounded-full"/><div className="w-1.5 h-4 bg-blue-500 rounded-full"/></div>
                ) : (
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-red-500 border-b-[8px] border-b-transparent ml-1" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-[15px]">{isPlaying ? "Now Playing..." : "Andriansyah Maulana"}</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">01.33.00 • MP4 Video</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => setIsCompleted(!isCompleted)}
            className={`w-full py-5 rounded-[22px] font-black text-sm uppercase tracking-[2px] transition-all duration-300 shadow-xl active:scale-95 ${
              isCompleted 
                ? 'bg-emerald-500 text-white shadow-emerald-200' 
                : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
            }`}
          >
            {isCompleted ? "✓ Completed" : "Mark as Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}