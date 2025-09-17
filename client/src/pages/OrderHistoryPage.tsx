import React, { useState } from 'react';
import { getOrderHistory } from '../services/api';
import { Order } from '../types';
import { Link } from 'react-router-dom';

const OrderHistoryPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrders([]);

    try {
      let fetchedOrders: Order[] = [];
      if (orderId) {
        fetchedOrders = await getOrderHistory(undefined, undefined, orderId);
      } else if (email && phone) {
        fetchedOrders = await getOrderHistory(email, phone);
      } else {
        setError('Please enter an Order ID or both Email and Phone number.');
        return;
      }
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Error fetching order history:', err);
      setError('No orders found or an error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-history-page">
      <h1>Order History</h1>
      <form onSubmit={handleSearch} className="order-history-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!orderId}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!!orderId}
          />
        </div>
        <p className="or-separator">OR</p>
        <div className="form-group">
          <label htmlFor="orderId">Order ID:</label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            disabled={!!(email || phone)}
          />
        </div>
        <button type="submit" disabled={loading}>Search Orders</button>
      </form>

      {loading && <p>Loading order history...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {orders.length > 0 && (
        <div className="order-list">
          <h2>Your Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              <Link to={`/order/${order._id}`}>View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
