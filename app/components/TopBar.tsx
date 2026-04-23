"use client";
import { useAuth } from "@/contexts/AuthContext";

interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
}

export default function TopBar({ onMenuClick, title }: TopBarProps) {
  const { user, role } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 py-3 md:px-6 md:py-4">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-2xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        {title && (
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        )}
      </div>

      {/* Right: Notifications + Avatar */}
      <div className="flex items-center gap-2">
        <button className="relative rounded-2xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {/* Notification dot */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 ml-1">
          <div className="h-8 w-8 rounded-xl bg-sky-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] text-slate-400 capiltalize">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
