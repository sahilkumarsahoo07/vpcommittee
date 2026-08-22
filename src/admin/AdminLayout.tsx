import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar } from './components/AdminSidebar';
import { MustChangePasswordModal } from '../components/MustChangePasswordModal';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="h-[100dvh] w-full max-w-full bg-[#FFF7E8] text-[#2A1710] flex flex-col font-sans overflow-hidden">
      <MustChangePasswordModal />
      <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex overflow-hidden relative w-full max-w-full">
        <AdminSidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

        <main className="flex-1 p-2.5 sm:p-5 lg:p-7 overflow-y-auto overflow-x-hidden w-full max-w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
