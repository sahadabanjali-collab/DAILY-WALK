export type Gender = 'Men' | 'Women' | 'Kids' | 'Unisex';

export type CategorySlug = 
  | 'sneakers' 
  | 'running' 
  | 'sports' 
  | 'casual' 
  | 'formal' 
  | 'boots' 
  | 'sandals' 
  | 'kids';

export type Brand = 
  | 'Nike' 
  | 'Adidas' 
  | 'Puma' 
  | 'Reebok' 
  | 'Skechers' 
  | 'New Balance' 
  | 'Daily Walk';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: Brand;
  category: CategorySlug;
  categoryName: string;
  gender: Gender;
  description: string;
  details: {
    material: string;
    sole: string;
    closure: string;
    type: string;
    gender: string;
  };
  price: number;
  originalPrice: number;
  discount: number; // Percentage
  images: string[];
  sizes: number[]; // e.g. [5, 6, 7, 8, 9, 10, 11]
  colors: {
    name: string;
    hex: string;
  }[];
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  tags: string[];
}

export interface CategoryInfo {
  slug: CategorySlug | 'men' | 'women' | 'sale';
  name: string;
  description: string;
  image: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: number;
  selectedColor: string;
  quantity: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  productName?: string;
  verifiedPurchase: boolean;
}

export interface FilterState {
  categories: CategorySlug[];
  genders: Gender[];
  brands: Brand[];
  sizes: number[];
  colors: string[];
  priceRange: [number, number]; // [min, max]
  minRating: number;
  searchQuery: string;
}

export type SortOption = 
  | 'featured' 
  | 'newest' 
  | 'price-low-high' 
  | 'price-high-low' 
  | 'rating-high' 
  | 'popular' 
  | 'discount-high';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'upi' | 'card' | 'cod';
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  estimatedDelivery: string;
}
