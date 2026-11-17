import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import MenuSection from './components/MenuSection';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import QrTableModal from './components/QrTableModal';
import ItemQuickViewModal from './components/ItemQuickViewModal';
import StaffDashboard from './components/StaffDashboard';
import Footer from './components/Footer';

function AppContent() {
  const [currentView, setCurrentView] = useState('customer'); // 'customer' | 'staff'

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {currentView === 'customer' ? (
        <>
          <Navbar currentView={currentView} setCurrentView={setCurrentView} />
          
          <main className="flex-1">
            <MenuSection />
          </main>

          <Footer setCurrentView={setCurrentView} />
        </>
      ) : (
        <StaffDashboard onReturnToCustomer={() => setCurrentView('customer')} />
      )}

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrderTrackerModal />
      <QrTableModal />
      <ItemQuickViewModal />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ToastProvider>
  );
}
