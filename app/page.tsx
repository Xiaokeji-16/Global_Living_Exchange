"use client";

import { useTheme } from "./hooks/useTheme";
import { Header } from './components/Header';
import { Hero } from "./components/Hero";
import { HowItWorksSection } from "./components/HowtoworkSection";
import { FeaturedHomesSection } from "./components/FeatureHomesSection";
import { TrustSection } from "./components/TrustSection";
import { useUser } from "@clerk/nextjs";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))]">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme}
        variant={isSignedIn ? "authed" : "public"}
      />
      
      <main>
        <div className="space-y-16 md:space-y-24 lg:space-y-32">
          <Hero />
          <HowItWorksSection />
          <FeaturedHomesSection />
          <TrustSection />
        </div>
      </main>
    </div>
  );
}