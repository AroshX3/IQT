import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6">
      <section className="max-w-2xl text-center">
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Check Your
          <span className="block text-white/70">Approximate IQ</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-white/60 leading-relaxed">
          Test your logic, reasoning, and pattern recognition with random
          questions. No ads. No sign-up. Just a clean little brain challenge.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button className="rounded-2xl bg-white text-black px-17 py-4 font-medium transition hover:scale-105">
            <Link href='/iqTester'>Start Test</Link>
          </button>

          <button className="rounded-2xl border border-white/15 px-8 py-4 text-white/70 transition hover:bg-white/5">
            <Link href="/about">About</Link>
          </button>
        </div>
      </section>
    </main>
  );
}
