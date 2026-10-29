import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';
import {
  BookOpen,
  Library,
  BookmarkCheck,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { borrowings } = useLibrary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Active or pending books for current user
  const activeUserBorrowings = user
    ? borrowings.filter((br) => br.memberId === user.id && (br.status === 'approved' || br.status === 'pending'))
    : [];

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
      isActive
        ? 'text-brand-700 bg-white font-extrabold shadow-xs border border-sky-200/80'
        : 'text-slate-700 hover:text-navy-950 hover:bg-white/70 font-bold'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#dbeefc] border-b border-[#b9ddfb] shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo on Left */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src={logoImg || '/logo.jpg'}
              alt="AuraLib LK Logo"
              onError={(e) => {
                if (!e.target.src.endsWith('/logo.jpg')) {
                  e.target.src = '/logo.jpg';
                }
              }}
              className="w-10 h-10 rounded-xl object-contain shadow-xs border border-sky-200/80 bg-white group-hover:scale-105 transition-transform shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-navy-900">AuraLib</span>
                <span className="text-xl font-extrabold tracking-tight text-brand-600">LK</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-brand-600 to-cyan-600 text-white rounded">
                  AI Smart
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-0.5">
                Sri Lanka Public Library
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Centered */}
          <nav className="hidden lg:flex items-center justify-center gap-1.5 flex-1 mx-4">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/catalog" className={navLinkClass}>
              <Library className="w-4 h-4 text-slate-500" />
              Book Catalog
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-books" className={navLinkClass}>
                <BookmarkCheck className="w-4 h-4 text-slate-500" />
                My Books
                {activeUserBorrowings.length > 0 && (
                  <span className="ml-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-brand-600 text-white rounded-full">
                    {activeUserBorrowings.length}
                  </span>
                )}
              </NavLink>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white/90 hover:bg-white border border-sky-200 hover:border-brand-300 rounded-xl transition-all shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-brand-600" />
              <span>Sign In / Login</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-white/85 transition-colors border border-transparent hover:border-sky-200"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                    }}
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-navy-900 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-navy-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/my-books"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <BookmarkCheck className="w-4 h-4 text-slate-400" />
                      My Borrowed Books
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-sm shadow-brand-600/20"
              >
                Join Library
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/login"
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white/90 text-slate-700 border border-sky-200 flex items-center gap-1"
            >
              <LogIn className="w-3 h-3 text-brand-600" />
              Sign In
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-navy-900 hover:bg-white/80 rounded-xl transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sky-200 bg-sky-100/95 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-700'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-700'
              }`
            }
          >
            Book Catalog
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/my-books"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-700'
                }`
              }
            >
              My Borrowed Books ({activeUserBorrowings.length})
            </NavLink>
          )}

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-xs font-bold text-navy-900">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold px-2 py-1 hover:bg-rose-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg flex items-center justify-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-brand-600" />
                  Sign In / Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold text-white bg-brand-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
