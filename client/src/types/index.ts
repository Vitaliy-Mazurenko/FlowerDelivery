export interface Shop {
  _id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Flower {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  shop: string; // Shop ID
  dateAdded: string;
  isFavorite: boolean;
}

export interface CartItem extends Flower {
  quantity: number;
}

export interface OrderItem {
  flower: string; 
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalPrice: number;
  orderDate: string;
  userTimeZone?: string;
}
