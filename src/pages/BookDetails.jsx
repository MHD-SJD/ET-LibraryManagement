import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { BorrowModal } from '../components/books/BorrowModal';
import { BookCard } from '../components/books/BookCard';
import {
  ArrowLeft,
  Star,
  BookmarkPlus,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Shield,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, getBookById } = useLibrary();
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);

  const book = getBookById(id);

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-950">Book Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested book volume does not exist or has been removed from the catalog.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const relatedBooks = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-navy-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          Back to Previous Page
        </button>
      </div>

      {/* Main Details Hero */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cover Column */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
            <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-navy-900 shadow-sm">
                {book.category}
              </div>
            </div>

            {/* Availability status badge */}
            <div className="w-full max-w-sm mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Circulation Status:</span>
                <span className={isAvailable ? 'text-emerald-600' : 'text-rose-600'}>
                  {isAvailable ? 'In Stock & Ready' : 'Fully Checked Out'}
                </span>
              </div>

              {/* Progress bar of available copies */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${(book.availableCopies / (book.totalCopies || 1)) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>{book.availableCopies} Copies Available</span>
                <span>{book.totalCopies} Total Copies</span>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => setBorrowModalOpen(true)}
              disabled={!isAvailable}
              className={`w-full max-w-sm mt-4 py-3.5 px-6 rounded-2xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isAvailable
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              {isAvailable ? 'Request to Borrow This Book' : 'Currently Unavailable'}
            </button>
          </div>

          {/* Metadata Column */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                {book.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mt-1 leading-tight">
                {book.title}
              </h1>
              <p className="text-base text-slate-600 mt-2 font-medium">
                Authored by <span className="text-navy-900 font-bold">{book.author}</span>
              </p>
            </div>

            {/* Ratings and Stats row */}
            <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-100">
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200/80">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{book.rating} / 5.0</span>
                <span className="text-amber-600 font-normal">({book.reviewsCount} reviews)</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Published {book.publicationYear}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>{book.pages || 320} Pages</span>
              </div>
            </div>

            {/* AI Summary Card */}
            {book.aiSummary && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-cyan-50/50 to-indigo-50/60 border border-blue-100/90 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-700">
                  <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
                  <span>AuraLib LK AI Executive Takeaway</span>
                </div>
                <p className="text-xs sm:text-sm text-navy-900 leading-relaxed font-medium">
                  "{book.aiSummary}"
                </p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                Book Synopsis
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Book Details Specification Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">ISBN</span>
                <span className="text-xs font-mono font-semibold text-navy-900">{book.isbn}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Publisher</span>
                <span className="text-xs font-semibold text-navy-900 truncate block">
                  {book.publisher || 'Academic Press'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Language</span>
                <span className="text-xs font-semibold text-navy-900">{book.language || 'English'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Format</span>
                <span className="text-xs font-semibold text-navy-900">Hardcover / EPUB</span>
              </div>
            </div>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Related Topics & Index
                </span>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Books in Category */}
      {relatedBooks.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                More in {book.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 tracking-tight">
                Related Reading Recommendations
              </h2>
            </div>
            <Link
              to={`/catalog?category=${encodeURIComponent(book.category)}`}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              View category
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </div>
      )}

      {/* Borrow Modal */}
      <BorrowModal
        isOpen={borrowModalOpen}
        onClose={() => setBorrowModalOpen(false)}
        book={book}
      />
    </div>
  );
};
