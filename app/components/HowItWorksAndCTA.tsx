// app/components/HowItWorksAndCTA.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Headphones,
  Home,
  MapPin,
  ShieldCheck,
} from "lucide-react";

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

const ctaHighlights = [
  {
    label: "100% verified members",
    icon: ShieldCheck,
  },
  {
    label: "Points-based stays",
    icon: Coins,
  },
  {
    label: "Human support",
    icon: Headphones,
  },
];

export function HowItWorksAndCTA() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div
        className="max-w-7xl mx-auto rounded-[40px] border border-[rgb(var(--color-border))] bg-gradient-to-b from-[rgba(85,107,142,0.05)] to-[rgba(85,107,142,0.10)] px-6 py-10 shadow-sm dark:from-[rgba(156,176,208,0.08)] dark:to-[rgba(156,176,208,0.14)] sm:px-10 sm:py-14 lg:px-12"
      >
        <div className="mb-10">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[rgb(var(--color-foreground))]">
              How it works
            </h2>
            <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
              Join our curated home-exchange community in four simple steps.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 shadow-sm"
                >
                  <div className="relative w-full h-24 overflow-hidden rounded-xl">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] text-xs font-semibold text-[rgb(var(--color-primary))]">
                      {step.number}
                    </span>
                    <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
                      {step.title}
                    </h3>
                  </div>

                  <p className="mt-2 flex-1 text-xs leading-relaxed text-[rgb(var(--color-muted))]">
                    {step.description}
                  </p>

                  <div className="mt-3 flex justify-end">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-primary))]">
                      <Icon size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-6 py-7 shadow-sm backdrop-blur-sm sm:px-8 sm:py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center rounded-full bg-[rgb(var(--color-secondary))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--color-primary))]">
                Join verified homes worldwide
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[rgb(var(--color-foreground))] sm:text-[2rem]">
                Create your account and start exploring
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[rgb(var(--color-muted))] sm:text-base">
                Join in minutes, complete verification, and unlock mid- to
                long-term stays with trusted members around the world.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                {ctaHighlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="inline-flex items-center gap-2 text-xs text-[rgb(var(--color-foreground))] sm:text-sm"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-primary))]">
                        <Icon size={14} />
                      </span>
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <div className="flex items-center gap-3 text-sm text-[rgb(var(--color-muted))]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-primary))]">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <span className="max-w-xs leading-relaxed">
                  Set up your account in minutes and start browsing trusted homes right away.
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] px-5 py-3 text-sm font-medium text-[rgb(var(--color-primary-foreground))] shadow-[0_14px_30px_rgba(85,107,142,0.24)] transition hover:scale-[1.01] hover:shadow-[0_18px_36px_rgba(85,107,142,0.30)]"
                >
                  Create your account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 px-1 py-2 text-sm font-medium text-[rgb(var(--color-foreground))] transition hover:text-[rgb(var(--color-primary))]"
                >
                  Browse verified homes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
