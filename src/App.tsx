import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
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
import { AccountPage } from './pages/AccountPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
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

                  {/* Helper & Informational Pages */}
                  <Route path="/size-guide" element={<SizeGuidePage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/returns" element={<ContactPage />} />
                  <Route path="/account" element={<AccountPage />} />

                  {/* Fallback Catch-all */}
                  <Route path="*" element={<Shop />} />
                </Routes>
              </main>

              <Footer />

              {/* Global Overlay Drawers & Toasts */}
              <CartDrawer />
              <Toast />
            </div>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
