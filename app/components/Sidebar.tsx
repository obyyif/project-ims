"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const teacherNav = [
  { label: "Dashboard", href: "/", icon: HomeIcon },
  { label: "Jadwal", href: "/schedule", icon: CalendarIcon },
  { label: "Materi", href: "/materials", icon: BookIcon },
  { label: "Absensi", href: "/attendance", icon: ClipboardIcon },
  { label: "Kelas", href: "/classroom", icon: UsersIcon },
  { label: "Mata Pelajaran", href: "/subjects", icon: AcademicIcon },
  { label: "Tugas", href: "/assignments", icon: TaskIcon },
  { label: "Pengumuman", href: "/announcements", icon: ChatIcon },
];

const studentNav = [
  { label: "Dashboard", href: "/", icon: HomeIcon },
  { label: "Jadwal", href: "/schedule", icon: CalendarIcon },
  { label: "Materi", href: "/materials", icon: BookIcon },
  { label: "Kehadiran", href: "/attendance", icon: ClipboardIcon },
  { label: "Kelas Saya", href: "/classroom", icon: UsersIcon },
  { label: "Tugas", href: "/assignments", icon: TaskIcon },
  { label: "Pengumuman", href: "/announcements", icon: ChatIcon },
];

const bottomLinks = [
  { label: "Profil", href: "/profile", icon: UserIcon },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const navItems = role === "teacher" ? teacherNav : studentNav;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 pt-6 pb-2 ${collapsed ? "justify-center px-2" : ""}`}>
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl">
          <Image src="/logo-smkn1garut.png" alt="SMKN 1 Garut" fill sizes="40px" className="object-cover" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 leading-tight truncate">LMS Melesat</p>
            <p className="text-[11px] text-slate-400 font-medium">SMKN 1 Garut</p>
          </div>
        )}
      </div>

      {/* Collapse toggle — desktop only */}
      <div className={`hidden md:flex px-3 mt-2 ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          onClick={onToggle}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
            <path d="M14 9l-3 3 3 3" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 space-y-1 px-3 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
            Menu Utama
          </p>
        )}
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={`
                group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200
                ${collapsed ? "justify-center px-0 mx-auto w-11 h-11" : ""}
                ${active
                  ? "bg-sky-50 text-sky-600 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }
              `}
            >
              <item.icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  active ? "text-sky-500" : "text-slate-400 group-hover:text-slate-500"
                }`}
              />
              {!collapsed && (
                <>
                  {item.label}
                  {active && <div className="ml-auto h-2 w-2 rounded-full bg-sky-500" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-100 px-3 py-4 space-y-1">
        {bottomLinks.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={`
                group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all
                ${collapsed ? "justify-center px-0 mx-auto w-11 h-11" : ""}
                ${active
                  ? "bg-sky-50 text-sky-600 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }
              `}
            >
              <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-sky-500" : "text-slate-400"}`} />
              {!collapsed && item.label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          title={collapsed ? "Keluar" : undefined}
          className={`
            flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-500 transition-all hover:bg-rose-50
            ${collapsed ? "justify-center px-0 mx-auto w-11 h-11" : ""}
          `}
        >
          <LogoutIcon className="h-5 w-5 shrink-0" />
          {!collapsed && "Keluar"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={onMobileClose} />
      )}

      {/* Mobile sidebar — always expanded, slides in */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl
          transition-transform duration-300 ease-out md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="absolute right-3 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4l10 10M14 4L4 14" /></svg>
        </button>
        {/* Render full nav (not collapsed) for mobile */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-4 pt-6 pb-2">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl">
              <Image src="/logo-smkn1garut.png" alt="SMKN 1 Garut" fill sizes="40px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 leading-tight truncate">LMS Melesat</p>
              <p className="text-[11px] text-slate-400 font-medium">SMKN 1 Garut</p>
            </div>
          </div>
          <nav className="mt-6 flex-1 space-y-1 px-3 overflow-y-auto">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Menu Utama</p>
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={onMobileClose}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200
                    ${active ? "bg-sky-50 text-sky-600 font-semibold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                >
                  <item.icon className={`h-5 w-5 shrink-0 transition-colors ${active ? "text-sky-500" : "text-slate-400 group-hover:text-slate-500"}`} />
                  {item.label}
                  {active && <div className="ml-auto h-2 w-2 rounded-full bg-sky-500" />}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-100 px-3 py-4 space-y-1">
            {bottomLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={onMobileClose}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all
                    ${active ? "bg-sky-50 text-sky-600 font-semibold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                >
                  <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-sky-500" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-500 transition-all hover:bg-rose-50">
              <LogoutIcon className="h-5 w-5 shrink-0" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop sidebar — collapsible */}
      <aside
        className={`
          hidden md:flex flex-col shrink-0 bg-white border-r border-slate-100
          transition-[width] duration-300 ease-out overflow-hidden
          ${collapsed ? "w-[72px]" : "w-64"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

/* ── SVG Icon Components ── */

function HomeIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>);
}
function CalendarIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
}
function BookIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" /></svg>);
}
function ClipboardIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 2h6v3H9zM9 10h6M9 14h4" /></svg>);
}
function UsersIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>);
}
function AcademicIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>);
}
function TaskIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 12l2 2 4-4" /></svg>);
}
function ChatIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>);
}
function UserIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
}
function LogoutIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>);
}
