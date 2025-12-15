import { create } from 'zustand';
import { productService } from '@/services/productService';
import type { Product, ProductRequest } from '@/types';

/**
 * Interface du store de produits
 */
interface ProductState {
  // État
  products: Product[];
  isLoading: boolean;
  error: string | null;
  selectedProduct: Product | null;

  // Actions
  fetchProducts: () => Promise<void>;
  createProduct: (data: ProductRequest) => Promise<Product>;
  updateProduct: (id: string, data: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  setSelectedProduct: (product: Product | null) => void;
  clearError: () => void;
}

/**
 * Store Zustand pour gérer les produits
 * 
 * Gère:
 * - Liste des produits
 * - CRUD operations
 * - Loading states
 * - Erreurs
 */
export const useProductStore = create<ProductState>((set) => ({
  // État initial
  products: [],
  isLoading: false,
  error: null,
  selectedProduct: null,

  /**
   * Récupère tous les produits
   */
  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const products = await productService.getMyProducts();
      set({ products, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des produits',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Crée un nouveau produit
   */
  createProduct: async (data: ProductRequest) => {
    set({ isLoading: true, error: null });

    try {
      const newProduct = await productService.createProduct(data);
      
      // Ajoute le nouveau produit à la liste
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));

      return newProduct;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la création du produit',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Met à jour un produit existant
   */
  updateProduct: async (id: string, data: Product) => {
    set({ isLoading: true, error: null });

    try {
      const updatedProduct = await productService.updateProduct(id, data);

      // Met à jour le produit dans la liste
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? updatedProduct : p
        ),
        isLoading: false,
      }));

      return updatedProduct;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du produit',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Supprime un produit
   */
  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await productService.deleteProduct(id);

      // Retire le produit de la liste
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la suppression du produit',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Sélectionne un produit (pour l'édition)
   */
  setSelectedProduct: (product: Product | null) => {
    set({ selectedProduct: product });
  },

  /**
   * Efface les erreurs
   */
  clearError: () => {
    set({ error: null });
  },
}));