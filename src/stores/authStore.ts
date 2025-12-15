import { create } from 'zustand';
import { authService } from '@/services/authService';
import type { User, LoginRequest, SignupRequest } from '@/types';

/**
 * Interface définissant la structure du store d'authentification
 */
interface AuthState {
  // État
  user: User | null;              // Utilisateur connecté (null si déconnecté)
  isAuthenticated: boolean;       // Est-ce que l'utilisateur est connecté ?
  isLoading: boolean;             // Chargement en cours ?
  error: string | null;           // Message d'erreur s'il y en a

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  initAuth: () => Promise<void>;
  clearError: () => void;
}

/**
 * Store Zustand pour gérer l'authentification
 */
export const useAuthStore = create<AuthState>((set) => ({
  // État initial
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * LOGIN - Connecte l'utilisateur
   * 
   * Fonctionnement :
   * 1. Active le loading
   * 2. Appelle l'API via authService.login()
   * 3. Si succès : stocke user et token
   * 4. Si erreur : affiche le message d'erreur
   */
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      // Appel API qui retourne { token, user }
      const { user } = await authService.login(credentials);
      
      // Mise à jour du store avec le user connecté
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Échec de la connexion',
        isLoading: false,
      });
      throw error; // On relance l'erreur pour que le composant puisse la gérer
    }
  },


  signup: async (data: SignupRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      await authService.signup(data);
      
      set({
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Échec de l'inscription",
        isLoading: false,
      });
      throw error;
    }
  },


  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * INIT AUTH - Initialise l'authentification au démarrage de l'app
   * 
   * Fonctionnement :
   * 1. Vérifie s'il y a un token dans le localStorage
   * 2. Si oui, récupère les infos de l'utilisateur depuis l'API
   * 3. Cela permet de rester connecté après un refresh de la page
   */
  initAuth: async () => {
    // Vérifie si un token existe
    if (!authService.isAuthenticated()) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      // Récupère les infos utilisateur depuis l'API
      const user = await authService.getCurrentUser();
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Si le token est invalide, on déconnecte
      authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * CLEAR ERROR - Efface le message d'erreur
   */
  clearError: () => set({ error: null }),
}));