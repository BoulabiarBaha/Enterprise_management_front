import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table';
import { FournisseurForm } from '@/components/features/fournisseurs/FournisseurForm';
import { DeleteFournisseurDialog } from '@/components/features/fournisseurs/DeleteFournisseurDialog';
import { useFournisseurStore } from '@/stores/fournisseurStore';
import type { Fournisseur } from '@/types';

export const FournisseursPage: React.FC = () => {
  const { fournisseurs, isLoading, error, fetchFournisseurs } = useFournisseurStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFournisseurForm, setShowFournisseurForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);

  useEffect(() => {
    fetchFournisseurs();
  }, [fetchFournisseurs]);

  const filteredFournisseurs = fournisseurs.filter((fournisseur) =>
    fournisseur.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fournisseur.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedFournisseur(null);
    setShowFournisseurForm(true);
  };

  const handleEdit = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setShowFournisseurForm(true);
  };

  const handleDelete = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setShowDeleteDialog(true);
  };

  const handleSuccess = () => {
    fetchFournisseurs();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fournisseurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos fournisseurs
          </p>
        </div>
        <Button onClick={handleAdd}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouveau fournisseur
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>

        <Card className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <p className="text-sm text-primary-700 dark:text-primary-400 font-medium">
            Total fournisseurs
          </p>
          <p className="text-3xl font-bold text-primary-900 dark:text-primary-300 mt-1">
            {fournisseurs.length}
          </p>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <Card>
        {isLoading && fournisseurs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Chargement des fournisseurs...
              </p>
            </div>
          </div>
        ) : filteredFournisseurs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'Aucun fournisseur trouvé' : 'Aucun fournisseur'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm
                  ? 'Essayez de modifier votre recherche'
                  : 'Commencez par ajouter votre premier fournisseur'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd}>
                  Ajouter un fournisseur
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFournisseurs.map((fournisseur) => (
                <TableRow key={fournisseur.id}>
                  <TableCell className="font-medium">
                    {fournisseur.name}
                  </TableCell>

                  <TableCell>
                    <a
                      href={`mailto:${fournisseur.email}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {fournisseur.email}
                    </a>
                  </TableCell>

                  <TableCell>
                    {fournisseur.tel ? (
                      <a
                        href={`tel:${fournisseur.tel}`}
                        className="text-gray-600 dark:text-gray-400 hover:underline"
                      >
                        {fournisseur.tel}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                      {fournisseur.address || '-'}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(fournisseur)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(fournisseur)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Modals */}
      <FournisseurForm
        isOpen={showFournisseurForm}
        onClose={() => setShowFournisseurForm(false)}
        fournisseur={selectedFournisseur}
        onSuccess={handleSuccess}
      />

      <DeleteFournisseurDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        fournisseur={selectedFournisseur}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
