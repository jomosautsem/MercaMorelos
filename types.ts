export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: 'dama' | 'nino';
  description: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
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