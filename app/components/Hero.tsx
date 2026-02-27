"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const HERO_IMAGES = [
  "/icon/cozy_home.jpg",
  "/icon/cozy_home.jpg", // 换成你真实的5张图片路径
  "/icon/cozy_home.jpg",
  "/icon/cozy_home.jpg",
  "/icon/cozy_home.jpg",
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(i => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  const next = () => setCurrent(i => (i + 1) % HERO_IMAGES.length);

  return (
    <section
      id="hero"
      className="bg-gradient-to-b from-[rgba(15,23,42,0.02)] to-[rgba(15,23,42,0.06)] py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* 左边：文案 + 按钮 */}
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[rgb(var(--color-foreground))]">
            <span className="block">Live like a local, by exchanging homes</span>
            <span className="block">
              with{" "}
              <span className="text-[rgb(var(--color-primary))]">verified members</span>
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[rgb(var(--color-muted))] max-w-xl">
            Join our invite-only community of verified homeowners for secure,
            mid- to long-term home exchanges. Skip hotels and platform fees—
            exchange homes using our trusted points system.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] text-sm font-medium hover:opacity-90 transition"
            >
              Get started
              <span className="ml-2 text-lg">→</span>
            </Link>
            <Link
              href="#properties"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-sm font-medium text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] transition"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse houses
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <dt className="font-medium text-[rgb(var(--color-foreground))]">100% Verified</dt>
              <dd className="text-[rgb(var(--color-muted))]">All members checked</dd>
            </div>
            <div>
              <dt className="font-medium text-[rgb(var(--color-foreground))]">1 - 12 Months</dt>
              <dd className="text-[rgb(var(--color-muted))]">Mid to long-term stays</dd>
            </div>
            <div>
              <dt className="font-medium text-[rgb(var(--color-foreground))]">No Money</dt>
              <dd className="text-[rgb(var(--color-muted))]">Points-based exchange</dd>
            </div>
          </dl>
        </div>

        {/* 右边：图片轮播 */}
        <div className="flex-1 w-full">
          <div className="relative rounded-3xl overflow-hidden shadow-xl bg-[rgb(var(--color-card))] aspect-[4/3]">
            {HERO_IMAGES.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={`Home ${idx + 1}`}
                fill
                className={`object-cover transition-opacity duration-700 ${
                  idx === current ? "opacity-100" : "opacity-0"
                }`}
                priority={idx === 0}
              />
            ))}

            {/* 左右箭头 */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* 底部圆点 */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5">
              {HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Verified 卡片 */}
            <div className="absolute inset-x-4 bottom-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-6">
              <div className="flex items-center gap-3 rounded-2xl bg-[rgb(var(--color-card))]/95 px-4 py-3 shadow-lg border border-[rgb(var(--color-border))]">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-sm">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-medium text-[rgb(var(--color-foreground))]">Verified member</p>
                  <p className="text-[11px] text-[rgb(var(--color-muted))]">Identity confirmed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
