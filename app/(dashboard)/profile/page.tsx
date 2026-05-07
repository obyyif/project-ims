"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import type { UserRole } from "@/types/api";

const roleLabel: Record<UserRole, string> = {
  teacher: "Guru",
  student: "Siswa",
  super_admin: "Administrator",
};

export default function ProfilePage() {
  const { user, role, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = () => {
    setEditForm({ name: user?.name || "", email: user?.email || "" });
    setSaveError("");
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const res = await api.patch("/me", {
        name: editForm.name,
        email: editForm.email,
      });
      // Update AuthContext with returned user data
      if (res.data?.user && updateUser) {
        updateUser(res.data.user);
      }
      setSaveSuccess(true);
      setIsEditing(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message;
      setSaveError(msg || "Gagal menyimpan profil. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ name: user?.name || "", email: user?.email || "" });
    setSaveError("");
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

      {/* Success Banner */}
      {saveSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3.5">
          <span className="text-emerald-500 text-lg">✓</span>
          <p className="text-sm font-semibold text-emerald-700">
            Profil berhasil diperbarui.
          </p>
        </div>
      )}

      {/* Info Card */}
      <div className="rounded-3xl bg-white p-6 card-float">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">Informasi Akun</h3>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                    </svg>
                  )}
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {saveError && (
          <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600 font-medium">
            {saveError}
          </div>
        )}

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
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-right w-56 transition focus:border-sky-400 focus:bg-white focus:outline-none"
        />
      ) : (
        <span className="text-sm font-semibold text-slate-900">{value}</span>
      )}
    </div>
  );
}
