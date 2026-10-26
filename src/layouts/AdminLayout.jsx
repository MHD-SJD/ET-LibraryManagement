import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { AdminSidebar } from '../components/dashboard/AdminSidebar';
import { AdminTopNav } from '../components/dashboard/AdminTopNav';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // If user is not authenticated or not an admin, protect the route and redirect to login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login?role=admin" state={{ from: location.pathname }} replace />;
  }

  const getPageTitle = (pathname) => {
    if (pathname.includes('/admin/books')) return 'Manage Library Books';
    if (pathname.includes('/admin/members')) return 'Manage Library Members';
    if (pathname.includes('/admin/borrowings')) return 'Borrowing Management & Approvals';
    if (pathname.includes('/admin/history')) return 'Comprehensive Borrowing History';
    if (pathname.includes('/admin/settings')) return 'Administrator Profile & System Settings';
    return 'Librarian Overview & Analytics';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopNav
          onMobileMenuOpen={() => setIsMobileOpen(true)}
          title={getPageTitle(location.pathname)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
