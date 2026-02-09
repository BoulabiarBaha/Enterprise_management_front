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
  fetchBillingsForTransactions: (transactionIds: string[]) => Promise<void>;
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
   * Récupère les factures pour une liste de transactions
   */
  fetchBillingsForTransactions: async (transactionIds: string[]) => {
    const uncachedIds = transactionIds.filter((id) => !get().billings.has(id));
    if (uncachedIds.length === 0) return;

    set({ isLoading: true, error: null });

    try {
      const results = await Promise.all(
        uncachedIds.map((id) => billingService.getBillingByTransactionId(id).then((billing) => ({ id, billing })))
      );

      set((state) => {
        const newBillings = new Map(state.billings);
        results.forEach(({ id, billing }) => {
          newBillings.set(id, billing);
        });
        return { billings: newBillings, isLoading: false };
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des factures',
        isLoading: false,
      });
    }
  },

  /**
   * Efface les erreurs
   */
  clearError: () => {
    set({ error: null });
  },
}));