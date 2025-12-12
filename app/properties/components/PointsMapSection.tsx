import { MapPin } from "lucide-react";

export default function PointsMapSection() {
  const bubbles = [
    { id: 1, label: "520", top: "18%", left: "55%" },
    { id: 2, label: "450", top: "45%", left: "40%" },
    { id: 3, label: "800", top: "42%", left: "70%" },
    { id: 4, label: "620", top: "65%", left: "60%" },
    { id: 5, label: "Est.", top: "75%", left: "30%" },
  ];

  return (
    <section
      aria-label="Points map"
      className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5"
    >
      {/* ... 保留你原来的 JSX 内容即可 */}
      {/* 积分气泡和右下角 MapPin 按钮 */}
    </section>
  );
}