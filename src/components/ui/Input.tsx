import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Props du composant Input
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * Composant Input réutilisable
 * 
 * Caractéristiques :
 * - Label optionnel
 * - Message d'erreur
 * - Icône optionnelle
 * - Style cohérent avec le design system
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    // Génère un ID unique si non fourni (pour le label)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        {/* Container pour l'input et l'icône */}
        <div className="relative">
          {/* Icône à gauche */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          {/* Input */}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              // Classes de base
              'w-full px-4 py-2 border rounded-lg transition-all',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              // Si icône, ajoute du padding à gauche
              icon && 'pl-10',
              // Si erreur, bordure rouge
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
              className
            )}
            {...props}
          />
        </div>
        
        {/* Message d'erreur */}
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';