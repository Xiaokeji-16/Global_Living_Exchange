// app/components/HowtoworkSection.tsx
"use client";

import Image from "next/image";
import { CheckCircle2, Home, Coins, MapPin } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Apply and get verified",
    description:
      "Pass our identity and home-ownership verification process to join our trusted community.",
    icon: CheckCircle2,
    image: "/icon/cozy_home.jpg", // 先用同一张，后面想换再改
  },
  {
    number: "2",
    title: "Upload your home",
    description:
      "Create a detailed listing with photos, amenities, and availability for your property.",
    icon: Home,
    image: "/icon/cozy_home.jpg",
  },
  {
    number: "3",
    title: "Earn points",
    description:
      "Receive points when members stay at your home. Build your exchange credit over time.",
    icon: Coins,
    image: "/icon/cozy_home.jpg",
  },
  {
    number: "4",
    title: "Use points to travel",
    description:
      "Spend your points to stay in other verified members' homes around the world.",
    icon: MapPin,
    image: "/icon/cozy_home.jpg",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16">
      {/* 标题 + 副标题（居中） */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-[rgb(var(--color-foreground))]">
          How it works
        </h2>
        <p className="mt-4 text-sm md:text-base leading-relaxed text-[rgb(var(--color-muted))]">
          Join our curated home-exchange community in four simple steps and
          start living like a local around the world.
        </p>
      </div>

      {/* 四个步骤卡片 */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="flex flex-col rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm"
            >
              {/* 顶部图片区域 */}
              <div className="relative w-full h-32 overflow-hidden rounded-2xl bg-[rgb(var(--color-secondary))]">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* 数字 + 标题（同一行，文字左对齐，但整体在卡片中看起来会更居中） */}
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10 text-sm font-semibold text-[rgb(var(--color-primary))]">
                  {step.number}
                </span>
                <h3 className="text-base md:text-lg font-semibold text-[rgb(var(--color-foreground))]">
                  {step.title}
                </h3>
              </div>

              {/* 描述文字 */}
              <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--color-muted))]">
                {step.description}
              </p>

              {/* 右下角小 icon（可选，不需要可以删掉这一块） */}
              <div className="mt-4 flex justify-end">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-primary))]">
                  <Icon size={16} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}