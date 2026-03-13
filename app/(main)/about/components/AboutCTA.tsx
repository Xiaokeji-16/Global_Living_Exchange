import Link from "next/link";

export function AboutCTA() {
  return (
    <section className="mt-4 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-[#234B45] via-[#2F6B62] to-[#C67B5C] px-6 py-8 text-white sm:px-10 sm:py-10 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold">
          Ready to explore your next city?
        </h2>
        <p className="mt-1 max-w-md text-sm text-white/78">
          Start your journey today and unlock a world of living possibilities.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/properties"
          className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--color-card))] px-6 py-2 text-sm font-medium text-[rgb(var(--color-primary))] transition hover:bg-[rgb(var(--color-secondary))]"
        >
          Browse properties
        </Link>
        <Link
          href="/#contact"
          className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Contact us
        </Link>
      </div>
    </section>
  );
}
