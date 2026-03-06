// app/components/HowItWorksAndCTA.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Home, Coins, MapPin } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Apply and get verified",
    description:
      "Pass our identity and home-ownership verification process to join our trusted community.",
    icon: CheckCircle2,
    image: "/icon/cozy_home.jpg",
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

export function HowItWorksAndCTA() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      {/* 圆角背景容器 */}
      <div 
        className="max-w-7xl mx-auto rounded-[40px] px-6 sm:px-10 lg:px-12 py-10 sm:py-14"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        
        {/* How it works 部分 */}
        <div className="mb-10">
          {/* 标题 */}
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              How it works
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Join our curated home-exchange community in four simple steps.
            </p>
          </div>

          {/* 四个步骤卡片 */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  {/* 图片 */}
                  <div className="relative w-full h-24 overflow-hidden rounded-xl">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* 数字 + 标题 */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
                      {step.number}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>

                  {/* 描述 */}
                  <p className="mt-2 text-xs leading-relaxed text-gray-500 flex-1">
                    {step.description}
                  </p>

                  {/* 图标 */}
                  <div className="mt-3 flex justify-end">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-indigo-500">
                      <Icon size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA 部分 - 渐变紫色背景，和登录页左侧风格统一 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#8b5cf6] px-6 py-8 text-center">
          {/* 背景装饰 */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            <p className="text-[10px] font-semibold tracking-widest text-yellow-300 uppercase mb-2">
              Invite-only community
            </p>
            <h3 className="text-lg font-semibold text-white mb-2">
              Ready to exchange your home?
            </h3>
            <p className="text-xs text-white/70 max-w-sm mx-auto mb-5">
              Join a trusted community of homeowners. No money, no hidden fees.
            </p>

            {/* 按钮 */}
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white text-indigo-600 text-sm font-medium hover:bg-white/90 transition shadow-lg"
              >
                Get started
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-5 py-2 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}