import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import './App.css'; // Assuming you have some global styles here

const Navbar: React.FC = () => {
  return (
    <nav>
      <Link to="/">Shop</Link>
      <Link to="/cart">Shopping Cart</Link>
      <Link to="/history">History</Link>
    </nav>
  );
};

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
        <Route path="/history" element={<OrderHistoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
