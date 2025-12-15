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
import { ProductForm } from '@/components/features/products/ProductForm';
import { DeleteProductDialog } from '@/components/features/products/DeleteProductDialog';
import { useProductStore } from '@/stores/productStore';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

/**
 * Page de gestion des produits
 * 
 * Features:
 * - Liste des produits en tableau
 * - Recherche par nom
 * - Ajout de produit
 * - Modification de produit
 * - Suppression de produit
 * - Loading states
 * - Messages d'erreur
 */
export const ProductsPage: React.FC = () => {
  const { products, isLoading, error, fetchProducts } = useProductStore();

  // États locaux
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /**
   * Charge les produits au montage du composant
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Filtre les produits selon la recherche
   */
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Ouvre le formulaire d'ajout
   */
  const handleAdd = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
  };

  /**
   * Ouvre le formulaire de modification
   */
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  /**
   * Ouvre le dialog de suppression
   */
  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  /**
   * Callback après succès (recharge les données)
   */
  const handleSuccess = () => {
    fetchProducts();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Produits
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez votre catalogue de produits
          </p>
        </div>
        <Button onClick={handleAdd}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouveau produit
        </Button>
      </div>

      {/* Barre de recherche et statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="lg:col-span-3">
          <Input
            type="text"
            placeholder="Rechercher par nom ou fournisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>

        {/* Nombre de produits */}
        <Card className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <p className="text-sm text-primary-700 dark:text-primary-400 font-medium">
            Total produits
          </p>
          <p className="text-3xl font-bold text-primary-900 dark:text-primary-300 mt-1">
            {products.length}
          </p>
        </Card>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tableau des produits */}
      <Card>
        {isLoading && products.length === 0 ? (
          // Loading state
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Chargement des produits...
              </p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          // Empty state
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'Aucun produit trouvé' : 'Aucun produit'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm
                  ? 'Essayez de modifier votre recherche'
                  : 'Commencez par ajouter votre premier produit'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd}>
                  Ajouter un produit
                </Button>
              )}
            </div>
          </div>
        ) : (
          // Table avec données
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  {/* Nom */}
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>

                  {/* Prix */}
                  <TableCell>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {formatCurrency(product.unitPrice)}
                    </span>
                  </TableCell>

                  {/* Fournisseur */}
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                      {product.supplier}
                    </span>
                  </TableCell>

                  {/* Description */}
                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                      {product.description || '-'}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Bouton Modifier */}
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Bouton Supprimer */}
                      <button
                        onClick={() => handleDelete(product)}
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

      {/* Formulaire d'ajout/modification */}
      <ProductForm
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />

      {/* Dialog de confirmation de suppression */}
      <DeleteProductDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />
    </div>
  );
};