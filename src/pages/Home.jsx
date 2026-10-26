import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgVideo from '../assets/video3.mp4';
import {
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Compass,
  Award,
  BookmarkCheck,
  ChevronRight
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/books/BookCard';
import { CATEGORIES } from '../data/mockBooks';

export const Home = () => {
  const { books, borrowings, members } = useLibrary();
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  // Filter books for home sections
  const featuredBooks = books.filter((b) => b.featured).slice(0, 4);
  const popularBooks = books.filter((b) => b.popular).slice(0, 4);

  // Category counts
  const getCategoryCount = (category) => {
    return books.filter((b) => b.category === category).length;
  };

  const totalCopiesAvailable = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const totalBorrowed = borrowings.filter((br) => br.status === 'approved' || br.status === 'overdue').length;

  return (
    <div className="pb-16">
      {/* Hero Section with Video Background - No empty space gap */}
      <section className="relative overflow-hidden w-full flex flex-col justify-center pt-10 sm:pt-14 pb-16 sm:pb-20">
        {/* Background Video - 100% Pure Crystal Clear Without Any Filters or Overlays */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center pointer-events-none"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>

        {/* 100% Raw Crystal Clear Video - No overlay covering it */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full my-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 text-navy-900 border border-brand-200 shadow-sm mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-navy-900 tracking-wide">
              Next-Generation Public Knowledge System
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight max-w-4xl mx-auto leading-[1.12] drop-shadow-[0_2px_16px_rgba(255,255,255,1)]">
            Discover Your Next{' '}
            <span className="bg-gradient-to-r from-brand-600 via-brand-700 to-cyan-600 bg-clip-text text-transparent">
              Favorite Book
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-navy-950 max-w-2xl mx-auto leading-relaxed font-bold drop-shadow-[0_2px_10px_rgba(255,255,255,1)]">
            Welcome to DanumaLK. Browse curated physical and digital library collections, borrow books, and manage loans in seconds.
          </p>

          {/* Hero Search Bar */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
            <form onSubmit={handleHeroSearch} className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-brand-600" />
              </div>
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search by title, author, subject, or ISBN..."
                className="w-full pl-12 pr-32 py-4 text-sm sm:text-base bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-300 shadow-2xl shadow-slate-900/10 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-navy-900"
              />
              <button
                type="submit"
                className="absolute right-2.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-brand-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Find Book</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-navy-950 font-bold drop-shadow-[0_1px_6px_rgba(255,255,255,1)]">
              <span className="font-extrabold text-navy-900">Trending searches:</span>
              {['Madol Doova', 'Mahavamsa', 'Mindfulness in Plain English', 'Colombo Tech'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => navigate(`/catalog?q=${encodeURIComponent(term)}`)}
                  className="hover:text-brand-700 underline underline-offset-2 decoration-slate-400 hover:decoration-brand-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/catalog"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-navy-900 hover:bg-navy-950 text-white shadow-xl shadow-navy-900/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-brand-400" />
              Browse Entire Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Main Page Sections */}
      <div className="space-y-16 sm:space-y-24">
        {/* Library Live Statistics - Light Blue Card */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-[#dbeefc] rounded-3xl border border-[#b9ddfb] shadow-xl shadow-sky-900/5">
            <div className="flex items-center gap-4 p-2 sm:p-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-brand-600 border border-[#b9ddfb] flex items-center justify-center shrink-0 shadow-2xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-navy-950">{books.length}+</p>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Catalog Titles
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 sm:p-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 border border-[#b9ddfb] flex items-center justify-center shrink-0 shadow-2xs">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-navy-950">{totalCopiesAvailable}</p>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Copies Available
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 sm:p-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 border border-[#b9ddfb] flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-navy-950">{members.length}</p>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Active Members
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 sm:p-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-cyan-600 border border-[#b9ddfb] flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-navy-950">98.4%</p>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  AI Match Accuracy
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Books Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                Librarian Curations
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                Featured Books of the Month
              </h2>
            </div>
            <Link
              to="/catalog"
              className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
            >
              <span>View All Collections</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Explore Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Broaden Your Horizons
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight mt-1">
              Browse by Disciplines & Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Select a specialized department to inspect catalog availability and related readings.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.filter((c) => c !== 'All').map((category) => {
              const count = getCategoryCount(category);
              return (
                <Link
                  key={category}
                  to={`/catalog?category=${encodeURIComponent(category)}`}
                  className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-navy-900 text-sm group-hover:text-brand-600 transition-colors">
                      {category}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{count} Volumes Cataloged</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Popular Books Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                Most Circulated
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                Community Favorites & Bestsellers
              </h2>
            </div>
            <Link
              to="/catalog?sort=rating"
              className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
            >
              <span>Top Rated Works</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Bottom CTA for Registration */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-navy-950">
              Join Thousands of Passionate Readers Today
            </h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Experience effortless online borrowing, personalized AI curations, and access to premium knowledge archives.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-500/25 transition-all"
              >
                Get Your Digital Member Card
              </Link>
              <Link
                to="/catalog"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 transition-all"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
