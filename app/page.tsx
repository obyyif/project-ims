import Link from "next/link";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-12">
      <section className="w-full max-w-2xl rounded-4xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-[0_32px_80px_rgba(15,23,42,0.45)] backdrop-blur-lg sm:p-10">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">LMS Melesat</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Selamat datang di portal LMS</h1>
          <p className="mx-auto max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Buka halaman login untuk masuk sebagai siswa atau guru dan melihat jadwal, materi, serta profil sekolah.</p>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/login" className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 sm:w-auto">
            Buka Login
          </Link>
          <a href="#" className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800/80 sm:w-auto">
            Lihat Demo
          </a>
        </div>
      </section>
    </main>
  );
}
