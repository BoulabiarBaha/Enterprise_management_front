import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ROUTES } from '@/lib/constants';

/**
 * Page d'inscription
 * 
 * Fonctionnement :
 * 1. Formulaire avec username, email, password, confirmPassword
 * 2. Validation côté client (format email, mots de passe identiques, etc.)
 * 3. Appel du store pour signup
 * 4. Redirection vers login avec message de succès
 */
export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  // État local du formulaire
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Récupération des fonctions du store
  const { signup, isLoading, error } = useAuthStore();

  /**
   * Met à jour un champ du formulaire
   */
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Efface l'erreur du champ modifié
    setValidationErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  /**
   * Valide le formulaire
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validation username
    if (!formData.username.trim()) {
      errors.username = "Le nom d'utilisateur est requis";
    } else if (formData.username.length < 3) {
      errors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères";
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }

    // Validation password
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Validation confirmPassword
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!validateForm()) {
      return;
    }

    try {
      // Appel du store pour signup
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Affiche le message de succès
      setShowSuccess(true);

      // Redirection vers login après 2 secondes
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
      <Card className="w-full max-w-md">
        {/* Header */}
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl">Créer un compte</CardTitle>
          <p className="text-gray-600">
            Inscrivez-vous pour commencer
          </p>
        </CardHeader>

        {/* Content */}
        <CardContent>
          {/* Message de succès */}
          {showSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">✓ Compte créé avec succès !</p>
              <p className="text-sm">Redirection vers la page de connexion...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Affichage erreur API */}
            {error && !showSuccess && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Input Username */}
            <Input
              label="Nom d'utilisateur"
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              placeholder="Choisissez un nom d'utilisateur"
              disabled={isLoading || showSuccess}
              error={validationErrors.username}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            {/* Input Email */}
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="votre@email.com"
              disabled={isLoading || showSuccess}
              error={validationErrors.email}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            {/* Input Password */}
            <Input
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Minimum 6 caractères"
              disabled={isLoading || showSuccess}
              error={validationErrors.password}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {/* Input Confirm Password */}
            <Input
              label="Confirmer le mot de passe"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Retapez votre mot de passe"
              disabled={isLoading || showSuccess}
              error={validationErrors.confirmPassword}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={showSuccess}
            >
              {isLoading ? 'Création du compte...' : "S'inscrire"}
            </Button>

            {/* Link to Login */}
            <p className="text-center text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link 
                to={ROUTES.LOGIN} 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Se connecter
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};