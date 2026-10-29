import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  History,
  Settings,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';

export const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const { borrowings } = useLibrary();

  const pendingCount = borrowings.filter((br) => br.status === 'pending').length;

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Manage Books', path: '/admin/books', icon: BookOpen },
    { name: 'Manage Members', path: '/admin/members', icon: Users },
    {
      name: 'Borrowing Requests',
      path: '/admin/borrowings',
      icon: ClipboardList,
      badge: pendingCount > 0 ? pendingCount : null
    },
    { name: 'Borrowing History', path: '/admin/history', icon: History },
    { name: 'Profile & Settings', path: '/admin/settings', icon: Settings }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 h-18">
        {!isCollapsed && (
          <Link to="/admin" className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="AuraLib LK Logo"
              className="w-9 h-9 rounded-xl object-contain bg-white border border-slate-100 shadow-sm p-0.5"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-navy-900 tracking-tight text-base">AuraLib</span>
                <span className="font-extrabold text-brand-600 tracking-tight text-base">LK</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Librarian Operations</p>
            </div>
          </Link>
        )}

        {isCollapsed && (
          <div className="mx-auto">
            <img
              src={logoImg}
              alt="AuraLib LK Logo"
              className="w-8 h-8 rounded-xl object-contain bg-white border border-slate-100 shadow-sm p-0.5"
            />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`
            }
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
            {!isCollapsed && item.badge && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Return to Public Website */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          title="Return to public portal"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600 shrink-0" />
          {!isCollapsed && <span>Public Website</span>}
        </Link>

        {/* User Card */}
        {user && !isCollapsed && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-navy-900 truncate">{user.name}</p>
                <p className="text-[9px] text-slate-400 capitalize truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="fixed inset-y-0 z-30 flex flex-col h-screen" style={{ width: isCollapsed ? '5rem' : '16rem' }}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sidebar Modal/Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-xs h-full z-10 animate-in slide-in-from-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
