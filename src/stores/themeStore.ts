import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Types de thème
 */
type Theme = 'light' | 'dark';

/**
 * Interface du store de thème
 */
interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Store Zustand pour gérer le thème (dark mode)
 * 
 * Features:
 * - Persiste dans localStorage
 * - Toggle entre light/dark
 * - Applique la classe sur <html>
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',

      /**
       * Toggle entre light et dark
       */
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        
        // Applique la classe sur l'élément HTML
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        set({ theme: newTheme });
      },

      /**
       * Définit un thème spécifique
       */
      setTheme: (theme: Theme) => {
        // Applique la classe sur l'élément HTML
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        set({ theme });
      },
    }),
    {
      name: 'theme-storage', // Nom dans localStorage
      onRehydrateStorage: () => (state) => {
        // Applique le thème sauvegardé au chargement
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);