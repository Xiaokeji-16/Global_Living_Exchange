// app/dashboard/components/DashboardTasks.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { fetchVerificationStatus } from "../lib/verificationStatus";

type TaskStatus = "Required" | "In progress" | "Completed" | "Recommended";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  href?: string;
};

export default function DashboardTasks() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateTasks() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const taskList: Task[] = [];

      try {
        // 1. 检查身份验证状态
        const verificationStatus = await fetchVerificationStatus();

        if (!verificationStatus || verificationStatus === "rejected") {
          taskList.push({
            id: "verify",
            title: "Complete ID verification",
            status: "Required",
            href: "/dashboard/verify",
          });
        } else if (verificationStatus === "pending") {
          taskList.push({
            id: "verify",
            title: "ID verification pending review",
            status: "In progress",
          });
        } else {
          taskList.push({
            id: "verify",
            title: "ID verification complete",
            status: "Completed",
          });
        }

        // 2. 检查是否有房源
        const homesResponse = await fetch("/api/properties/my-homes", {
          cache: "no-store",
        });

        if (!homesResponse.ok) {
          throw new Error("Failed to fetch homes");
        }

        const homesPayload = (await homesResponse.json()) as {
          properties?: Array<{ id?: number; ownership_proof_url?: string | null }>;
        };
        const homesData = homesPayload.properties || [];

        if (!homesData || homesData.length === 0) {
          taskList.push({
            id: "upload-home",
            title: "List your first home",
            status: "Required",
            href: "/upload-home",
          });
        } else {
          const missingOwnershipProof = homesData.some(
            (home) => !home.ownership_proof_url
          );

          if (missingOwnershipProof) {
            taskList.push({
              id: "ownership-proof",
              title: "Upload home ownership proof",
              status: "In progress",
              href: "/dashboard/properties",
            });
          }
        }

        // 3. 检查用户资料完整度
        const hasProfilePhoto = !!user.imageUrl;
        const hasName = !!(user.firstName && user.lastName);

        if (!hasProfilePhoto || !hasName) {
          taskList.push({
            id: "profile",
            title: "Add profile photo and complete bio",
            status: "Recommended",
          });
        }

        // 4. 如果所有必需任务都完成了，添加推荐任务
        const hasRequiredTasks = taskList.some((t) => t.status === "Required");
        if (!hasRequiredTasks && taskList.length < 3) {
          taskList.push({
            id: "referral",
            title: "Invite friends to join the community",
            status: "Recommended",
            href: "/dashboard/referral",
          });
        }

        setTasks(taskList);
      } catch (err) {
        console.error("Error generating tasks:", err);
      } finally {
        setLoading(false);
      }
    }

    generateTasks();
  }, [user?.id, user?.imageUrl, user?.firstName, user?.lastName]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
        <div className="px-5 py-4 border-b border-[rgb(var(--color-border))]">
          <h2 className="text-base sm:text-lg font-semibold">
            Next steps to complete your profile
          </h2>
        </div>
        <div className="px-5 py-8 text-center text-sm text-[rgb(var(--color-muted))]">
          Loading tasks...
        </div>
      </section>
    );
  }

  if (tasks.length === 0) {
    return (
      <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
        <div className="px-5 py-4 border-b border-[rgb(var(--color-border))]">
          <h2 className="text-base sm:text-lg font-semibold">
            Next steps to complete your profile
          </h2>
        </div>
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-[rgb(var(--color-muted))]">
            🎉 All set! Your profile is complete.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
      <div className="px-5 py-4 border-b border-[rgb(var(--color-border))]">
        <h2 className="text-base sm:text-lg font-semibold">
          Next steps to complete your profile
        </h2>
      </div>

      <ol className="divide-y divide-[rgb(var(--color-border))]">
        {tasks.map((task, index) => {
          const content = (
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--color-card-foreground))/10] text-sm font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm">{task.title}</p>
              </div>

              <TaskBadge status={task.status} />
            </div>
          );

          return (
            <li key={task.id}>
              {task.href ? (
                <Link
                  href={task.href}
                  className="block hover:bg-[rgb(var(--color-muted))]/5 transition-colors"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function TaskBadge({ status }: { status: TaskStatus }) {
  if (status === "Required") {
    return (
      <span className="rounded-full bg-red-50 dark:bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
        Required
      </span>
    );
  }
  if (status === "In progress") {
    return (
      <span className="rounded-full bg-yellow-50 dark:bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
        In progress
      </span>
    );
  }
  if (status === "Completed") {
    return (
      <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        Completed
      </span>
    );
  }
  return (
    <span className="rounded-full bg-blue-50 dark:bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
      Recommended
    </span>
  );
}
