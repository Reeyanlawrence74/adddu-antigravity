import { useCallback, useState } from 'react';
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
import { NikePreloader } from './components/preloader/NikePreloader';
import { ProgressiveBlur } from './components/ui/ProgressiveBlur';

export function App() {
  const [demoMode, setDemoMode] = useState<boolean>(SITE_CONFIG.demoMode);
  const [showPreloader, setShowPreloader] = useState<boolean>(true);
  const [heroEntranceReady, setHeroEntranceReady] = useState<boolean>(false);

  const handlePreloaderExitStart = useCallback(() => {
    setHeroEntranceReady(true);
  }, []);

  const handlePreloaderExitComplete = useCallback(() => {
    setHeroEntranceReady(true);
    setShowPreloader(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F0F7FA] text-[#123344]">
        {showPreloader && (
          <NikePreloader
            onExitStart={handlePreloaderExitStart}
            onExitComplete={handlePreloaderExitComplete}
          />
        )}
        {!showPreloader && <SmoothCursor />}
        {!showPreloader && (
          <>
            <ProgressiveBlur position="top" backgroundColor="#F0F7FA" />
            <ProgressiveBlur position="bottom" backgroundColor="#F0F7FA" />
          </>
        )}
        <NotchNavbar />
        <main>
          <HeroSection entranceReady={heroEntranceReady} />
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
