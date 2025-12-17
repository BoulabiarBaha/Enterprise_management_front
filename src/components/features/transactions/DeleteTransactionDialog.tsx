import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useTransactionStore } from '@/stores/transactionStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Transaction } from '@/types';

interface DeleteTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSuccess?: () => void;
}

export const DeleteTransactionDialog: React.FC<DeleteTransactionDialogProps> = ({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}) => {
  const { deleteTransaction, isLoading } = useTransactionStore();
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!transaction) return;

    setError('');

    try {
      await deleteTransaction(transaction.id);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Erreur lors de la suppression de la transaction'
      );
    }
  };

  if (!transaction) return null;

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
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Êtes-vous sûr de vouloir supprimer cette transaction ?
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Date :</span> {formatDate(transaction.date)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Montant :</span>{' '}
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    {formatCurrency(transaction.totalPrice)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Produits :</span> {transaction.soldProducts.length}
                </p>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Cette action est irréversible.
              </p>
            </div>
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