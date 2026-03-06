export function AboutFooterLinks() {
  return (
    <section className="mt-10 border-t border-slate-200/60 dark:border-slate-800 pt-8 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-100">
            GLE
          </div>
          <p className="mt-1 max-w-xs">
            A curated home-exchange community for 1–12 month living. Experience
            the world like a local.
          </p>
        </div>
        {/* 这里可以按 Figma 再细分成 Platform / Company / Connect 三列 */}
      </div>
      <p className="mt-6">
        © 2025 Global Living Exchange. All rights reserved.
      </p>
    </section>
  );
}