import { ShieldCheck, Calendar, Coins, Users } from "lucide-react";

export function AboutWhy() {
  const reasons = [
    {
      title: "Verified members only",
      desc: "Every member is identity-verified and home-vetted to build trust before you swap.",
      icon: ShieldCheck,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Designed for 1–12 months",
      desc: "Optimised for medium to long-term living, not quick vacation stays.",
      icon: Calendar,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Points-based exchange",
      desc: "Fair value stays without the hassle of direct reciprocity or rent negotiations.",
      icon: Coins,
      iconColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Human-supported matching",
      desc: "Our team curates matches and logistics so you don't have to figure it out alone.",
      icon: Users,
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
        Why Global Living Exchange?
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
        We bridge the gap between expensive vacation rentals and long-term leases,
        creating a trusted ecosystem for global citizens.
      </p>

      <div className="grid gap-6 md:grid-cols-4">
        {reasons.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.title}
              className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700 px-5 py-6 space-y-3"
            >
              <div className={`h-10 w-10 rounded-xl ${r.bgColor} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${r.iconColor}`} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {r.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {r.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}