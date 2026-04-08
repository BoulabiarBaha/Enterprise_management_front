import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogFooter } from '@/components/ui/Dialog';
import { useFournisseurStore } from '@/stores/fournisseurStore';
import type { Fournisseur, FournisseurRequest } from '@/types';

interface FournisseurFormProps {
  isOpen: boolean;
  onClose: () => void;
  fournisseur?: Fournisseur | null;
  onSuccess?: () => void;
}

export const FournisseurForm: React.FC<FournisseurFormProps> = ({
  isOpen,
  onClose,
  fournisseur,
  onSuccess,
}) => {
  const { createFournisseur, updateFournisseur, isLoading } = useFournisseurStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (fournisseur) {
      setFormData({
        name: fournisseur.name,
        email: fournisseur.email,
        tel: fournisseur.tel || '',
        address: fournisseur.address || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        tel: '',
        address: '',
      });
    }
    setErrors({});
    setSubmitError('');
  }, [fournisseur, isOpen]);

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    try {
      const data: FournisseurRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        tel: formData.tel.trim(),
        address: formData.address.trim(),
      };

      if (fournisseur) {
        await updateFournisseur(fournisseur.id, {
          ...fournisseur,
          ...data,
        });
      } else {
        await createFournisseur(data);
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message ||
        `Erreur lors de ${fournisseur ? 'la modification' : 'la création'} du fournisseur`
      );
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={fournisseur ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        <Input
          label="Nom du fournisseur *"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="Ex: Dell Technologies"
          disabled={isLoading}
        />

        <Input
          label="Email *"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          placeholder="contact@fournisseur.com"
          disabled={isLoading}
        />

        <Input
          label="Téléphone"
          type="tel"
          value={formData.tel}
          onChange={handleChange('tel')}
          placeholder="Ex: +216 71 123 456"
          disabled={isLoading}
        />

        <Input
          label="Adresse"
          type="text"
          value={formData.address}
          onChange={handleChange('address')}
          placeholder="Adresse du fournisseur"
          disabled={isLoading}
        />

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
            {fournisseur ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
