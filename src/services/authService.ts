import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/lib/constants';
import type { LoginRequest, SignupRequest, User, ApiResponse } from '@/types';

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<{ token: string; user: User }> {
    const response = await api.post<ApiResponse<string>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Login failed');
    }

    const token = response.data.data;

    // Store token
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

    // Get user info
    const user = await this.getCurrentUser();

    return { token, user };
  },

  /**
   * Signup new user
   */
  async signup(data: SignupRequest): Promise<User> {
    const response = await api.post<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.SIGNUP,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Signup failed');
    }

    return response.data.data;
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.USERS.ME);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to get user info');
    }

    const user = response.data.data;

    // Store user info
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return user;
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },
};