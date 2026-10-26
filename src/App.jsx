import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { BookDetails } from './pages/BookDetails';
import { MyBooks } from './pages/MyBooks';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageBooks } from './pages/admin/ManageBooks';
import { ManageMembers } from './pages/admin/ManageMembers';
import { BorrowingManagement } from './pages/admin/BorrowingManagement';
import { BorrowingHistory } from './pages/admin/BorrowingHistory';
import { AdminSettings } from './pages/admin/AdminSettings';

// Chatbot
import { FloatingChatbot } from './chatbot/chatbot';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <LibraryProvider>
            <Routes>
              {/* Public Portal Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/recommendations" element={<Navigate to="/catalog" replace />} />
                <Route path="/my-books" element={<MyBooks />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Admin Portal Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="books" element={<ManageBooks />} />
                <Route path="members" element={<ManageMembers />} />
                <Route path="borrowings" element={<BorrowingManagement />} />
                <Route path="history" element={<BorrowingHistory />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingChatbot />
          </LibraryProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
