import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DealsPage } from './pages/DealsPage'; // <-- Import DealsPage
import { FreeGamesPage } from './pages/FreeGamesPage'; // <-- Import FreeGamesPage

export function App() {
  return (
    <Routes>
      {/* Login/Signup pages are standalone */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Main pages are accessible to everyone */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="deals" element={<DealsPage />} /> {/* <-- Add Deals Route */}
        <Route path="free" element={<FreeGamesPage />} /> {/* <-- Add Free Route */}
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="confirmation" element={<OrderConfirmationPage />} />
      </Route>
      
      {/* TODO: Add a 404 Page */}
    </Routes>
  );
}

