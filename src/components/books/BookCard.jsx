import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, BookmarkPlus, Check, ArrowRight } from 'lucide-react';
import { BorrowModal } from './BorrowModal';

export const BookCard = ({ book }) => {
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const isAvailable = book.availableCopies > 0;

  return (
    <>
      <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col overflow-hidden">
        {/* Cover Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
          <img
            src={book.coverImage}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';
            }}
          />

          {/* Top badges overlay */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-white/95 backdrop-blur-md text-navy-900 shadow-sm border border-slate-200/50">
              {book.category}
            </span>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-bold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{book.rating}</span>
            </div>
          </div>

          {/* Availability bar overlay at bottom of image */}
          <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-md ${isAvailable
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-rose-500/90 text-white'
                }`}
            >
              {isAvailable ? `${book.availableCopies} Copies Available` : 'All Checked Out'}
            </span>
            <span className="text-[11px] text-white/90 font-medium">
              Year {book.publicationYear}
            </span>
          </div>
        </div>

        {/* Content details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-navy-900 text-base leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
              <Link to={`/books/${book.id}`}>{book.title}</Link>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium truncate">
              By <span className="text-slate-700">{book.author}</span>
            </p>
            <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Card footer actions */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
            <Link
              to={`/books/${book.id}`}
              className="flex-1 text-center py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              onClick={() => setBorrowModalOpen(true)}
              disabled={!isAvailable}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs ${isAvailable
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              {isAvailable ? 'Borrow' : 'Waitlist'}
            </button>
          </div>
        </div>
      </div>

      <BorrowModal
        isOpen={borrowModalOpen}
        onClose={() => setBorrowModalOpen(false)}
        book={book}
      />
    </>
  );
};
