import api from './api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Fournisseur, FournisseurRequest, ApiResponse } from '@/types';

export const fournisseurService = {
  async getMyFournisseurs(): Promise<Fournisseur[]> {
    const response = await api.get<ApiResponse<Fournisseur[]>>(
      API_ENDPOINTS.FOURNISSEURS.MY_FOURNISSEURS
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch fournisseurs');
    }

    return response.data.data;
  },

  async getFournisseurById(id: string): Promise<Fournisseur> {
    const response = await api.get<ApiResponse<Fournisseur>>(
      API_ENDPOINTS.FOURNISSEURS.DETAIL(id)
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Fournisseur not found');
    }

    return response.data.data;
  },

  async createFournisseur(data: FournisseurRequest): Promise<Fournisseur> {
    const response = await api.post<ApiResponse<Fournisseur>>(
      API_ENDPOINTS.FOURNISSEURS.LIST,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create fournisseur');
    }

    return response.data.data;
  },

  async updateFournisseur(id: string, data: Fournisseur): Promise<Fournisseur> {
    const response = await api.put<ApiResponse<Fournisseur>>(
      API_ENDPOINTS.FOURNISSEURS.DETAIL(id),
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update fournisseur');
    }

    return response.data.data;
  },

  async deleteFournisseur(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<string>>(
      API_ENDPOINTS.FOURNISSEURS.DETAIL(id)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete fournisseur');
    }
  },
};
