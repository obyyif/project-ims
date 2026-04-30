"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/api";

const roleLabel: Record<UserRole, string> = {
  teacher: "Guru",
  student: "Siswa",
  super_admin: "Administrator",
};

export default function ProfilePage() {
  const { user, role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = () => {
    // TODO: Wire to PATCH /me when profile update endpoint is available for LMS
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>

      {/* Profile Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 p-6 md:p-8 card-float-lg">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-3xl font-bold text-white ring-2 ring-white/20 backdrop-blur-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">{user?.name || "Pengguna"}</h2>
            <p className="text-sm text-sky-100 mt-0.5">{user?.email || "-"}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="rounded-xl bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {roleLabel[role as UserRole] || role}
              </span>
              {user?.nisn && (
                <span className="rounded-xl bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  NISN: {user.nisn}
                </span>
              )}
              {user?.nip && (
                <span className="rounded-xl bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  NIP: {user.nip}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-3xl bg-white p-6 card-float">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">Informasi Akun</h3>
          <button
            onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              isEditing
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {isEditing ? "Simpan" : "Edit"}
          </button>
        </div>

        <div className="space-y-4">
          <InfoRow
            label="Nama Lengkap"
            value={user?.name || "-"}
            editing={isEditing}
            editValue={editForm.name}
            onChange={(v) => setEditForm({ ...editForm, name: v })}
          />
          <InfoRow
            label="Email"
            value={user?.email || "-"}
            editing={isEditing}
            editValue={editForm.email}
            onChange={(v) => setEditForm({ ...editForm, email: v })}
          />
          <InfoRow label="Username" value={user?.username || "-"} />
          <InfoRow label="Role" value={roleLabel[role as UserRole] || role || "-"} />
          {role === "student" && user?.nisn && (
            <InfoRow label="NISN" value={user.nisn} />
          )}
          {role === "teacher" && user?.nip && (
            <InfoRow label="NIP" value={user.nip} />
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  editing = false,
  editValue = "",
  onChange,
}: {
  label: string;
  value: string;
  editing?: boolean;
  editValue?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      {editing && onChange ? (
        <input
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-right w-56 transition focus:border-sky-400 focus:bg-white"
        />
      ) : (
        <span className="text-sm font-semibold text-slate-900">{value}</span>
      )}
    </div>
  );
}
