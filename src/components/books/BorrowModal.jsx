import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export const BorrowModal = ({ isOpen, onClose, book }) => {
  const { requestBorrow, settings } = useLibrary();
  const { user, isAuthenticated } = useAuth();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!book) return null;

  const handleBorrow = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = requestBorrow(book.id, notes);
    setIsSubmitting(false);
    if (result.success) {
      setNotes('');
      onClose();
    }
  };

  const loanDays = settings.loanDurationDays || 14;
  const returnDatePreview = new Date();
  returnDatePreview.setDate(returnDatePreview.getDate() + loanDays);
  const formattedReturnDate = returnDatePreview.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request to Borrow Book"
      subtitle="Complete your borrowing request for library checkout."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleBorrow} className="space-y-5">
        {/* Book Preview Header */}
        <div className="flex gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-16 h-24 object-cover rounded-lg shadow-sm border border-slate-200 shrink-0"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';
            }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-wide">
              {book.category}
            </span>
            <h4 className="font-bold text-navy-900 text-sm leading-snug truncate mt-0.5">
              {book.title}
            </h4>
            <p className="text-xs text-slate-500 truncate">By {book.author}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-200">
                {book.availableCopies} Copies Available
              </span>
              <span className="text-xs text-slate-400">ISBN: {book.isbn}</span>
            </div>
          </div>
        </div>

        {/* Loan Policy terms */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-navy-900">Loan Duration</p>
              <p className="text-slate-500">{loanDays} days from approval</p>
            </div>
          </div>
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-navy-900">Estimated Due Date</p>
              <p className="text-slate-500">{formattedReturnDate}</p>
            </div>
          </div>
        </div>

        {/* Borrower Info */}
        {isAuthenticated && user && (
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Borrower</span>
              <span className="font-semibold text-navy-900">{user.name}</span> ({user.email})
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
              {user.membershipId || 'Member'}
            </span>
          </div>
        )}

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-semibold text-navy-900 mb-1.5">
            Borrowing Note or Purpose (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Research paper preparation, exam study, personal reading..."
            rows={2}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || book.availableCopies <= 0}
            className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm Request
          </button>
        </div>
      </form>
    </Modal>
  );
};
