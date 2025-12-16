import api from './api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { ApiResponse, Client } from '@/types';


/**
 * Type pour la création d'un client
 */
type CreateClientDTO = {
  name: string;
  email: string;
  numIdentiteFiscal: string;
  tel: string;
  address: string;
};

/**
 * Service pour gérer les clients
 */
export const clientService = {
  /**
   * Récupère tous les clients de l'utilisateur connecté
   */
  async getMyClients(): Promise<Client[]> {
    const response = await api.get<ApiResponse<Client[]>>(
      API_ENDPOINTS.CLIENTS.MY_CLIENTS
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch clients');
    }

    return response.data.data;
  },

  /**
   * Récupère un produit par son ID
   */
  async getClientById(id: string): Promise<Client> {
    const response = await api.get<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTS.DETAIL(id)
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Client not found');
    }

    return response.data.data;
  },

  /**
   * Crée un nouveau client
   */
  async createClient(data: CreateClientDTO): Promise<Client> {
    try{
    const response = await api.post<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTS.LIST,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create a client');
    }

    return response.data.data;
    } catch (error: any) {
      console.error('Create client error:', error);
      throw error;
    }

  },

  /**
   * Met à jour un client existant
   */
  async updateClient(id: string, data: Client): Promise<Client> {
    const response = await api.put<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTS.DETAIL(id),
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update a client');
    }

    return response.data.data;
  },

  /**
   * Supprime un client
   */
  async deleteClient(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<string>>(
      API_ENDPOINTS.CLIENTS.DETAIL(id)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete a client');
    }
  },
};