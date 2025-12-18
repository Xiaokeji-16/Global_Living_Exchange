// app/about/page.tsx
"use client";

import { Header } from "../components/Header";
import { AboutHero } from "./components/AboutHero";
import { AboutHowItWorks } from "./components/AboutHowItWorks";
import { AboutCommunity } from "./components/AboutCommunity";
import { AboutWhy } from "./components/AboutWhy";
import { AboutCTA } from "./components/AboutCTA";
import { useTheme } from "../hooks/useTheme"


export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();


  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <AboutHero />
        <AboutHowItWorks />
        <AboutCommunity />
        <AboutWhy />
        <AboutCTA />
        
      </main>
    </div>
  );
}