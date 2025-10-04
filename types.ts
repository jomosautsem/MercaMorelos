
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: 'dama' | 'nino';
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  email: string;
  address: string;
}
