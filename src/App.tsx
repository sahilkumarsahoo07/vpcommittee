import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { CountdownTimer } from './components/CountdownTimer';
import { AboutSection } from './sections/AboutSection';
import { FestivalTimeline } from './sections/FestivalTimeline';
import { FeatureCards } from './components/FeatureCards';
import { ActionRowSection } from './sections/ActionRowSection';
import { LocationCommunitySection } from './sections/LocationCommunitySection';
import { AnnouncementsSection } from './sections/AnnouncementsSection';
import { GallerySection } from './sections/GallerySection';
import { Footer } from './components/Footer';
import { DonationModal } from './components/DonationModal';
import { VolunteerModal } from './components/VolunteerModal';
import { DevotionalInteraction } from './components/DevotionalInteraction';
import { AnnouncementPopup } from './components/AnnouncementPopup';

// Admin Imports
import { AdminLayout } from './admin/AdminLayout';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboardHome } from './admin/pages/AdminDashboardHome';
import { AdminDonationsPage } from './admin/pages/AdminDonationsPage';
import { AdminDonorProfilesPage } from './admin/pages/AdminDonorProfilesPage';
import { AdminExpensesPage } from './admin/pages/AdminExpensesPage';
import { AdminBudgetPage } from './admin/pages/AdminBudgetPage';
import { AdminFinancialReportsPage } from './admin/pages/AdminFinancialReportsPage';
import { AdminMembersPage } from './admin/pages/AdminMembersPage';
import { AdminEventsPage } from './admin/pages/AdminEventsPage';
import { AdminGalleryPage } from './admin/pages/AdminGalleryPage';
import { AdminAnnouncementsPage } from './admin/pages/AdminAnnouncementsPage';
import { AdminVolunteersPage } from './admin/pages/AdminVolunteersPage';
import { AdminSubscribersPage } from './admin/pages/AdminSubscribersPage';
import { AdminWebsiteSettingsPage } from './admin/pages/AdminWebsiteSettingsPage';
import { AdminAuditLogsPage } from './admin/pages/AdminAuditLogsPage';
import { AdminExportCenterPage } from './admin/pages/AdminExportCenterPage';
import { AdminUsersPage } from './admin/pages/AdminUsersPage';

export function PublicWebsite() {
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
      <Navbar onOpenVolunteer={handleOpenVolunteer} />

      <main>
        <HeroSection onOpenDonate={() => handleOpenDonate()} />
        <CountdownTimer />
        <AboutSection />
        <FestivalTimeline />
        <FeatureCards
          onOpenDonate={() => handleOpenDonate()}
          onOpenVolunteer={handleOpenVolunteer}
        />
        <ActionRowSection
          onOpenDonate={(amt) => handleOpenDonate(amt)}
          onOpenVolunteer={handleOpenVolunteer}
        />
        <LocationCommunitySection />
        <AnnouncementsSection />
        <GallerySection />
      </main>

      <Footer />

      <DevotionalInteraction />

      <AnnouncementPopup />

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

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website Route */}
            <Route path="/" element={<PublicWebsite />} />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardHome />} />
              <Route path="donations" element={<AdminDonationsPage />} />
              <Route path="donor-profiles" element={<AdminDonorProfilesPage />} />
              <Route path="expenses" element={<AdminExpensesPage />} />
              <Route path="budget" element={<AdminBudgetPage />} />
              <Route path="reports" element={<AdminFinancialReportsPage />} />
              <Route path="members" element={<AdminMembersPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />
              <Route path="volunteers" element={<AdminVolunteersPage />} />
              <Route path="subscribers" element={<AdminSubscribersPage />} />
              <Route path="settings" element={<AdminWebsiteSettingsPage />} />
              <Route path="audit" element={<AdminAuditLogsPage />} />
              <Route path="exports" element={<AdminExportCenterPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
