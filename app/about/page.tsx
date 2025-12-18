// app/about/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Header } from "../components/Header";

import { AboutHero } from "./components/AboutHero";
import { AboutHowItWorks } from "./components/AboutHowItWorks";
import { AboutCommunity } from "./components/AboutCommunity";
import { AboutWhy } from "./components/AboutWhy";
import { AboutCTA } from "./components/AboutCTA";


export default function AboutPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

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