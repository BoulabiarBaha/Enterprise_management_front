import api from './api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Billing, ApiResponse } from '@/types';

/**
 * Service pour gérer les factures
 */
export const billingService = {
  /**
   * Récupère une facture par l'ID de transaction
   */
  async getBillingByTransactionId(transactionId: string): Promise<Billing> {
    const response = await api.get<ApiResponse<Billing>>(
      API_ENDPOINTS.BILLINGS.BY_TRANSACTION(transactionId)
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Billing not found');
    }

    return response.data.data;
  },

  /**
   * Supprime une facture
   */
  async deleteBilling(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<string>>(
      API_ENDPOINTS.BILLINGS.DETAIL(id)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete billing');
    }
  },
};