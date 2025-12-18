"use client";

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from "./components/Hero";
import { HowItWorksSection } from "./components/HowtoworkSection";
import { FeaturedHomesSection } from "./components/FeatureHomesSection";
import { TrustSection } from "./components/TrustSection";

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    // Apply theme to document
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))]">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      
      <main>
        <div>
          <Hero />
          <HowItWorksSection />
          <FeaturedHomesSection />
          <TrustSection />
          <section id="hero">
            {/* Hero Section Content */}
          </section>
          <section id="properties">
            
          </section>
          <section id="about">
            {/* Hero Section Content */}
          </section>
          <section id="contact">
            {/* Hero Section Content */}
          </section>
        </div>
      </main>
    </div>
  );
}

