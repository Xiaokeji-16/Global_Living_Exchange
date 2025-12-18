export function AboutHowItWorks() {
  const steps = [
    {
      title: "Apply & become a member",
      desc: "Submit your profile and property details for verification.",
    },
    {
      title: "List your home & preferences",
      desc: "Share your availability and preferred destinations.",
    },
    {
      title: "Receive points & match stays",
      desc: "Earn points hosting or buy them. Get matched by our team.",
    },
    {
      title: "Live like a local",
      desc: "Move into a fully equipped home in a new city.",
    },
  ];

  return (
    <section id="how-it-works" className="space-y-8">
      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
        How Global Living Exchange works
      </h2>

      <div className="grid gap-6 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700 px-5 py-6 flex flex-col gap-3"
          >
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-sm font-semibold">
              {(index + 1).toString().padStart(2, "0")}
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {step.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
