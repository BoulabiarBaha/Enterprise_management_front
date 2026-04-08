import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { useProductStore } from '@/stores/productStore';
import { useFournisseurStore } from '@/stores/fournisseurStore';
import type { Product, ProductRequest } from '@/types';

/**
 * Props du ProductForm
 */
interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // Si fourni, c'est une modification
  onSuccess?: () => void;
}

/**
 * Formulaire d'ajout/modification de produit
 * 
 * Features:
 * - Validation des champs
 * - Mode création/édition
 * - Gestion des erreurs
 * - Loading states
 */
export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const { createProduct, updateProduct, isLoading } = useProductStore();
  const { fournisseurs, fetchFournisseurs } = useFournisseurStore();

  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    unitPrice: '',
    description: '',
    supplier: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  /**
   * Charge les fournisseurs au montage
   */
  useEffect(() => {
    fetchFournisseurs();
  }, [fetchFournisseurs]);

  /**
   * Initialise le formulaire avec les données du produit (mode édition)
   */
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        unitPrice: product.unitPrice.toString(),
        description: product.description || '',
        supplier: product.supplier,
      });
    } else {
      // Reset en mode création
      setFormData({
        name: '',
        unitPrice: '',
        description: '',
        supplier: '',
      });
    }
    setErrors({});
    setSubmitError('');
  }, [product, isOpen]);

  /**
   * Met à jour un champ du formulaire
   */
  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Efface l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  /**
   * Valide le formulaire
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.unitPrice) {
      newErrors.unitPrice = 'Le prix est requis';
    } else {
      const price = parseFloat(formData.unitPrice);
      if (isNaN(price) || price <= 0) {
        newErrors.unitPrice = 'Le prix doit être supérieur à 0';
      }
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Le fournisseur est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Soumet le formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    try {
      const data: ProductRequest = {
        name: formData.name.trim(),
        unitPrice: parseFloat(formData.unitPrice),
        description: formData.description.trim(),
        supplier: formData.supplier.trim(),
      };

      if (product) {
        // Mode édition
        await updateProduct(product.id, {
          ...product,
          ...data,
        });
      } else {
        // Mode création
        await createProduct(data);
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message ||
        `Erreur lors de ${product ? 'la modification' : 'la création'} du produit`
      );
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Modifier le produit' : 'Nouveau produit'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Erreur générale */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        {/* Nom du produit */}
        <Input
          label="Nom du produit *"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="Ex: Laptop Dell XPS 15"
          disabled={isLoading}
        />

        {/* Prix unitaire */}
        <Input
          label="Prix unitaire (TND) *"
          type="number"
          step="0.01"
          value={formData.unitPrice}
          onChange={handleChange('unitPrice')}
          error={errors.unitPrice}
          placeholder="Ex: 2500.00"
          disabled={isLoading}
        />

        {/* Fournisseur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fournisseur *
          </label>
          <select
            value={formData.supplier}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, supplier: e.target.value }));
              if (errors.supplier) {
                setErrors((prev) => ({ ...prev, supplier: '' }));
              }
            }}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Sélectionner un fournisseur</option>
            {fournisseurs.map((f) => (
              <option key={f.id} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
          {errors.supplier && (
            <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Description du produit (optionnel)"
            disabled={isLoading}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Footer avec boutons */}
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
            isLoading={isLoading}
          >
            {product ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};