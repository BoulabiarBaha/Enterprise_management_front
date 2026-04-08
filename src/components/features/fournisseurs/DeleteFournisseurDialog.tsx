import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useFournisseurStore } from '@/stores/fournisseurStore';
import type { Fournisseur } from '@/types';

interface DeleteFournisseurDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fournisseur: Fournisseur | null;
  onSuccess?: () => void;
}

export const DeleteFournisseurDialog: React.FC<DeleteFournisseurDialogProps> = ({
  isOpen,
  onClose,
  fournisseur,
  onSuccess,
}) => {
  const { deleteFournisseur, isLoading } = useFournisseurStore();
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!fournisseur) return;

    setError('');

    try {
      await deleteFournisseur(fournisseur.id);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Erreur lors de la suppression du fournisseur'
      );
    }
  };

  if (!fournisseur) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmer la suppression"
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-red-600"
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
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Attention
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer le fournisseur{' '}
              <span className="font-semibold">"{fournisseur.name}"</span> ?
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Cette action est irréversible.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            isLoading={isLoading}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
};
