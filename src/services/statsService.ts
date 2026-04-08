import api from './api';
import { API_ENDPOINTS } from '@/lib/constants';

/**
 * Interface pour les statistiques du dashboard
 */
export interface UserStatsDto {
  totalClients: number;
  totalProducts: number;
  activeClients: number;
  totalTransactions: number;
  totalRevenue: number;
  revenueChange: number; 
}
export interface DashboardStatsDto extends UserStatsDto {
  averageTransactionValue: number;
  clientConversionRate: number;
  repurchaseRate: number;
  productCoverageRate: number;
  monthlyRevenue?: MonthlyRevenueDto[] | null;
  monthlyClients?: MonthlyClientsDto[] | null;
}

export interface MonthlyRevenueDto {
  month?: string | null;
  revenue: number;
}

export interface MonthlyClientsDto {
  month?: string | null;
  count: number;
}
/**
 * Service pour récupérer les statistiques
 */
export const statsService = {

  async getDashboardStats(): Promise<DashboardStatsDto> {
    try {
      
      const response = await api.get(API_ENDPOINTS.STATS.DASHBOARD);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to retrieve dashboard stats');
      } 
      const responseStats = response.data.data
      return {
        totalProducts: responseStats.totalProducts || 0,
        totalClients: responseStats.totalClients || 0,
        activeClients: responseStats.activeClients || 0,
        totalTransactions: responseStats.totalTransactions || 0,
        totalRevenue: responseStats.totalRevenue || 0,
        averageTransactionValue: responseStats.averageTransactionValue || 0,
        clientConversionRate: responseStats.clientConversionRate || 0,
        repurchaseRate: responseStats.repurchaseRate || 0,
        productCoverageRate: responseStats.productCoverageRate || 0,
        monthlyRevenue: responseStats.monthlyRevenue || [],
        monthlyClients: responseStats.monthlyClients || [],
        revenueChange: responseStats.revenueChangePercent || 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};