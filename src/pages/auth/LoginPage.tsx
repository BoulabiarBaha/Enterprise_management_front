import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ROUTES } from '@/lib/constants';

/**
 * Page de Login
 * 
 * Fonctionnement :
 * 1. Formulaire avec username et password
 * 2. Validation basique côté client
 * 3. Appel du store pour login
 * 4. Redirection vers dashboard si succès
 * 5. Affichage des erreurs si échec
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // État local du formulaire
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Récupération des fonctions et état du store
  const { login, isLoading, error } = useAuthStore();

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    
    // Réinitialise les erreurs
    setValidationError('');

    // Validation côté client
    if (!username.trim()) {
      setValidationError("Le nom d'utilisateur est requis");
      return;
    }

    if (!password) {
      setValidationError('Le mot de passe est requis');
      return;
    }

    try {
      // Appel du store pour login
      await login({ username, password });
      
      // Si succès, redirection vers dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // L'erreur est déjà gérée dans le store
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl">Billy</CardTitle>
          <p className="text-gray-600">
            Votre assistant de travail qui gère tous !
          </p>
        </CardHeader>

        {/* Content */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Affichage des erreurs */}
            {(error || validationError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error || validationError}</p>
              </div>
            )}

            {/* Input Username */}
            <Input
              label="Nom d'utilisateur"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              disabled={isLoading}
              icon={
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              }
            />

            {/* Input Password */}
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              disabled={isLoading}
              icon={
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
                </svg>
              }
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>

            {/* Link to Signup */}
            <p className="text-center text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link 
                to={ROUTES.SIGNUP} 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Créer un compte
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};