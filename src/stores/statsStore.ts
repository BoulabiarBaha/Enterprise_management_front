import { create } from 'zustand';
import { statsService, DashboardStatsDto } from '@/services/statsService';

/**
 * Interface du store de statistiques
 */
interface StatsState {
  stats: DashboardStatsDto | null;
  isLoading: boolean;
  error: string | null;
  
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

/**
 * Store Zustand pour gérer les statistiques
 */
export const useStatsStore = create<StatsState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  /**
   * Récupère les statistiques du dashboard
   */
  fetchStats: async () => {
    set({ isLoading: true, error: null });

    try {
      const stats = await statsService.getDashboardStats();
      set({ stats, isLoading: false });
      
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des statistiques',
        isLoading: false,
      });
      throw error;
    }
  },


  clearError: () => {
    set({ error: null });
  },
}));