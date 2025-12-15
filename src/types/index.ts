// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  unitPrice: number;
  priceHistory: PriceChange[];
  description: string;
  supplier: string;
  createdBy: string;
}

export interface PriceChange {
  price: number;
  date: string;
}

export interface ProductRequest {
  name: string;
  unitPrice: number;
  description?: string;
  supplier: string;
}

// Client types
export interface Client {
  id: string;
  name: string;
  email: string;
  numIdentiteFiscal: string;
  tel: string;
  address: string;
  transactionIds: string[];
  billingIds: string[];
  value: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateClientDTO {
  name?: string;
  email?: string;
  tel?: string;
  address?: string;
}

// Transaction types
export interface Transaction {
  id: string;
  clientId: string;
  soldProducts: SoldProduct[];
  totalPrice: number;
  date: string;
  billingId: string;
  createdBy: string;
}

export interface SoldProduct {
  productId: string;
  quantity: number;
  note: string;
}

export interface TransactionRequest {
  clientId: string;
  soldProducts: SoldProduct[];
}

// Billing types
export interface Billing {
  id: string;
  reference: string;
  date: string;
  totalHT: number;
  tva: number;
  totalTTC: number;
  enableTax: boolean;
}

// UI State types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Pagination types
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}