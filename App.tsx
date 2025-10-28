

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// Fix: Corrected import path for AppContext
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProductListPage from './pages/ProductListPage';
import SearchPage from './pages/SearchPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
// Fix: Corrected import path for ProductFormPage
import ProductFormPage from './pages/admin/ProductFormPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import MessagesPage from './pages/MessagesPage';
import AdminChatPage from './pages/admin/AdminChatPage';
import ProfilePage from './pages/ProfilePage';
import AdminArchivedProductsPage from './pages/admin/AdminArchivedProductsPage';
import { WhatsAppIcon } from './components/icons';
import AdminCollectionsPage from './pages/admin/AdminCollectionsPage';
import CollectionFormPage from './pages/admin/CollectionFormPage';
import WishlistPage from './pages/WishlistPage';
import type { ToastMessage } from './types';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAppContext();
    return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" replace />;
}

const ToastIcon: React.FC<{ type: 'success' | 'error' | 'info' }> = ({ type }) => {
    switch (type) {
        case 'success':
            return (
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                </div>
            );
        case 'error':
            return (
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </div>
            );
        default:
            return (
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                </div>
            );
    }
}

const ToastItem: React.FC<{ toast: ToastMessage, onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    return (
        <div className="w-full max-w-xs p-4 text-on-surface-secondary bg-surface rounded-lg shadow-lg flex items-center space-x-3" role="alert" style={{ animation: 'fade-in-down 0.5s' }}>
            <ToastIcon type={toast.type} />
            <div className="text-sm font-normal flex-1">{toast.message}</div>
            <button type="button" className="-mx-1.5 -my-1.5 bg-surface text-on-surface-secondary hover:text-on-surface rounded-lg p-1.5 hover:bg-surface-light inline-flex h-8 w-8" aria-label="Close" onClick={() => onRemove(toast.id)}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </div>
    );
};

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useAppContext();

    return (
        <div className="fixed top-24 right-4 z-50 space-y-3 w-full max-w-xs">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

const WhatsAppButton: React.FC = () => {
    const location = useLocation();
    
    // Do not show the button in the admin panel
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    const phoneNumber = "521234567890"; // Replace with the actual phone number
    const message = "Hola, me gustaría obtener más información sobre sus productos.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-30 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-float-in"
            aria-label="Contactar por WhatsApp"
        >
            <WhatsAppIcon className="w-8 h-8"/>
        </a>
    );
};

const AppRoutes: React.FC = () => {
    const { user } = useAppContext();
    return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <ToastContainer />
          <main className="flex-grow">
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/archived" element={<AdminArchivedProductsPage />} />
                  <Route path="products/new" element={<ProductFormPage />} />
                  <Route path="products/edit/:productId" element={<ProductFormPage />} />
                  <Route path="collections" element={<AdminCollectionsPage />} />
                  <Route path="collections/new" element={<CollectionFormPage />} />
                  <Route path="collections/edit/:collectionId" element={<CollectionFormPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
                  <Route path="chat/:customerId" element={<AdminChatPage />} />
              </Route>
              
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/category/:categoryId" element={<ProductListPage />} />
              <Route path="/collection/:collectionId" element={<ProductListPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

              {/* Protected Customer Routes */}
              <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
              <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <WhatsAppButton />
          <Footer />
        </div>
    );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;