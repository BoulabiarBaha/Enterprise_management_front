import api from './api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Product, ProductRequest, ApiResponse } from '@/types';

/**
 * Service pour gérer les produits
 * 
 * Toutes les fonctions appellent l'API backend
 */
export const productService = {
  /**
   * Récupère tous les produits de l'utilisateur connecté
   */
  async getMyProducts(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(
      API_ENDPOINTS.PRODUCTS.MY_PRODUCTS
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch products');
    }

    return response.data.data;
  },

  /**
   * Récupère un produit par son ID
   */
  async getProductById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id)
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Product not found');
    }

    return response.data.data;
  },

  /**
   * Crée un nouveau produit
   */
  async createProduct(data: ProductRequest): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.LIST,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create product');
    }

    return response.data.data;
  },

  /**
   * Met à jour un produit existant
   */
  async updateProduct(id: string, data: Product): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id),
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update product');
    }

    return response.data.data;
  },

  /**
   * Supprime un produit
   */
  async deleteProduct(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<string>>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete product');
    }
  },
};