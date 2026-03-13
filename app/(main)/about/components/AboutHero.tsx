// app/about/components/AboutHero.tsx

import Link from "next/link";

export function AboutHero() {
  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
      <div>
        <span className="inline-flex items-center rounded-full bg-[rgba(85,107,142,0.10)] px-4 py-1 text-xs font-medium text-[rgb(var(--color-primary))]">
          Reimagining home exchange
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          A curated home-exchange community for{" "}
          <span className="text-[rgb(var(--color-primary))]">1–12 month</span>{" "}
          living.
        </h1>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300 max-w-xl">
          Join a vetted network of global citizens. Swap your home with trusted
          members for 1–12 months and experience life in a new city, safely and
          affordably.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--color-primary))] px-6 py-2 text-sm font-medium text-[rgb(var(--color-primary-foreground))] hover:opacity-90 transition"
          >
            Browse properties
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-slate-300/70 dark:border-slate-600 px-6 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 hover:border-[rgb(var(--color-primary))] transition"
          >
            How it works
          </Link>
        </div>
      </div>

      {/* 右侧占位卡片，之后可以换成真实房源叠图 */}
      <div className="relative h-72 sm:h-80 lg:h-96 overflow-hidden rounded-3xl bg-gradient-to-tr from-[#3F526E] via-[#556B8E] to-[#B47A5A] shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35)_0,_transparent_55%)]" />
        <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-black/40 backdrop-blur px-4 py-3 text-sm text-white">
          <div className="font-medium">Lisbon · 6 months</div>
          <div className="text-xs text-slate-200">
            Sunlit home base with a balcony and workspace.
          </div>
        </div>
      </div>
    </section>
  );
}
