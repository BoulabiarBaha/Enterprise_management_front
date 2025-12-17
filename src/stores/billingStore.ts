import { create } from 'zustand';
import { billingService } from '@/services/billingService';
import type { Billing } from '@/types';

/**
 * Interface du store de factures
 */
interface BillingState {
  // État
  billings: Map<string, Billing>; // Map transactionId -> Billing
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBillingByTransactionId: (transactionId: string) => Promise<Billing>;
  clearError: () => void;
}

/**
 * Store Zustand pour gérer les factures
 */
export const useBillingStore = create<BillingState>((set, get) => ({
  // État initial
  billings: new Map(),
  isLoading: false,
  error: null,

  /**
   * Récupère une facture par transaction ID
   * Utilise un cache pour éviter les appels multiples
   */
  fetchBillingByTransactionId: async (transactionId: string) => {
    // Vérifie le cache d'abord
    const cached = get().billings.get(transactionId);
    if (cached) {
      return cached;
    }

    set({ isLoading: true, error: null });

    try {
      const billing = await billingService.getBillingByTransactionId(transactionId);
      
      // Ajoute au cache
      set((state) => {
        const newBillings = new Map(state.billings);
        newBillings.set(transactionId, billing);
        return {
          billings: newBillings,
          isLoading: false,
        };
      });

      return billing;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement de la facture',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Efface les erreurs
   */
  clearError: () => {
    set({ error: null });
  },
}));