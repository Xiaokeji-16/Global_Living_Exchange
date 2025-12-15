// app/dashboard/components/DashboardTasks.tsx
"use client";

import type { NextStepTask } from "../lib/dashboardData";

type Props = {
  tasks: NextStepTask[];
};

export default function DashboardTasks({ tasks }: Props) {
  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
      <div className="px-5 py-4 border-b border-[rgb(var(--color-border))]">
        <h2 className="text-base sm:text-lg font-semibold">
          Next steps to complete your profile
        </h2>
      </div>

      <ol className="divide-y divide-[rgb(var(--color-border))]">
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--color-card-foreground))/10] text-sm font-semibold">
                {index + 1}
              </div>
              <p className="text-sm">{task.title}</p>
            </div>

            <TaskBadge status={task.status} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function TaskBadge({ status }: { status: NextStepTask["status"] }) {
  if (status === "Required") {
    return (
      <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
        Required
      </span>
    );
  }
  if (status === "In progress") {
    return (
      <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300">
        In progress
      </span>
    );
  }
  return (
    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
      Recommended
    </span>
  );
}