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
    numIdentiteFiscal: '',
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
        address: client.address || '',
        numIdentiteFiscal: client.numIdentiteFiscal || '',
        tel: client.tel || ''
      });
    } else {
      // Reset en mode création
      setFormData({
        name: '',
        email: '',
        address: '',
        numIdentiteFiscal: '',
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

      // Nom requis
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    // Email requis et valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email invalide';
    }

    // Numéro fiscal requis
    if (!formData.numIdentiteFiscal.trim()) {
      newErrors.numIdentiteFiscal = 'Le numéro fiscal est requis';
    }

    // Téléphone (optionnel mais format si fourni)
    if (formData.tel && !/^\+?[\d\s-()]+$/.test(formData.tel)) {
      newErrors.tel = 'Format téléphone invalide';
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
      const data = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        numIdentiteFiscal: formData.numIdentiteFiscal.trim(),
        tel: formData.tel.trim(),
        address: formData.address.trim(),
      };

      if (client) {
        const result = await updateClient(client.id, {
          ...client,
          ...data,
        });
        console.log('Client updated:', result);
      } else {
        const result = await createClient(data);
        console.log('Client created:', result);
      }
      // Si on arrive ici, c'est que ça a réussi
      onSuccess?.();
      onClose();
 
    } catch (error: any) {
     console.error('Form submit error:', error);
      
      const errorMsg = error.response?.data?.message ||
                      error.message ||
                      `Erreur lors de ${client ? 'la modification' : 'la création'} du client`;
      
      setSubmitError(errorMsg);
      
      // Ne pas fermer le modal en cas d'erreur
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

       {/* Grille 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nom */}
          <Input
            label="Nom *"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            placeholder="Ex: ABC Corporation"
            disabled={isLoading}
          />

          {/* Email */}
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            placeholder="contact@abc.com"
            disabled={isLoading}
          />

          {/* Numéro fiscal */}
          <Input
            label="Numéro d'identité fiscale *"
            type="text"
            value={formData.numIdentiteFiscal}
            onChange={handleChange('numIdentiteFiscal')}
            error={errors.numIdentiteFiscal}
            placeholder="Ex: 1234567A"
            disabled={isLoading}
          />

          {/* Téléphone */}
          <Input
            label="Téléphone"
            type="tel"
            value={formData.tel}
            onChange={handleChange('tel')}
            error={errors.tel}
            placeholder="+216 12 345 678"
            disabled={isLoading}
          />
        </div>

        {/* Adresse (pleine largeur) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse
          </label>
          <textarea
            value={formData.address}
            onChange={handleChange('address')}
            placeholder="Adresse complète du client"
            disabled={isLoading}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
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
            {client ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};