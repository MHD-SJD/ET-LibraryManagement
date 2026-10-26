import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { StatusBadge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  BookOpen,
  Clock,
  Calendar,
  AlertTriangle,
  RotateCcw,
  XCircle,
  CheckCircle2,
  BookmarkCheck,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const MyBooks = () => {
  const { user, isAuthenticated } = useAuth();
  const { borrowings, cancelRequest, renewBook, returnBook } = useLibrary();

  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'pending' | 'history'
  const [cancellingBorrowId, setCancellingBorrowId] = useState(null);
  const [returningBorrowId, setReturningBorrowId] = useState(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-navy-950">Member Sign-In Required</h2>
        <p className="text-sm text-slate-500">
          Please log in with your library membership credentials or select the demo member profile to view your borrowed books and request statuses.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20"
        >
          Sign In to Member Portal
        </Link>
      </div>
    );
  }

  // Filter borrowings belonging to current user
  const userBorrowings = borrowings.filter((br) => br.memberId === user.id);

  const currentLoans = userBorrowings.filter(
    (br) => br.status === 'approved' || br.status === 'overdue'
  );
  const pendingRequests = userBorrowings.filter((br) => br.status === 'pending');
  const pastHistory = userBorrowings.filter(
    (br) => br.status === 'returned' || br.status === 'rejected'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Member Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/10 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950">{user.name}</h1>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                {user.status || 'Active Member'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Member ID: <span className="font-mono font-bold text-navy-900">{user.membershipId}</span> • {user.email}
            </p>
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-initial px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Loans</span>
            <span className="text-lg font-black text-navy-900">{currentLoans.length}</span>
          </div>
          <div className="flex-1 md:flex-initial px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending</span>
            <span className="text-lg font-black text-amber-600">{pendingRequests.length}</span>
          </div>
          <div className="flex-1 md:flex-initial px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Borrowed</span>
            <span className="text-lg font-black text-brand-600">{userBorrowings.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('current')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'current'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          Currently Borrowed ({currentLoans.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'pending'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending Requests ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'history'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Borrowing History ({pastHistory.length})
        </button>
      </div>

      {/* TAB 1: Currently Borrowed Books */}
      {activeTab === 'current' && (
        <div className="space-y-4">
          {currentLoans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLoans.map((item) => {
                const isOverdue = item.status === 'overdue';
                return (
                  <div
                    key={item.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.bookCover}
                        alt={item.bookTitle}
                        className="w-16 h-24 object-cover rounded-xl shadow-xs border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {item.category}
                          </span>
                          <StatusBadge status={item.status} />
                        </div>
                        <h4 className="font-bold text-navy-900 text-sm mt-1 truncate">
                          <Link to={`/books/${item.bookId}`} className="hover:text-brand-600">
                            {item.bookTitle}
                          </Link>
                        </h4>
                        <p className="text-xs text-slate-500">By {item.bookAuthor}</p>

                        <div className="mt-3 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Borrowed on: {item.borrowDate || 'N/A'}</span>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 font-bold ${
                              isOverdue ? 'text-rose-600' : 'text-slate-800'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Due Date: {item.dueDate || 'N/A'}</span>
                            {isOverdue && <span className="text-rose-500 text-[10px] uppercase">(Past Due)</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => renewBook(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Extend due date by 7 days"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Renew (+7 Days)
                      </button>

                      <button
                        onClick={() => setReturningBorrowId(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
              <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-navy-900 text-base">No Active Borrowings</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You do not currently have any checked-out books. Explore our catalog and reserve your next read!
              </p>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold mt-2"
              >
                Browse Books Catalog
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Pending Requests */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.bookCover}
                      alt={item.bookTitle}
                      className="w-16 h-24 object-cover rounded-xl shadow-xs border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {item.category}
                        </span>
                        <StatusBadge status="Pending" />
                      </div>
                      <h4 className="font-bold text-navy-900 text-sm mt-1 truncate">
                        <Link to={`/books/${item.bookId}`} className="hover:text-brand-600">
                          {item.bookTitle}
                        </Link>
                      </h4>
                      <p className="text-xs text-slate-500">By {item.bookAuthor}</p>

                      <div className="mt-3 text-xs text-slate-500 space-y-1">
                        <p>Requested on: {item.requestDate}</p>
                        <p className="italic text-slate-400">"{item.notes || 'No note provided'}"</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Awaiting librarian review
                    </span>

                    <button
                      onClick={() => setCancellingBorrowId(item.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
              <Clock className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-navy-900 text-base">No Pending Requests</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You have no pending requests awaiting librarian approval.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Borrowing History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {pastHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-6">Book Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Borrow Date</th>
                    <th className="py-3.5 px-4">Return Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pastHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-navy-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.bookCover}
                            alt={item.bookTitle}
                            className="w-8 h-12 object-cover rounded shadow-2xs shrink-0"
                          />
                          <div>
                            <p className="font-bold text-navy-900">{item.bookTitle}</p>
                            <p className="text-[11px] text-slate-400">By {item.bookAuthor}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{item.category}</td>
                      <td className="py-4 px-4 text-slate-600">{item.borrowDate || item.requestDate}</td>
                      <td className="py-4 px-4 text-slate-600">{item.returnDate || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/books/${item.bookId}`}
                          className="text-brand-600 hover:text-brand-800 font-bold"
                        >
                          View Book
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 p-6 space-y-2">
              <RotateCcw className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No completed borrowings yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Cancel Request Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancellingBorrowId}
        onClose={() => setCancellingBorrowId(null)}
        onConfirm={() => cancelRequest(cancellingBorrowId)}
        title="Cancel Borrowing Request?"
        message="Are you sure you want to withdraw this pending borrowing request? You will lose your spot in the queue."
        confirmText="Yes, Cancel Request"
        type="danger"
      />

      {/* Return Book Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!returningBorrowId}
        onClose={() => setReturningBorrowId(null)}
        onConfirm={() => returnBook(returningBorrowId)}
        title="Confirm Book Return"
        message="Have you returned this physical copy to the library returns desk or smart return chute?"
        confirmText="Confirm Return"
        type="info"
      />
    </div>
  );
};
