"use client";

import { useTheme} from "./hooks/useTheme"
import { Header } from './components/Header';
import { Hero } from "./components/Hero";
import { HowItWorksSection } from "./components/HowtoworkSection";
import { FeaturedHomesSection } from "./components/FeatureHomesSection";
import { TrustSection } from "./components/TrustSection";

export default function App() {
  const { theme, toggleTheme } = useTheme();


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

