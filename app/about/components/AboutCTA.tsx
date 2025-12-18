export function AboutCTA() {
  return (
    <section className="mt-4 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 px-6 py-8 sm:px-10 sm:py-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold">
          Ready to explore your next city?
        </h2>
        <p className="mt-1 text-sm text-indigo-100 max-w-md">
          Start your journey today and unlock a world of living possibilities.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href="/properties"
          className="inline-flex items-center justify-center rounded-full bg-white text-indigo-700 px-6 py-2 text-sm font-medium hover:bg-indigo-50 transition"
        >
          Browse properties
        </a>
        <a
          href="/#contact"
          className="inline-flex items-center justify-center rounded-full border border-indigo-200/70 px-6 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
        >
          Contact us
        </a>
      </div>
    </section>
  );
}