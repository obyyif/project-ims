import Link from "next/link";

export default function ProfileEditPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-xl space-y-6">
        <section className="rounded-4xl bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex items-center justify-between">
            <Link href="/profile" className="text-slate-700 hover:text-slate-900">
              ← Kembali
            </Link>
            <h1 className="text-lg font-semibold text-slate-950">Edit Profil</h1>
          </div>
          <p className="mt-3 text-sm text-slate-500">Halaman sementara untuk sunting profil guru.</p>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-900">Nama</p>
              <p className="mt-2 text-sm text-slate-500">USER</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-900">Alamat</p>
              <p className="mt-2 text-sm text-slate-500">Jl. Cimanuk No 309</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-900">Telepon</p>
              <p className="mt-2 text-sm text-slate-500">+62 812-3456-7890</p>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">Simpan Perubahan</button>
          </div>
        </section>
      </div>
    </main>
  );
}
