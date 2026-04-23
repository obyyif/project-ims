import Link from "next/link";

export default function ProfileSecurityPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-xl">
        <section className="rounded-4xl bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex items-center justify-between">
            <Link href="/profile" className="text-slate-700 hover:text-slate-900">
              ← Kembali
            </Link>
            <h1 className="text-lg font-semibold text-slate-950">Security & Password</h1>
          </div>
          <p className="mt-3 text-sm text-slate-500">Ubah kata sandi dan periksa keamanan akun guru Anda.</p>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Kata Sandi</p>
              <p className="mt-2 text-sm text-slate-500">Terlindungi dengan aman</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Autentikasi Dua Faktor</p>
              <p className="mt-2 text-sm text-slate-500">Nonaktif</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/profile" className="inline-flex w-full justify-center rounded-3xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto">
              Batal
            </Link>
            <button className="inline-flex w-full justify-center rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 sm:w-auto">Perbarui Keamanan</button>
          </div>
        </section>
      </div>
    </main>
  );
}
