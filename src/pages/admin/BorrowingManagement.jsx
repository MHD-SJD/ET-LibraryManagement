import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { StatusBadge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Pagination } from '../../components/common/Pagination';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  RotateCcw,
  Search,
  Clock,
  Calendar,
  AlertTriangle,
  User,
  BookOpen
} from 'lucide-react';

export const BorrowingManagement = () => {
  const { borrowings, approveBorrow, rejectBorrow, returnBook } = useLibrary();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Confirmation dialogs
  const [rejectingBorrowId, setRejectingBorrowId] = useState(null);
  const [returningBorrowId, setReturningBorrowId] = useState(null);

  const filteredBorrowings = useMemo(() => {
    return borrowings.filter((br) => {
      const matchSearch =
        !searchTerm.trim() ||
        br.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        br.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        br.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        br.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || br.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [borrowings, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredBorrowings.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBorrowings.slice(start, start + itemsPerPage);
  }, [filteredBorrowings, currentPage]);

  const counts = {
    all: borrowings.length,
    pending: borrowings.filter((b) => b.status === 'pending').length,
    approved: borrowings.filter((b) => b.status === 'approved').length,
    overdue: borrowings.filter((b) => b.status === 'overdue').length,
    returned: borrowings.filter((b) => b.status === 'returned').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
          Circulation & Borrowing Management
        </h2>
        <p className="text-xs text-slate-500">
          Process member checkout requests, mark returned copies, and monitor overdue notices
        </p>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { id: 'all', label: 'All Records', count: counts.all, color: 'text-slate-800' },
          { id: 'pending', label: 'Pending Requests', count: counts.pending, color: 'text-amber-600' },
          { id: 'approved', label: 'Active Loans', count: counts.approved, color: 'text-brand-600' },
          { id: 'overdue', label: 'Overdue Notices', count: counts.overdue, color: 'text-rose-600' },
          { id: 'returned', label: 'Returned Books', count: counts.returned, color: 'text-emerald-600' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setStatusFilter(tab.id);
              setCurrentPage(1);
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-white border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                : 'bg-white/60 border-slate-200/80 hover:bg-white'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-500 block truncate">{tab.label}</span>
            <span className={`text-xl font-extrabold ${tab.color}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by book title, borrower name, or borrow ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:block">
          Showing {filteredBorrowings.length} records
        </span>
      </div>

      {/* Borrowing Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-6">ID / Book</th>
                <th className="py-3.5 px-4">Borrower Details</th>
                <th className="py-3.5 px-4">Dates & Due</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Circulation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.bookCover}
                        alt={item.bookTitle}
                        className="w-9 h-13 object-cover rounded shadow-2xs shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <span className="text-[10px] font-mono font-bold text-slate-400 block">
                          {item.id}
                        </span>
                        <p className="font-bold text-navy-900 truncate">{item.bookTitle}</p>
                        <p className="text-[11px] text-slate-400">{item.category}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-navy-900">{item.memberName}</p>
                    <p className="text-[11px] text-slate-400">{item.memberEmail}</p>
                    {item.notes && (
                      <p className="text-[10px] text-slate-500 italic mt-0.5 max-w-[200px] truncate">
                        "{item.notes}"
                      </p>
                    )}
                  </td>

                  <td className="py-3.5 px-4 space-y-0.5 text-slate-600">
                    <p className="flex items-center gap-1">
                      <span className="text-slate-400">Requested:</span> {item.requestDate}
                    </p>
                    {item.dueDate && (
                      <p className="font-semibold text-navy-900 flex items-center gap-1">
                        <span className="text-slate-400">Due:</span> {item.dueDate}
                      </p>
                    )}
                    {item.returnDate && (
                      <p className="text-emerald-700 font-medium">Returned: {item.returnDate}</p>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveBorrow(item.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectingBorrowId(item.id)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      )}

                      {(item.status === 'approved' || item.status === 'overdue') && (
                        <button
                          onClick={() => setReturningBorrowId(item.id)}
                          className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Mark Returned
                        </button>
                      )}

                      {item.status === 'returned' && (
                        <span className="text-[11px] text-emerald-600 font-semibold">
                          Returned & Restocked
                        </span>
                      )}

                      {item.status === 'rejected' && (
                        <span className="text-[11px] text-slate-400">Denied</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredBorrowings.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Reject Request Dialog */}
      <ConfirmDialog
        isOpen={!!rejectingBorrowId}
        onClose={() => setRejectingBorrowId(null)}
        onConfirm={() => rejectBorrow(rejectingBorrowId)}
        title="Reject Borrow Request?"
        message="Are you sure you want to reject this borrowing request? The member will be notified."
        confirmText="Reject Request"
        type="danger"
      />

      {/* Return Book Dialog */}
      <ConfirmDialog
        isOpen={!!returningBorrowId}
        onClose={() => setReturningBorrowId(null)}
        onConfirm={() => returnBook(returningBorrowId)}
        title="Confirm Return & Restock?"
        message="Marking this book as returned will increment the available copies in the catalog and close the loan."
        confirmText="Confirm Return"
        type="info"
      />
    </div>
  );
};
