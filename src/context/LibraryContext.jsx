import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_BOOKS } from '../data/mockBooks';
import { INITIAL_BORROWINGS } from '../data/mockBorrowings';
import { INITIAL_MEMBERS } from '../data/mockUsers';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const LibraryContext = createContext(null);

const DEFAULT_SETTINGS = {
  libraryName: "AuraLib National Smart Library - Colombo",
  loanDurationDays: 14,
  maxBorrowLimit: 5,
  finePerDay: 20.00, // LKR 20.00 / day
  emailNotifications: true,
  aiEngineVersion: "NeuralRec v2.4 (Colombo Heuristic)",
  contactEmail: "support@auralib.lk",
  operatingHours: "Mon-Sat: 08:00 - 20:00 | Sun & Poya: 09:00 - 15:00"
};

export const LibraryProvider = ({ children }) => {
  const { showToast } = useToast();
  const { user } = useAuth();

  // Books State with automatic migration to Sri Lankan books
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('auralib_books');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed.some(b => b.title.includes('Clean Architecture'))) {
          return INITIAL_BOOKS;
        }
        return parsed;
      }
      return INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  // Borrowings State with migration check
  const [borrowings, setBorrowings] = useState(() => {
    try {
      const saved = localStorage.getItem('auralib_borrowings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed.some(b => b.memberName === 'Julian Thorne')) {
          return INITIAL_BORROWINGS;
        }
        return parsed;
      }
      return INITIAL_BORROWINGS;
    } catch {
      return INITIAL_BORROWINGS;
    }
  });

  // Members State with migration check
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('auralib_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed.some(m => m.name === 'Julian Thorne')) {
          return INITIAL_MEMBERS;
        }
        return parsed;
      }
      return INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  // Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('auralib_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.libraryName && !parsed.libraryName.includes('Colombo')) {
          return DEFAULT_SETTINGS;
        }
        return parsed;
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('auralib_books', JSON.stringify(books));
    } catch (e) {
      console.error(e);
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('auralib_borrowings', JSON.stringify(borrowings));
    } catch (e) {
      console.error(e);
    }
  }, [borrowings]);

  useEffect(() => {
    try {
      localStorage.setItem('auralib_members', JSON.stringify(members));
    } catch (e) {
      console.error(e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem('auralib_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Book CRUD
  const addBook = (newBookData) => {
    const id = `b-${Date.now().toString().slice(-4)}`;
    const totalCopies = parseInt(newBookData.totalCopies, 10) || 1;
    const availableCopies = parseInt(newBookData.availableCopies ?? totalCopies, 10);

    const book = {
      ...newBookData,
      id,
      totalCopies,
      availableCopies: Math.min(availableCopies, totalCopies),
      rating: parseFloat(newBookData.rating) || 4.5,
      reviewsCount: parseInt(newBookData.reviewsCount, 10) || 1,
      publicationYear: parseInt(newBookData.publicationYear, 10) || new Date().getFullYear(),
      coverImage: newBookData.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
      tags: Array.isArray(newBookData.tags) ? newBookData.tags : (newBookData.tags ? newBookData.tags.split(',').map(s => s.trim()) : ['General']),
      featured: !!newBookData.featured,
      popular: !!newBookData.popular
    };

    setBooks((prev) => [book, ...prev]);
    showToast(`Book "${book.title}" added successfully!`, 'success');
    return book;
  };

  const updateBook = (id, updatedData) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id === id) {
          const totalCopies = parseInt(updatedData.totalCopies ?? book.totalCopies, 10);
          const rawAvailable = parseInt(updatedData.availableCopies ?? book.availableCopies, 10);
          const availableCopies = Math.max(0, Math.min(rawAvailable, totalCopies));

          return {
            ...book,
            ...updatedData,
            totalCopies,
            availableCopies,
            tags: Array.isArray(updatedData.tags) ? updatedData.tags : (updatedData.tags ? updatedData.tags.split(',').map(s => s.trim()) : book.tags)
          };
        }
        return book;
      })
    );
    showToast('Book details updated successfully!', 'success');
  };

  const deleteBook = (id) => {
    const target = books.find((b) => b.id === id);
    // Check if book has active approved or pending borrowings
    const hasActiveBorrowing = borrowings.some(
      (br) => br.bookId === id && (br.status === 'approved' || br.status === 'pending' || br.status === 'overdue')
    );

    if (hasActiveBorrowing) {
      showToast(`Cannot delete "${target?.title}" because it has active or pending borrowings.`, 'error');
      return false;
    }

    setBooks((prev) => prev.filter((b) => b.id !== id));
    showToast(`Book "${target?.title || id}" removed from catalog.`, 'info');
    return true;
  };

  const getBookById = (id) => {
    return books.find((b) => b.id === id);
  };

  // Borrowing Logic
  const requestBorrow = (bookId, notes = '') => {
    if (!user) {
      showToast('Please sign in or select a demo account to borrow books.', 'warning');
      return { success: false, reason: 'auth_required' };
    }

    const book = books.find((b) => b.id === bookId);
    if (!book) {
      showToast('Book not found.', 'error');
      return { success: false, reason: 'not_found' };
    }

    if (book.availableCopies <= 0) {
      showToast(`Sorry, all copies of "${book.title}" are currently borrowed.`, 'error');
      return { success: false, reason: 'no_copies' };
    }

    // Check if user already has an active or pending request for this exact book
    const existing = borrowings.find(
      (br) => br.bookId === bookId && br.memberId === user.id && (br.status === 'approved' || br.status === 'pending' || br.status === 'overdue')
    );

    if (existing) {
      showToast(`You already have an active or pending request for "${book.title}".`, 'warning');
      return { success: false, reason: 'already_requested' };
    }

    // Check member's active borrow count limit
    const userActiveCount = borrowings.filter(
      (br) => br.memberId === user.id && (br.status === 'approved' || br.status === 'pending')
    ).length;

    const limit = user.maxBorrowLimit || settings.maxBorrowLimit || 5;
    if (userActiveCount >= limit) {
      showToast(`You have reached your active borrowing limit (${limit} books). Please return a book first.`, 'warning');
      return { success: false, reason: 'limit_reached' };
    }

    const today = new Date().toISOString().split('T')[0];
    const newBorrowing = {
      id: `br-${Date.now().toString().slice(-4)}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverImage,
      category: book.category,
      memberId: user.id,
      memberName: user.name,
      memberEmail: user.email,
      requestDate: today,
      borrowDate: null,
      dueDate: null,
      returnDate: null,
      status: 'pending',
      notes: notes || 'Online portal request'
    };

    setBorrowings((prev) => [newBorrowing, ...prev]);
    showToast(`Borrow request for "${book.title}" submitted! Awaiting librarian approval.`, 'success');
    return { success: true, borrowing: newBorrowing };
  };

  const approveBorrow = (borrowId) => {
    const borrowRecord = borrowings.find((br) => br.id === borrowId);
    if (!borrowRecord) return;

    const book = books.find((b) => b.id === borrowRecord.bookId);
    if (!book || book.availableCopies <= 0) {
      showToast('Cannot approve: No available copies left in catalog.', 'error');
      return;
    }

    const today = new Date();
    const borrowDateStr = today.toISOString().split('T')[0];
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + (settings.loanDurationDays || 14));
    const dueDateStr = dueDate.toISOString().split('T')[0];

    // Decrement available copies
    setBooks((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b))
    );

    // Update borrowing record
    setBorrowings((prev) =>
      prev.map((br) =>
        br.id === borrowId
          ? {
              ...br,
              status: 'approved',
              borrowDate: borrowDateStr,
              dueDate: dueDateStr
            }
          : br
      )
    );

    showToast(`Approved borrowing request for "${borrowRecord.bookTitle}". Due date: ${dueDateStr}`, 'success');
  };

  const rejectBorrow = (borrowId, reason = 'Request denied by administrator') => {
    setBorrowings((prev) =>
      prev.map((br) =>
        br.id === borrowId
          ? { ...br, status: 'rejected', notes: reason }
          : br
      )
    );
    showToast('Borrowing request was rejected.', 'info');
  };

  const returnBook = (borrowId) => {
    const borrowRecord = borrowings.find((br) => br.id === borrowId);
    if (!borrowRecord) return;

    const todayStr = new Date().toISOString().split('T')[0];

    // Increment available copies safely
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === borrowRecord.bookId) {
          return {
            ...b,
            availableCopies: Math.min(b.totalCopies, b.availableCopies + 1)
          };
        }
        return b;
      })
    );

    // Update borrowing record
    setBorrowings((prev) =>
      prev.map((br) =>
        br.id === borrowId
          ? {
              ...br,
              status: 'returned',
              returnDate: todayStr
            }
          : br
      )
    );

    showToast(`Book "${borrowRecord.bookTitle}" has been marked as returned!`, 'success');
  };

  const cancelRequest = (borrowId) => {
    const target = borrowings.find((br) => br.id === borrowId);
    if (!target) return;

    if (target.status !== 'pending') {
      showToast('Only pending requests can be cancelled.', 'error');
      return;
    }

    setBorrowings((prev) => prev.filter((br) => br.id !== borrowId));
    showToast(`Borrow request for "${target.bookTitle}" was cancelled.`, 'info');
  };

  const renewBook = (borrowId) => {
    setBorrowings((prev) =>
      prev.map((br) => {
        if (br.id === borrowId && (br.status === 'approved' || br.status === 'overdue')) {
          const currentDue = br.dueDate ? new Date(br.dueDate) : new Date();
          const extended = new Date(currentDue);
          extended.setDate(extended.getDate() + 7);
          const newDueStr = extended.toISOString().split('T')[0];
          return {
            ...br,
            status: 'approved',
            dueDate: newDueStr,
            notes: (br.notes ? br.notes + ' | ' : '') + 'Extended by 7 days'
          };
        }
        return br;
      })
    );
    showToast('Loan renewed for 7 additional days!', 'success');
  };

  // Member Management
  const addMember = (memberData) => {
    const newMember = {
      ...memberData,
      id: `user-member-${Date.now()}`,
      membershipId: `AL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: new Date().toISOString().split('T')[0],
      status: memberData.status || 'Active',
      maxBorrowLimit: parseInt(memberData.maxBorrowLimit, 10) || 5,
      avatar: memberData.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?auto=format&fit=crop&q=80&w=200`
    };

    setMembers((prev) => [newMember, ...prev]);
    showToast(`Member "${newMember.name}" registered successfully.`, 'success');
    return newMember;
  };

  const updateMember = (id, updatedData) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m))
    );
    showToast('Member profile updated.', 'success');
  };

  const deleteMember = (id) => {
    const hasActiveLoans = borrowings.some(
      (br) => br.memberId === id && (br.status === 'approved' || br.status === 'overdue')
    );
    if (hasActiveLoans) {
      showToast('Cannot delete member with active borrowed books or overdue records.', 'error');
      return false;
    }

    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Member removed from records.', 'info');
    return true;
  };

  const toggleMemberStatus = (id) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'Active' ? 'Suspended' : 'Active';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
    showToast('Member account status updated.', 'info');
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Library system settings updated successfully.', 'success');
  };

  const resetToDefaults = () => {
    setBooks(INITIAL_BOOKS);
    setBorrowings(INITIAL_BORROWINGS);
    setMembers(INITIAL_MEMBERS);
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('auralib_books');
    localStorage.removeItem('auralib_borrowings');
    localStorage.removeItem('auralib_members');
    localStorage.removeItem('auralib_settings');
    showToast('System datasets reset to default mock records.', 'info');
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        borrowings,
        members,
        settings,
        addBook,
        updateBook,
        deleteBook,
        getBookById,
        requestBorrow,
        approveBorrow,
        rejectBorrow,
        returnBook,
        cancelRequest,
        renewBook,
        addMember,
        updateMember,
        deleteMember,
        toggleMemberStatus,
        updateSettings,
        resetToDefaults
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
