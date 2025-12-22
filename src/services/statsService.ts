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
  monthlyRevenue?: MonthlyRevenueDto[] | null;
}

export interface MonthlyRevenueDto {
  month?: string | null;
  revenue: number;
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
      let revenueDifference: number = 0;
      if (responseStats.monthlyRevenue.length >= 2) 
      {
        const lastIndex = responseStats.monthlyRevenue.length - 1;
        revenueDifference = responseStats.monthlyRevenue[lastIndex].revenue - responseStats.monthlyRevenue[lastIndex - 1].revenue;
      } else {
        revenueDifference = 0;
      }
      return {
        totalProducts: responseStats.totalProducts || 0,
        totalClients: responseStats.totalClients || 0,
        activeClients: responseStats.activeClients || 0,
        totalTransactions: responseStats.totalTransactions || 0,
        totalRevenue: responseStats.totalRevenue || 0,
        averageTransactionValue: responseStats.averageTransactionValue || 0,
        clientConversionRate: responseStats.clientConversionRate || 0,
        repurchaseRate: responseStats.repurchaseRate || 0,
        monthlyRevenue: responseStats.monthlyRevenue || [],
        revenueChange: revenueDifference,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};