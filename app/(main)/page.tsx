"use client";

import { useTheme } from "../hooks/useTheme";
import { Header } from '../components/Header';
import { Hero } from "../components/Hero";
import { HowItWorksAndCTA } from "../components/HowItWorksAndCTA";
import { FeaturedHomesSection } from "../components/FeatureHomesSection";
import { TrustSection } from "../components/TrustSection";
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
        <div>
          <Hero />
          <FeaturedHomesSection />
          <TrustSection />
          <HowItWorksAndCTA />
        </div>
      </main>
    </div>
  );
} 
