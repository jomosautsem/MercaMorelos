export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Collection {
  id: string;
  name: string;
  icon: string;
  parentCategory: 'dama' | 'kids' | 'caballero';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: 'dama' | 'kids' | 'caballero';
  collectionId: string; // Link to a Collection
  description: string;
  stock: number;
  isArchived: boolean;
  averageRating?: number;
  reviewCount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id:string;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  email: string;
  address: string;
  role: 'admin' | 'customer';
}

export interface Order {
    id: string;
    date: string;
    estimatedDeliveryDate: string;
    deliveryDate?: string;
    total: number;
    status: 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado';
    items: CartItem[];
    shippingInfo: User;
}

export interface Message {
  id: string;
  from: 'admin' | 'customer';
  fromId: string;
  toId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}