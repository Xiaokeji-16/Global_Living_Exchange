// app/dashboard/contact/page.tsx
"use client";

import { Header } from "../../components/Header";
import { useTheme } from "../../hooks/useTheme";
// 👇 根据你 ContactForm 的实际位置调整路径
import { ContactForm } from "../../contact/components/ContactForm";

export default function DashboardContactPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      {/* ✅ 登录版 Header，一定要加 variant="authed" */}
      <Header theme={theme} toggleTheme={toggleTheme} variant="authed" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <section>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Contact us
          </h1>
          <p className="mt-3 text-sm md:text-base text-[rgb(var(--color-muted))]">
            Tell us what you need and our team will get back to you.
          </p>
        </section>

        <ContactForm />
      </main>
    </div>
  );
}