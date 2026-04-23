import Link from "next/link";

export default function ProfileNotificationsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-xl">
        <section className="rounded-4xl bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex items-center justify-between">
            <Link href="/profile" className="text-slate-700 hover:text-slate-900">
              ← Kembali
            </Link>
            <h1 className="text-lg font-semibold text-slate-950">Notifications</h1>
          </div>
          <p className="mt-3 text-sm text-slate-500">Atur notifikasi untuk update kelas dan pesan baru.</p>
          <div className="mt-8 space-y-4">
            {[
              { label: "Email Notifications", value: "Aktif" },
              { label: "Push Notifications", value: "Nonaktif" },
              { label: "Reminder Messages", value: "Aktif" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.value}</p>
                </div>
                <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">Ubah</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
