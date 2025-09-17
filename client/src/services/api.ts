import axios from 'axios';
import { Shop, Flower, Order, OrderItem } from '../types';

const API_URL = 'https://flowerdelivery.onrender.com/'; // Replace with your backend URL

// Shops
export const getShops = async (): Promise<Shop[]> => {
  const response = await axios.get(`${API_URL}/shops`);
  return response.data;
};

// Flowers
export const getFlowers = async (shopId?: string, sortBy?: string, page: number = 1, limit: number = 8): Promise<{ flowers: Flower[]; totalPages: number; currentPage: number }> => {
  const response = await axios.get(`${API_URL}/flowers`, {
    params: { shopId, sortBy, page, limit },
  });
  return response.data;
};

export const toggleFavorite = async (flowerId: string): Promise<Flower> => {
  const response = await axios.patch(`${API_URL}/flowers/${flowerId}/favorite`);
  return response.data;
};

// Orders
export const placeOrder = async (orderData: Omit<Order, '_id' | 'orderDate' | 'items'> & { items: OrderItem[] }): Promise<Order> => {
  const response = await axios.post(`${API_URL}/orders`, orderData);
  return response.data;
};

export const getOrderDetails = async (orderId: string): Promise<Order> => {
  const response = await axios.get(`${API_URL}/orders/${orderId}`);
  return response.data;
};

export const getOrderHistory = async (email?: string, phone?: string, orderId?: string): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/orders/history`, {
    params: { email, phone, orderId },
  });
  return response.data;
};
