export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  image?: string; // Optional - products can have just colors without images
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  category: string;
  features: string[];
  specs: {
    material: string;
    length: string;
    weight: string;
    tuning: string;
  };
  colors: ProductColor[];
  defaultColorId: string;
}

export interface CartItem {
  productId: string;
  colorId: string;
  quantity: number;
}

export interface OrderForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  comment: string;
  deliveryMethod: 'nova_poshta' | 'ukr_poshta' | 'pickup';
  paymentMethod: 'card' | 'cash_on_delivery';
}

export interface Order extends OrderForm {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}
