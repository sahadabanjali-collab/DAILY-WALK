import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { Toast } from './components/common/Toast';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { CategoryPage } from './pages/Category';
import { ProductDetails } from './pages/ProductDetails';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { ShippingInfoPage } from './pages/ShippingInfoPage';
import { ReturnsExchangesPage } from './pages/ReturnsExchangesPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { CareersPage } from './pages/CareersPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { BlogPage } from './pages/BlogPage';
import { StoreLocatorPage } from './pages/StoreLocatorPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

import { StoreDataProvider } from './context/StoreDataContext';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
        <Toast />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#111111] antialiased selection:bg-[#E53935] selection:text-white font-sans">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />

          {/* Gender & Category Landing Pages */}
          <Route path="/men" element={<CategoryPage />} />
          <Route path="/women" element={<CategoryPage />} />
          <Route path="/kids" element={<CategoryPage />} />
          <Route path="/sports" element={<CategoryPage />} />
          <Route path="/casual" element={<CategoryPage />} />
          <Route path="/formal" element={<CategoryPage />} />
          <Route path="/sale" element={<CategoryPage />} />

          {/* Product Details */}
          <Route path="/product/:slug" element={<ProductDetails />} />

          {/* Cart & Wishlist */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Checkout & Order Success */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />

          {/* Helper & Informational Pages (Not in Navbar) */}
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping-info" element={<ShippingInfoPage />} />
          <Route path="/shipping" element={<ShippingInfoPage />} />
          <Route path="/returns" element={<ReturnsExchangesPage />} />
          <Route path="/returns-exchanges" element={<ReturnsExchangesPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/stores" element={<StoreLocatorPage />} />
          <Route path="/store-locator" element={<StoreLocatorPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/account" element={<AccountPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Shop />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Overlay Drawers & Toasts */}
      <CartDrawer />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <StoreDataProvider>
            <CartProvider>
              <WishlistProvider>
                <ScrollToTop />
                <AppLayout />
              </WishlistProvider>
            </CartProvider>
          </StoreDataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
