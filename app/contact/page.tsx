// app/contact/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Header } from "../components/Header";

import { ContactIntro } from "./components/ContactIntro";
import { ContactHelpList } from "./components/ContactHelpList";
import { ContactMetaCards } from "./components/ContactMetaCards";
import { ContactForm } from "./components/ContactForm";

export default function ContactPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
  
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
          {/* 左侧：Intro + 帮助列表 + Meta 卡片 */}
          <section className="space-y-6">
            <ContactIntro />
            <ContactHelpList />
            <ContactMetaCards />
          </section>

          {/* 右侧：表单 */}
          <ContactForm />
        </div>
      </main>
    </div>
  );
}