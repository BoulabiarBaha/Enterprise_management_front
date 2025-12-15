import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/constants';

/**
 * Props du ProtectedRoute
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin'; // Role requis pour accéder à la route
}

/**
 * Composant ProtectedRoute
 * 
 * Fonctionnement :
 * 1. Vérifie si l'utilisateur est connecté
 * 2. Si non connecté → Redirige vers /login
 * 3. Si connecté mais pas le bon rôle → Affiche message d'erreur
 * 4. Si OK → Affiche le contenu (children)
 * 
 * Utilisation :
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * Ou avec rôle requis :
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPanel />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading, initAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Au montage du composant, on initialise l'auth
   * Cela vérifie si un token existe et récupère l'user
   */
  useEffect(() => {
      const initialize = async () => {
      if (!isInitialized) {
        await initAuth();
        setIsInitialized(true);
        }
      };
      initialize();
  }, [initAuth, isInitialized]);

  // Pendant l'initialisation, afficher un loader
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est authentifié, dans le cas contraire rediriger vers login
  // On sauvegarde la route actuelle pour y retourner après connexion
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Si un rôle est requis, vérifier que l'user a ce rôle
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg 
              className="w-16 h-16 text-red-500 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Accès refusé
            </h2>
            <p className="text-gray-600">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Rôle requis : <span className="font-medium">{requiredRole}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tout est OK, afficher le contenu protégé
  return <>{children}</>;
};