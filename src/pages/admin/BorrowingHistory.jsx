import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { StatusBadge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import {
  History,
  Search,
  Download,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const BorrowingHistory = () => {
  const { borrowings } = useLibrary();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredHistory = useMemo(() => {
    return borrowings.filter((item) => {
      const matchSearch =
        !searchTerm.trim() ||
        item.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [borrowings, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(start, start + itemsPerPage);
  }, [filteredHistory, currentPage]);

  const handleExportCSV = () => {
    showToast('Exporting transaction audit log to CSV format (Simulated)...', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
            Complete Circulation History & Audit Log
          </h2>
          <p className="text-xs text-slate-500">
            Immutable log of all historical borrowing requests, returns, renewals, and overdue records
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-brand-600" />
          Export Audit Report
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search audit trail by book, patron name, or transaction ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-navy-900 focus:outline-none"
          >
            <option value="All">All Transactions</option>
            <option value="Approved">Approved Loans</option>
            <option value="Pending">Pending Reviews</option>
            <option value="Returned">Completed Returns</option>
            <option value="Overdue">Overdue Violations</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-6">Transaction ID</th>
                <th className="py-3.5 px-4">Book Title</th>
                <th className="py-3.5 px-4">Patron</th>
                <th className="py-3.5 px-4">Issued On</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Resolved Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-500">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-navy-900 truncate max-w-[200px]">
                    {item.bookTitle}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {item.memberName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {item.borrowDate || item.requestDate}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {item.dueDate || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {item.returnDate || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3.5 px-6 text-right text-slate-400 italic truncate max-w-[150px]">
                    {item.notes || 'Routine circulation'}
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
          totalItems={filteredHistory.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};
