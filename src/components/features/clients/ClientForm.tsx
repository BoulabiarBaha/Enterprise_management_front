import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import type { Client } from '@/types';
import { useClientStore } from '@/stores/clientStore';

/**
 * Props du ProductForm
 */
interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null; // Si fourni, c'est une modification
  onSuccess?: () => void;
}

/**
 * Formulaire d'ajout/modification de client
 * 
 * Features:
 * - Validation des champs
 * - Mode création/édition
 * - Gestion des erreurs
 * - Loading states
 */
export const ClientForm: React.FC<ClientFormProps> = ({
  isOpen,
  onClose,
  client,
  onSuccess,
}) => {
  const { createClient, updateClient, isLoading } = useClientStore();

  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    tel: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  /**
   * Initialise le formulaire avec les données du produit (mode édition)
   */
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        address: client.address,
        tel: client.tel,
      });
    } else {
      // Reset en mode création
      setFormData({
        name: '',
        email: '',
        address: '',
        tel: '',
      });
    }
    setErrors({});
    setSubmitError('');
  }, [client, isOpen]);

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

    if (!formData.email) {
      newErrors.email = 'L email est requis';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L adresse est requise';
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
    //   const data: ProductRequest = {
    //     name: formData.name.trim(),
    //     unitPrice: parseFloat(formData.unitPrice),
    //     description: formData.description.trim(),
    //     supplier: formData.supplier.trim(),
    //   };

    //   if (product) {
    //     // Mode édition
    //     await updateProduct(product.id, {
    //       ...product,
    //       ...data,
    //     });
    //   } else {
    //     // Mode création
    //     await createProduct(data);
    //   }

    //   onSuccess?.();
    //   onClose();
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message ||
        `Erreur lors de ${client ? 'la modification' : 'la création'} du client`
      );
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={client ? 'Modifier le client' : 'Nouveau client'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Erreur générale */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        {/* Nom du client */}   
        <Input
          label="Nom du client *"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="Ex: Client XYZ"
          disabled={isLoading}
        />

        {/* Mail */}
        <Input
          label="L'adresse electronique du client"
          type="text"
          step="0.01"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          placeholder="Ex: client@example.com"
          disabled={isLoading}
        />

        {/* Address */}
        <Input
          label="Addresse *"
          type="text"
          value={formData.address}
          onChange={handleChange('address')}
          error={errors.address}
          placeholder="Ex: 20, Rue de la Paix, 75001 Paris"
          disabled={isLoading}
        />

        {/* Tel */}
        <Input
          label="Numéro de téléphone *"
          type="text"
          value={formData.tel}
          onChange={handleChange('tel')}
          error={errors.tel}
          placeholder="Ex: +21612345678"
          disabled={isLoading}
        />

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
            {client ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};