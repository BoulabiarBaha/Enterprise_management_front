import { create } from 'zustand';
import { fournisseurService } from '@/services/fournisseurService';
import type { Fournisseur, FournisseurRequest } from '@/types';

interface FournisseurState {
  fournisseurs: Fournisseur[];
  isLoading: boolean;
  error: string | null;
  selectedFournisseur: Fournisseur | null;

  fetchFournisseurs: () => Promise<void>;
  createFournisseur: (data: FournisseurRequest) => Promise<Fournisseur>;
  updateFournisseur: (id: string, data: Fournisseur) => Promise<Fournisseur>;
  deleteFournisseur: (id: string) => Promise<void>;
  setSelectedFournisseur: (fournisseur: Fournisseur | null) => void;
  clearError: () => void;
}

export const useFournisseurStore = create<FournisseurState>((set) => ({
  fournisseurs: [],
  isLoading: false,
  error: null,
  selectedFournisseur: null,

  fetchFournisseurs: async () => {
    set({ isLoading: true, error: null });

    try {
      const fournisseurs = await fournisseurService.getMyFournisseurs();
      set({ fournisseurs, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des fournisseurs',
        isLoading: false,
      });
      throw error;
    }
  },

  createFournisseur: async (data: FournisseurRequest) => {
    set({ isLoading: true, error: null });

    try {
      const newFournisseur = await fournisseurService.createFournisseur(data);

      set((state) => ({
        fournisseurs: [...state.fournisseurs, newFournisseur],
        isLoading: false,
      }));

      return newFournisseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la création du fournisseur',
        isLoading: false,
      });
      throw error;
    }
  },

  updateFournisseur: async (id: string, data: Fournisseur) => {
    set({ isLoading: true, error: null });

    try {
      const updatedFournisseur = await fournisseurService.updateFournisseur(id, data);

      set((state) => ({
        fournisseurs: state.fournisseurs.map((f) =>
          f.id === id ? updatedFournisseur : f
        ),
        isLoading: false,
      }));

      return updatedFournisseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du fournisseur',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteFournisseur: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await fournisseurService.deleteFournisseur(id);

      set((state) => ({
        fournisseurs: state.fournisseurs.filter((f) => f.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la suppression du fournisseur',
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedFournisseur: (fournisseur: Fournisseur | null) => {
    set({ selectedFournisseur: fournisseur });
  },

  clearError: () => {
    set({ error: null });
  },
}));
