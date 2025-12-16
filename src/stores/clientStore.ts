import { create } from 'zustand';
import { clientService } from '@/services/clientService';
import type { Client } from '@/types';

/**
 * Type pour la création d'un client (sans les champs auto-générés)
 */
type CreateClientDTO = {
  name: string;
  email: string;
  numIdentiteFiscal: string;
  tel: string;
  address: string;
};

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
  createClient: (data: CreateClientDTO) => Promise<Client>;
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
  createClient: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const newClient = await clientService.createClient(data);
      
      // Ajoute le nouveau client à la liste
      set((state) => ({
        clients: [...state.clients, newClient],
        isLoading: false,
        error: null,
      }));

      return newClient;
    } catch (error: any) {
            console.error('Store createClient error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erreur lors de la création du client';
      set({
        error: errorMessage,
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