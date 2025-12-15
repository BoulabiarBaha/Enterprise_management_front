// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5062/api';

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  THEME: 'theme',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  CLIENTS: '/clients',
  TRANSACTIONS: '/transactions',
  BILLINGS: '/billings',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  USERS: {
    ME: '/users/me',
    LIST: '/users',
  },
  PRODUCTS: {
    MY_PRODUCTS: '/products/my-products',
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
  },
  CLIENTS: {
    MY_CLIENTS: '/clients/my-clients',
    LIST: '/clients',
    DETAIL: (id: string) => `/clients/${id}`,
  },
  TRANSACTIONS: {
    MY_TRANSACTIONS: '/transactions/my-transactions',
    LIST: '/transactions',
    DETAIL: (id: string) => `/transactions/${id}`,
  },
  BILLINGS: {
    LIST: '/billing',
    DETAIL: (id: string) => `/billing/${id}`,
    BY_TRANSACTION: (transactionId: string) => `/billing/transactions/${transactionId}/billing`,
  },
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Toast duration
export const TOAST_DURATION = 3000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;