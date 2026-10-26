import React from 'react';
import { Link } from 'react-router-dom';
import { BookX, ArrowLeft, Home, Search } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-brand-600 flex items-center justify-center mx-auto border border-blue-100">
          <BookX className="w-10 h-10" />
        </div>
        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider">
          Error 404
        </span>
        <h1 className="text-3xl font-black text-navy-950 tracking-tight">
          Page or Volume Missing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The catalog path or page you are attempting to access does not exist in our system archives or has been reorganized.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 hover:bg-brand-700 transition-all flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            to="/catalog"
            className="px-5 py-2.5 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            Search Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};
