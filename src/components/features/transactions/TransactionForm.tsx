import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { Select, SelectOption } from '@/components/ui/Select';
import { useTransactionStore } from '@/stores/transactionStore';
import { useClientStore } from '@/stores/clientStore';
import { useProductStore } from '@/stores/productStore';
import { formatCurrency } from '@/lib/utils';
import type { SoldProduct } from '@/types';

/**
 * Props du TransactionForm
 */
interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Interface pour un produit sélectionné (avec quantité et note)
 */
interface SelectedProduct extends SoldProduct {
  name: string; // Pour l'affichage
  unitPrice: number; // Pour le calcul
}

/**
 * Formulaire de création de transaction
 * 
 * Flow:
 * 1. Sélectionner un client
 * 2. Ajouter des produits avec quantités
 * 3. Voir le total calculé automatiquement
 * 4. Créer (génère automatiquement la facture)
 */
export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createTransaction, isLoading: transactionLoading } = useTransactionStore();
  const { clients, fetchClients, isLoading: clientsLoading } = useClientStore();
  const { products, fetchProducts, isLoading: productsLoading } = useProductStore();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [currentProductId, setCurrentProductId] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('1');
  const [currentNote, setCurrentNote] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  /**
   * Charge clients et produits au montage
   */
  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchProducts();
    }
  }, [isOpen, fetchClients, fetchProducts]);

  /**
   * Reset le formulaire
   */
  useEffect(() => {
    if (isOpen) {
      setSelectedClientId('');
      setSelectedProducts([]);
      setCurrentProductId('');
      setCurrentQuantity('1');
      setCurrentNote('');
      setErrors({});
      setSubmitError('');
    }
  }, [isOpen]);

  /**
   * Options pour le select client
   */
  const clientOptions: SelectOption[] = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }));

  /**
   * Options pour le select produit (exclut les produits déjà ajoutés)
   */
  const availableProducts = products.filter(
    (p) => !selectedProducts.some((sp) => sp.productId === p.id)
  );
  
  const productOptions: SelectOption[] = availableProducts.map((product) => ({
    value: product.id,
    label: `${product.name} - ${formatCurrency(product.unitPrice)}`,
  }));

  /**
   * Ajoute un produit à la liste
   */
  const handleAddProduct = () => {
    setErrors({});
    
    if (!currentProductId) {
      setErrors({ product: 'Sélectionnez un produit' });
      return;
    }

    const quantity = parseInt(currentQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      setErrors({ quantity: 'Quantité invalide' });
      return;
    }

    const product = products.find((p) => p.id === currentProductId);
    if (!product) return;

    const newProduct: SelectedProduct = {
      productId: product.id,
      quantity,
      note: currentNote.trim(),
      name: product.name,
      unitPrice: product.unitPrice,
    };

    setSelectedProducts([...selectedProducts, newProduct]);
    setCurrentProductId('');
    setCurrentQuantity('1');
    setCurrentNote('');
  };

  /**
   * Retire un produit de la liste
   */
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId));
  };

  /**
   * Met à jour la quantité d'un produit
   */
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  /**
   * Calcule le total
   */
  const calculateTotal = () => {
    return selectedProducts.reduce(
      (sum, product) => sum + product.unitPrice * product.quantity,
      0
    );
  };

  /**
   * Valide et soumet
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setErrors({});

    // Validation
    if (!selectedClientId) {
      setErrors({ client: 'Sélectionnez un client' });
      return;
    }

    if (selectedProducts.length === 0) {
      setErrors({ products: 'Ajoutez au moins un produit' });
      return;
    }

    try {
      await createTransaction({
        clientId: selectedClientId,
        soldProducts: selectedProducts.map(({ productId, quantity, note }) => ({
          productId,
          quantity,
          note,
        })),
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        'Erreur lors de la création de la transaction'
      );
    }
  };

  const isLoading = transactionLoading || clientsLoading || productsLoading;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle transaction"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        {/* Sélection du client */}
        <div>
          <Select
            label="Client *"
            value={selectedClientId}
            onChange={setSelectedClientId}
            options={clientOptions}
            placeholder="Sélectionnez un client"
            error={errors.client}
            disabled={isLoading}
            searchable
          />
        </div>

        {/* Section produits */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Produits
          </h3>

          {/* Ajout de produit */}
          <div className="grid grid-cols-12 gap-3 mb-4">
            <div className="col-span-5">
              <Select
                value={currentProductId}
                onChange={setCurrentProductId}
                options={productOptions}
                placeholder="Sélectionnez un produit"
                error={errors.product}
                disabled={isLoading || availableProducts.length === 0}
                searchable
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                min="1"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                placeholder="Qté"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>
            <div className="col-span-3">
              <input
                type="text"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Note (optionnel)"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <Button
                type="button"
                onClick={handleAddProduct}
                disabled={isLoading}
                className="w-full"
              >
                Ajouter
              </Button>
            </div>
          </div>

          {errors.products && (
            <p className="text-sm text-red-600 mb-2">{errors.products}</p>
          )}

          {/* Liste des produits ajoutés */}
          {selectedProducts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Aucun produit ajouté
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedProducts.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    {product.note && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Note: {product.note}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Prix unitaire */}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(product.unitPrice)}
                    </span>

                    {/* Quantité */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(product.productId, product.quantity - 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-medium">
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(product.productId, product.quantity + 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Sous-total */}
                    <span className="font-semibold text-green-600 dark:text-green-400 min-w-[100px] text-right">
                      {formatCurrency(product.unitPrice * product.quantity)}
                    </span>

                    {/* Bouton supprimer */}
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.productId)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        {selectedProducts.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span className="text-gray-900 dark:text-white">Total :</span>
              <span className="text-green-600 dark:text-green-400">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
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
            type="submit"
            isLoading={transactionLoading}
            disabled={isLoading}
          >
            Créer la transaction
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};