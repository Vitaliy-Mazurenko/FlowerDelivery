import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { placeOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : [];
  });
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item._id === id ? { ...item, quantity: newQuantity } : item))
        .filter((item) => item.quantity > 0) // Remove if quantity becomes 0
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    if (!email || !phone || !address) {
      alert('Please fill in all delivery details.');
      return;
    }

    const orderItems = cart.map((item) => ({
      flower: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const orderData = {
      email,
      phone,
      deliveryAddress: address,
      items: orderItems,
      totalPrice: calculateTotalPrice(),
      userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get user's time zone
    };

    try {
      const newOrder = await placeOrder(orderData);
      localStorage.removeItem('cart'); // Clear cart after successful order
      setCart([]);
      navigate(`/order/${newOrder._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                    <button onClick={() => handleRemoveItem(item._id)} className="remove-btn">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <p>Total: ${calculateTotalPrice().toFixed(2)}</p>

            <form onSubmit={handleSubmitOrder}>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Delivery Address:</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-order-btn">Submit Order</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
