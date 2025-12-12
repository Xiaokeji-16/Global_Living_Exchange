import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="bg-gradient-to-b from-[rgba(15,23,42,0.02)] to-[rgba(15,23,42,0.06)] py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* 左边：文案 + 按钮 */}
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[rgb(var(--color-foreground))]">
            <span className="block">
              Live like a local, by exchanging homes
            </span>
            <span className="block">
              with{" "}
              <span className="text-[rgb(var(--color-primary))]">
                verified members
              </span>
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[rgb(var(--color-muted))] max-w-xl">
            Join our invite-only community of verified homeowners for secure,
            mid- to long-term home exchanges. Skip hotels and platform fees—
            exchange homes using our trusted points system.
          </p>

          {/* 按钮区 */}
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

          {/* 三个卖点 */}
          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <dt className="font-medium text-[rgb(var(--color-foreground))]">
                100% Verified
              </dt>
              <dd className="text-[rgb(var(--color-muted))]">
                All members checked
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[rgb(var(--color-foreground))]">
                1 - 12 Months
              </dt>
              <dd className="text-[rgb(var(--color-muted))]">
                Mid to long-term stays
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[rgb(var(--color-foreground))]">
                No Money
              </dt>
              <dd className="text-[rgb(var(--color-muted))]">
                Points-based exchange
              </dd>
            </div>
          </dl>
        </div>

        {/* 右边：图片 + Verified 卡片 */}
        <div className="flex-1 w-full">
          <div className="relative rounded-3xl overflow-hidden shadow-xl bg-[rgb(var(--color-card))]">
            <Image
              src="/icon/cozy_home.jpg" // 👈 你等会儿放到 public 里的图片名
              alt="Cozy verified member home" 
              width={800}
              height={600}
              className="h-full w-full object-cover"
              priority
            />

            {/* 底部浮层卡片 */}
            <div className="absolute inset-x-4 bottom-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-6">
              <div className="flex items-center gap-3 rounded-2xl bg-[rgb(var(--color-card))]/95 px-4 py-3 shadow-lg border border-[rgb(var(--color-border))]">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-sm">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-medium text-[rgb(var(--color-foreground))]">
                    Verified member
                  </p>
                  <p className="text-[11px] text-[rgb(var(--color-muted))]">
                    Identity confirmed 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
