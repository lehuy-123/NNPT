import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Category from './pages/Category';
import Auth from './pages/Auth';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Cấu hình các Route động cho Danh mục */}
          <Route path="/category/:name" element={<Category />} />
          <Route path="/deals" element={<Category isDeals={true} />} />
          
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Profile enforceAdmin={true} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
    </AuthProvider>
  );
}

export default App;
