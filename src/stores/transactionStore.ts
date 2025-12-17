import { create } from 'zustand';
import { transactionService } from '@/services/transactionService';
import type { Transaction, TransactionRequest } from '@/types';

/**
 * Interface du store de transactions
 */
interface TransactionState {
  // État
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  selectedTransaction: Transaction | null;

  // Actions
  fetchTransactions: () => Promise<void>;
  createTransaction: (data: TransactionRequest) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  clearError: () => void;
}

/**
 * Store Zustand pour gérer les transactions
 */
export const useTransactionStore = create<TransactionState>((set) => ({
  // État initial
  transactions: [],
  isLoading: false,
  error: null,
  selectedTransaction: null,

  /**
   * Récupère toutes les transactions
   */
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });

    try {
      const transactions = await transactionService.getMyTransactions();
      set({ transactions, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des transactions',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Crée une nouvelle transaction
   */
  createTransaction: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const newTransaction = await transactionService.createTransaction(data);
      
      // Ajoute la nouvelle transaction à la liste
      set((state) => ({
        transactions: [newTransaction, ...state.transactions], // Plus récente en premier
        isLoading: false,
        error: null,
      }));

      return newTransaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erreur lors de la création de la transaction';
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Supprime une transaction
   */
  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await transactionService.deleteTransaction(id);

      // Retire la transaction de la liste
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la suppression de la transaction',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Sélectionne une transaction
   */
  setSelectedTransaction: (transaction) => {
    set({ selectedTransaction: transaction });
  },

  /**
   * Efface les erreurs
   */
  clearError: () => {
    set({ error: null });
  },
}));