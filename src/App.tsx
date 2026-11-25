import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { SITE_CONFIG } from './data/siteConfig';
import { SmoothCursor } from './components/ui/SmoothCursor';
import { NotchNavbar } from './components/layout/NotchNavbar';
import { HeroSection } from './components/hero/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { JourneySection } from './components/sections/JourneySection';
import { CompetitionGallery } from './components/sections/CompetitionGallery';
import { AchievementSection } from './components/sections/AchievementSection';
import { TrainingSection } from './components/sections/TrainingSection';
import { StatsCounter } from './components/sections/StatsCounter';
import { TestimonialsCarousel } from './components/sections/TestimonialsCarousel';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';

export function App() {
  const [demoMode, setDemoMode] = useState<boolean>(SITE_CONFIG.demoMode);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#0C0C0C] text-[#F5F1E8]">
        <SmoothCursor />
        <NotchNavbar />
        <main>
          <HeroSection />
          <AboutSection />
          <JourneySection />
          <CompetitionGallery />
          <AchievementSection demoMode={demoMode} />
          <TrainingSection demoMode={demoMode} />
          <StatsCounter demoMode={demoMode} />
          <TestimonialsCarousel demoMode={demoMode} />
          <ContactSection demoMode={demoMode} />
        </main>
        <Footer
          demoMode={demoMode}
          onToggleDemoMode={() => setDemoMode((prev) => !prev)}
        />
      </div>
    </MotionConfig>
  );
}

export default App;
