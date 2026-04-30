"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface TopBarProps {
  onMenuClick: () => void;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  data?: { icon?: string };
  read_at: string | null;
  created_at: string;
}

const TYPE_ICONS: Record<string, string> = {
  assignment_new: "📝",
  assignment_graded: "✅",
  attendance_recorded: "📋",
  material_uploaded: "📁",
  announcement: "📢",
  submission_received: "📨",
};

function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "Baru saja";
  if (s < 3600) return `${Math.floor(s / 60)}m lalu`;
  if (s < 86400) return `${Math.floor(s / 3600)}j lalu`;
  if (s < 604800) return `${Math.floor(s / 86400)}h lalu`;
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user, role, logout } = useAuth();
  const router = useRouter();

  // ── Notification State ──
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Profile State ──
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // ── Fetch notifications ──
  const fetchNotifs = useCallback(async (pageNum: number, append = false) => {
    try {
      if (pageNum > 1) setLoadingMore(true);
      const res = await api.get(`/notifications?per_page=15&page=${pageNum}`);
      const data = res.data?.data || [];
      const meta = res.data?.meta || {};
      setNotifs((prev) => append ? [...prev, ...data] : data);
      setUnreadCount(meta.unread_count || 0);
      setLastPage(meta.last_page || 1);
    } catch {
      // silent
    } finally {
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifs(1);
  }, [fetchNotifs]);

  // ── Infinite scroll ──
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loadingMore || page >= lastPage) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifs(nextPage, true);
    }
  }, [page, lastPage, loadingMore, fetchNotifs]);

  // ── Mark single as read + navigate ──
  const handleNotifClick = useCallback(async (n: Notification) => {
    if (!n.read_at) {
      try {
        await api.patch(`/notifications/${n.id}/read`);
        setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {}
    }
    if (n.link) {
      setShowNotif(false);
      router.push(n.link);
    }
  }, [router]);

  // ── Mark all read ──
  const markAllRead = useCallback(async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifs((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
      setUnreadCount(0);
    } catch {}
  }, []);

  // ── Close dropdowns on outside click ──
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Only show first 5 initially, rest via scroll
  const visibleNotifs = notifs;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 py-3 md:px-6 md:py-4">
      {/* Left: Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-2xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 ml-auto">
        {/* ── Notification Bell ── */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative rounded-2xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Notifikasi</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">{unreadCount}</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] font-medium text-sky-500 hover:text-sky-700 transition">
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              {/* Items — max-h with scroll, shows 5 initially visible */}
              <div ref={scrollRef} onScroll={handleScroll} className="max-h-[340px] overflow-y-auto">
                {visibleNotifs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <span className="text-4xl">🔔</span>
                    <p className="text-sm text-slate-400">Belum ada notifikasi</p>
                  </div>
                ) : (
                  <>
                    {visibleNotifs.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`flex items-start gap-3 w-full px-4 py-3 text-left transition hover:bg-slate-50 border-b border-slate-50 last:border-0 ${
                          !n.read_at ? "bg-sky-50/50" : ""
                        }`}
                      >
                        <div className={`mt-0.5 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                          !n.read_at ? "bg-sky-100" : "bg-slate-100"
                        }`}>
                          <span className="text-sm">{n.data?.icon || TYPE_ICONS[n.type] || "🔔"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug ${!n.read_at ? "font-bold text-slate-900" : "font-medium text-slate-600"}`}>
                            {n.title}
                          </p>
                          {n.body && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{n.body}</p>
                          )}
                          <span className="text-[10px] text-slate-300 mt-1 inline-block">{timeAgo(n.created_at)}</span>
                        </div>
                        {!n.read_at && <span className="mt-2 h-2 w-2 rounded-full bg-sky-500 shrink-0" />}
                      </button>
                    ))}
                    {loadingMore && (
                      <div className="flex items-center justify-center py-3">
                        <svg className="h-5 w-5 animate-spin text-sky-400" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" /></svg>
                      </div>
                    )}
                    {page >= lastPage && notifs.length > 5 && (
                      <p className="text-center text-[10px] text-slate-300 py-2">Semua notifikasi telah ditampilkan</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Profile ── */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 ml-1 transition hover:bg-slate-100 cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-sky-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || "User"}</p>
              <p className="text-[11px] text-slate-400 capitalize">{role}</p>
            </div>
            <svg className="h-3.5 w-3.5 text-slate-400 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden animate-fade-in">
              <div className="px-4 py-4 border-b border-slate-100 bg-gradient-to-br from-sky-50 to-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-sky-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "User"}</p>
                    <p className="text-[11px] text-slate-500">{user?.email || ""}</p>
                    <span className="inline-block mt-1 rounded-lg bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-600 capitalize">{role}</span>
                  </div>
                </div>
              </div>
              <div className="py-1.5">
                <button onClick={() => { setShowProfile(false); router.push("/profile"); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <span className="text-base">👤</span><span className="font-medium">Profil Saya</span>
                </button>
                <button onClick={() => { setShowProfile(false); router.push("/settings"); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <span className="text-base">⚙️</span><span className="font-medium">Pengaturan</span>
                </button>
              </div>
              <div className="border-t border-slate-100 py-1.5">
                <button onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition">
                  <span className="text-base">🚪</span><span className="font-medium">Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
