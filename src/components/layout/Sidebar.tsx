import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/constants';

/**
 * Interface pour les éléments de navigation
 */
interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number; // Badge optionnel (ex: notifications)
}

/**
 * Props du Sidebar
 */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Composant Sidebar
 * 
 * Features:
 * - Navigation avec icônes
 * - Indicateur de page active
 * - Badges pour les notifications
 * - Responsive (se ferme sur mobile)
 * - Animations fluides
 */
export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  /**
   * Éléments de navigation
   * Vous pouvez ajouter/modifier selon vos besoins
   */
  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: ROUTES.DASHBOARD,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Produits',
      path: ROUTES.PRODUCTS,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      name: 'Clients',
      path: ROUTES.CLIENTS,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Transactions',
      path: ROUTES.TRANSACTIONS,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      name: 'Factures',
      path: ROUTES.BILLINGS,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  /**
   * Vérifie si un lien est actif
   */
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay pour mobile - ferme la sidebar quand on clique dessus */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out',
          // Sur mobile, la sidebar slide depuis la gauche
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Sur desktop (lg), toujours visible
          'lg:translate-x-0'
        )}
      >
        {/* Header de la Sidebar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Billy
            </span>
          </div>

          {/* Bouton fermer (mobile seulement) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group',
                isActive(item.path)
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <div className="flex items-center space-x-3">
                {/* Icône */}
                <span
                  className={cn(
                    'transition-colors',
                    isActive(item.path)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  )}
                >
                  {item.icon}
                </span>

                {/* Nom */}
                <span className="font-medium">{item.name}</span>
              </div>

              {/* Badge optionnel */}
              {item.badge && (
                <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                  {item.badge}
                </span>
              )}

              {/* Indicateur de page active */}
              {isActive(item.path) && (
                <div className="w-1 h-6 bg-primary-600 dark:bg-primary-400 rounded-full absolute right-0" />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer de la Sidebar */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Besoin d'aide ?
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Consultez notre documentation
            </p>
            <button className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline">
              En savoir plus →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};