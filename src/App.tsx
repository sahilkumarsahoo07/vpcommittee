import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { BestVolunteersSection } from './sections/BestVolunteersSection';
import { AnnouncementsSection } from './sections/AnnouncementsSection';
import { MembersSection } from './sections/MembersSection';
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

  useEffect(() => {
    // If the page loaded with a # hash in URL, clean the URL immediately and smooth scroll
    if (window.location.hash) {
      const targetHash = window.location.hash.replace(/^#/, '');
      window.history.replaceState(null, '', window.location.pathname);
      if (targetHash) {
        setTimeout(() => {
          const el = document.getElementById(targetHash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

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
        <BestVolunteersSection />
        <AnnouncementsSection />
        {/* Members / Leadership & Members (Immediately before Memories From Our Celebrations) */}
        <MembersSection />
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

import { PermissionGuard } from './admin/components/PermissionGuard';

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
              <Route
                path="donations"
                element={
                  <PermissionGuard module="FINANCE">
                    <AdminDonationsPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="donor-profiles"
                element={
                  <PermissionGuard module="FINANCE">
                    <AdminDonorProfilesPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="expenses"
                element={
                  <PermissionGuard module="FINANCE">
                    <AdminExpensesPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="budget"
                element={<Navigate to="/admin/expenses" replace />}
              />
              <Route
                path="reports"
                element={
                  <PermissionGuard module="REPORTS">
                    <AdminFinancialReportsPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="members"
                element={
                  <PermissionGuard module="CMS_MEMBERS">
                    <AdminMembersPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="events"
                element={
                  <PermissionGuard module="CMS_EVENTS">
                    <AdminEventsPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="gallery"
                element={
                  <PermissionGuard module="CMS_GALLERY">
                    <AdminGalleryPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="announcements"
                element={
                  <PermissionGuard module="CMS_ANNOUNCEMENTS">
                    <AdminAnnouncementsPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="volunteers"
                element={
                  <PermissionGuard module="CMS_VOLUNTEERS">
                    <AdminVolunteersPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="subscribers"
                element={
                  <PermissionGuard module="CMS_SUBSCRIBERS">
                    <AdminSubscribersPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="settings"
                element={
                  <PermissionGuard module="SETTINGS">
                    <AdminWebsiteSettingsPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="audit"
                element={
                  <PermissionGuard module="AUDIT_LOGS">
                    <AdminAuditLogsPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="exports"
                element={
                  <PermissionGuard module="REPORTS">
                    <AdminExportCenterPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="users"
                element={
                  <PermissionGuard module="USERS">
                    <AdminUsersPage />
                  </PermissionGuard>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
