import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';
import { BookOpen, Mail, Phone, MapPin, Heart, Shield, Clock } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const Footer = () => {
  const { settings } = useLibrary();

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoImg || '/logo.jpg'}
                alt="AuraLib LK Logo"
                onError={(e) => {
                  if (!e.target.src.endsWith('/logo.jpg')) {
                    e.target.src = '/logo.jpg';
                  }
                }}
                className="w-10 h-10 rounded-xl object-contain bg-white shadow-lg p-0.5"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                AuraLib<span className="text-brand-400"> LK</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering communities through accessible literature and modern digital library resources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Catalog
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/catalog" className="hover:text-brand-400 transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Information+Technology" className="hover:text-brand-400 transition-colors">
                  Technology & Coding
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Science" className="hover:text-brand-400 transition-colors">
                  Natural Sciences
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Fiction" className="hover:text-brand-400 transition-colors">
                  Fiction & Literature
                </Link>
              </li>
            </ul>
          </div>

          {/* Member & System */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Member Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/my-books" className="hover:text-brand-400 transition-colors">
                  My Borrowed Books
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-400 transition-colors">
                  Member Portal Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-400 transition-colors">
                  Get a Library Card
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-brand-400 transition-colors">
                  Librarian Dashboard
                </Link>
              </li>
              <li>
                <span className="text-slate-500 text-xs">Simulated Frontend Environment</span>
              </li>
            </ul>
          </div>

          {/* Hours & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Library Hours & Desk
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{settings.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>74 Sir Marcus Fernando Mawatha, Colombo 07, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+94 (11) 268-6142</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {settings.libraryName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              100% Client-Side Mock Architecture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
