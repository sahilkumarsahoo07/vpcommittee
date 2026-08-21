import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { CountdownTimer } from './components/CountdownTimer';
import { AboutSection } from './sections/AboutSection';
import { FestivalTimeline } from './sections/FestivalTimeline';
import { FeatureCards } from './components/FeatureCards';
import { ActionRowSection } from './sections/ActionRowSection';
import { AnnouncementsSection } from './sections/AnnouncementsSection';
import { LocationSection } from './sections/LocationSection';
import { GallerySection } from './sections/GallerySection';
import { FinalCTA } from './sections/FinalCTA';
import { Footer } from './components/Footer';
import { DevotionalInteraction } from './components/DevotionalInteraction';
import { DonationModal } from './components/DonationModal';
import { VolunteerModal } from './components/VolunteerModal';

export function App() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [presetDonateAmount, setPresetDonateAmount] = useState<number>(1001);

  const handleOpenDonate = (amount?: number) => {
    if (amount) setPresetDonateAmount(amount);
    setIsDonateOpen(true);
  };

  const handleOpenVolunteer = () => {
    setIsVolunteerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#32070B] text-[#FFF7E8] font-sans antialiased relative selection:bg-[#D4A72C] selection:text-[#32070B]">
      {/* 1. Global Navigation */}
      <Navbar
        onOpenDonate={() => handleOpenDonate()}
        onOpenVolunteer={handleOpenVolunteer}
      />

      {/* Main Content Area */}
      <main>
        {/* 2. Cinematic Devotional Hero Section */}
        <HeroSection onOpenDonate={() => handleOpenDonate()} />

        {/* 3. Ganesh Utsav 2026 Real Countdown Timer */}
        <CountdownTimer />

        {/* 4. About Section - Our Story & Circular Frame Ganesha */}
        <AboutSection />

        {/* 5. Festival Schedule Vertical Timeline & 🔴 LIVE MAHA AARTI Card */}
        <FestivalTimeline />

        {/* 6. Four Feature Action Cards Bar */}
        <FeatureCards
          onOpenDonate={() => handleOpenDonate()}
          onOpenVolunteer={handleOpenVolunteer}
        />

        {/* 7. Action Row: Support Vighnaharta, Stay Connected, Be Part of Celebration */}
        <ActionRowSection
          onOpenDonate={(amt) => handleOpenDonate(amt)}
          onOpenVolunteer={handleOpenVolunteer}
        />

        {/* 8. Location Section (Find Our Pandal) & Community Statistics */}
        <LocationSection />

        {/* 9. Latest Announcements & Updates Feed */}
        <AnnouncementsSection />

        {/* 10. Gallery - Moments of Bhakti with Lightbox */}
        <GallerySection />

        {/* 11. Devotional Final CTA */}
        <FinalCTA
          onOpenDonate={() => handleOpenDonate()}
          onOpenVolunteer={handleOpenVolunteer}
        />
      </main>

      {/* 12. Full Devotional Footer */}
      <Footer />

      {/* 13. Interactive Devotional Blessing Floating Button */}
      <DevotionalInteraction />

      {/* 14. Interactive Modals */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        initialAmount={presetDonateAmount}
      />
      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={() => setIsVolunteerOpen(false)}
      />
    </div>
  );
}

export default App;
