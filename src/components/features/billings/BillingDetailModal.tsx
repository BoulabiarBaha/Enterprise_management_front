import React, { useEffect, useState } from 'react';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useBillingStore } from '@/stores/billingStore';
import { useClientStore } from '@/stores/clientStore';
import { useProductStore } from '@/stores/productStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { downloadBillingPDF } from './BillingPDF';
import type { Transaction, Billing } from '@/types';

interface BillingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const BillingDetailModal: React.FC<BillingDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { fetchBillingByTransactionId, isLoading: billingLoading } = useBillingStore();
  const { clients } = useClientStore();
  const { products } = useProductStore();
  
  const [billing, setBilling] = useState<Billing | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && transaction) {
      setError('');
      fetchBillingByTransactionId(transaction.id)
        .then(setBilling)
        .catch((err) => {
          setError(err.message || 'Erreur lors du chargement de la facture');
        });
    }
  }, [isOpen, transaction, fetchBillingByTransactionId]);

  if (!transaction) return null;

  const client = clients.find((c) => c.id === transaction.clientId);
  
  const handleDownloadPDF = () => {
    if (billing && client) {
      downloadBillingPDF(billing, transaction, client, products);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Détails de la facture"
      size="lg"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {billingLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Chargement de la facture...
            </p>
          </div>
        </div>
      ) : billing ? (
        <div className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Référence</p>
              <p className="font-semibold text-lg">{billing.reference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
              <p className="font-semibold">{formatDate(billing.date, 'dd/MM/yyyy')}</p>
            </div>
          </div>

          {/* Client */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Client
            </h3>
            <p className="font-semibold text-gray-900 dark:text-white">
              {client?.name || 'Client inconnu'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{client?.email}</p>
            {client?.tel && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{client.tel}</p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              N° Fiscal: {client?.numIdentiteFiscal}
            </p>
          </div>

          {/* Produits */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              Produits
            </h3>
            <div className="space-y-2">
              {transaction.soldProducts.map((soldProduct, index) => {
                const product = products.find((p) => p.id === soldProduct.productId);
                const total = (product?.unitPrice || 0) * soldProduct.quantity;
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product?.name || 'Produit inconnu'}
                      </p>
                      {soldProduct.note && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          {soldProduct.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {soldProduct.quantity} × {formatCurrency(product?.unitPrice || 0)}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(total)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totaux */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Sous-total HT:</span>
              <span className="font-medium">{formatCurrency(billing.totalHT)}</span>
            </div>
            
            {billing.enableTax && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  TVA ({(billing.tva * 100).toFixed(0)}%):
                </span>
                <span className="font-medium">
                  {formatCurrency(billing.totalTTC - billing.totalHT)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total TTC:</span>
              <span className="text-green-600 dark:text-green-400">
                {formatCurrency(billing.totalTTC)}
              </span>
            </div>
          </div>

          {/* Statut taxe */}
          <div>
            {billing.enableTax ? (
              <Badge variant="info">TVA appliquée</Badge>
            ) : (
              <Badge variant="default">Sans TVA</Badge>
            )}
          </div>
        </div>
      ) : null}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Fermer
        </Button>
        {billing && client && (
          <Button
            type="button"
            onClick={handleDownloadPDF}
            disabled={billingLoading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Télécharger PDF
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
};