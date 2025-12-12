"use client";

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from "./components/Hero";
import { HowItWorksSection } from "./components/HowtoworkSection";
import { FeaturedHomesSection } from "./components/FeatureHomesSection";
import { TrustSection } from "./components/TrustSection";

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

