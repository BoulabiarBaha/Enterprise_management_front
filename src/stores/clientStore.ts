import { create } from 'zustand';
import { clientService } from '@/services/clientService';
import type { Client } from '@/types';

/**
 * Interface du store de produits
 */
interface ClientState {
  // État
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  selectedClient: Client | null;

  // Actions
  fetchClients: () => Promise<void>;
  createClient: (data: Client) => Promise<Client>;
  updateClient: (id: string, data: Client) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  setSelectedClient: (client: Client | null) => void;
  clearError: () => void;
}

/**
 * Store Zustand pour gérer les clients
 * 
 * Gère:
 * - Liste des clients
 * - CRUD operations
 * - Loading states
 * - Erreurs
 */
export const useClientStore = create<ClientState>((set) => ({
  // État initial
  clients: [],
  isLoading: false,
  error: null,
  selectedClient: null,

  /**
   * Récupère tous les clients
   */
  fetchClients: async () => {
    set({ isLoading: true, error: null });

    try {
      const clients = await clientService.getMyClients();
      set({ clients, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des clients',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Crée un nouveau produit
   */
  createClient: async (data: Client) => {
    set({ isLoading: true, error: null });

    try {
      const newclient = await clientService.createClient(data);
      
      // Ajoute le nouveau produit à la liste
      set((state) => ({
        clients: [...state.clients, newclient],
        isLoading: false,
      }));

      return newclient;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la création du client',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Met à jour un produit existant
   */
  updateClient: async (id: string, data: Client) => {
    set({ isLoading: true, error: null });

    try {
      const updatedClient = await clientService.updateClient(id, data);

      // Met à jour le produit dans la liste
      set((state) => ({
        clients: state.clients.map((p) =>
          p.id === id ? updatedClient : p
        ),
        isLoading: false,
      }));

      return updatedClient;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du client',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Supprime un client
   */
  deleteClient: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await clientService.deleteClient(id);

      // Retire le client de la liste
      set((state) => ({
        clients: state.clients.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la suppression du client',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Sélectionne un produit (pour l'édition)
   */
  setSelectedClient: (client: Client | null) => {
    set({ selectedClient: client });
  },

  /**
   * Efface les erreurs
   */
  clearError: () => {
    set({ error: null });
  },
}));