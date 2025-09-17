import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderDetails } from '../services/api';
import { Order } from '../types';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        try {
          const fetchedOrder = await getOrderDetails(id);
          setOrder(fetchedOrder);
        } catch (err) {
          console.error('Error fetching order details:', err);
          setError('Failed to load order details.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  const formatOrderDate = (dateString: string, timeZone: string | undefined) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };
    if (timeZone) {
        options.timeZone = timeZone;
    }
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="order-details-page">
      <h1>Order Details</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <h2>Products:</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.flower}>
            {item.name} x {item.quantity} - ${item.price.toFixed(2)} each
          </li>
        ))}
      </ul>
      <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
      <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
      <p><strong>Date and Time:</strong> {formatOrderDate(order.orderDate, order.userTimeZone)}</p>
    </div>
  );
};

export default OrderDetailsPage;
