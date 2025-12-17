import api from './api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Transaction, TransactionRequest, ApiResponse } from '@/types';

/**
 * Service pour gérer les transactions
 */
export const transactionService = {
  /**
   * Récupère toutes les transactions de l'utilisateur
   */
  async getMyTransactions(): Promise<Transaction[]> {
    const response = await api.get<ApiResponse<Transaction[]>>(
      API_ENDPOINTS.TRANSACTIONS.MY_TRANSACTIONS
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch transactions');
    }

    return response.data.data;
  },

  /**
   * Récupère une transaction par son ID
   */
  async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get<ApiResponse<Transaction>>(
      API_ENDPOINTS.TRANSACTIONS.DETAIL(id)
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Transaction not found');
    }

    return response.data.data;
  },

  /**
   * Crée une nouvelle transaction
   * Le backend génère automatiquement la facture
   */
  async createTransaction(data: TransactionRequest): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>(
      API_ENDPOINTS.TRANSACTIONS.LIST,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create transaction');
    }

    return response.data.data;
  },

  /**
   * Supprime une transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<string>>(
      API_ENDPOINTS.TRANSACTIONS.DETAIL(id)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete transaction');
    }
  },
};