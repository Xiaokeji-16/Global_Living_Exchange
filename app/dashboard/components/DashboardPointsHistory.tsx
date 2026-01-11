// app/dashboard/components/DashboardPointsHistory.tsx
"use client";

type PointsRecord = {
  id: number;
  date: string;
  event: string;
  change: string; // "+100" / "-50"
};

const MOCK_POINTS_HISTORY: PointsRecord[] = [
  { id: 1, date: "2026-01-05", event: "Completed profile", change: "+100" },
  { id: 2, date: "2026-01-03", event: "Uploaded new home", change: "+400" },
  { id: 3, date: "2025-12-28", event: "Invite friend approved", change: "+300" },
];

export default function DashboardPointsHistory() {
  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-5 py-4 sm:px-6 sm:py-5">
      <h2 className="text-base sm:text-lg font-semibold mb-3">
        Points history
      </h2>
      <p className="text-xs text-[rgb(var(--color-muted))] mb-3">
        Points usage will be available in a later release. For now you can see
        how you earned your points.
      </p>

      <div className="divide-y divide-[rgb(var(--color-border))] text-sm">
        {MOCK_POINTS_HISTORY.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between py-2"
          >
            <div>
              <p className="font-medium">{row.event}</p>
              <p className="text-xs text-[rgb(var(--color-muted))]">
                {row.date}
              </p>
            </div>
            <span
              className={
                "text-xs font-semibold " +
                (row.change.startsWith("+")
                  ? "text-green-600"
                  : "text-red-600")
              }
            >
              {row.change} pts
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}