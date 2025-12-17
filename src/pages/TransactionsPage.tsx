import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table';
import { TransactionForm } from '@/components/features/transactions/TransactionForm';
import { DeleteTransactionDialog } from '@/components/features/transactions/DeleteTransactionDialog';
import { useTransactionStore } from '@/stores/transactionStore';
import { useClientStore } from '@/stores/clientStore';
import { useProductStore } from '@/stores/productStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Transaction } from '@/types';

export const TransactionsPage: React.FC = () => {
  const { transactions, isLoading, error, fetchTransactions } = useTransactionStore();
  const { clients, fetchClients } = useClientStore();
  const { products, fetchProducts } = useProductStore();

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [expandedTransactionId, setExpandedTransactionId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
    fetchClients();
    fetchProducts();
  }, [fetchTransactions, fetchClients, fetchProducts]);

  const handleAdd = () => {
    setShowTransactionForm(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteDialog(true);
  };

  const handleSuccess = () => {
    fetchTransactions();
  };

  const toggleExpand = (transactionId: string) => {
    setExpandedTransactionId(
      expandedTransactionId === transactionId ? null : transactionId
    );
  };

  // Helper pour trouver le nom du client
  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Client inconnu';
  };

  // Helper pour trouver le nom du produit
  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || 'Produit inconnu';
  };

  // Statistiques
  const totalRevenue = transactions.reduce((sum, t) => sum + t.totalPrice, 0);
  const averageTransaction = transactions.length > 0 ? totalRevenue / transactions.length : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos ventes et transactions
          </p>
        </div>
        <Button onClick={handleAdd}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouvelle transaction
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">
                Total transactions
              </p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-300 mt-1">
                {transactions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Chiffre d'affaires
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-1">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">
                Transaction moyenne
              </p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-300 mt-1">
                {formatCurrency(averageTransaction)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Liste des transactions */}
      <Card>
        {isLoading && transactions.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Chargement des transactions...
              </p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune transaction
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Créez votre première transaction
              </p>
              <Button onClick={handleAdd}>Nouvelle transaction</Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Produits</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Facture</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <TableRow>
                      <TableCell>
                        {formatDate(transaction.date, 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {getClientName(transaction.clientId)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant="info">
                            {transaction.soldProducts.length} produit(s)
                          </Badge>
                          <button
                            onClick={() => toggleExpand(transaction.id)}
                            className="text-primary-600 hover:text-primary-700 text-sm"
                          >
                            {expandedTransactionId === transaction.id ? 'Masquer' : 'Voir'}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(transaction.totalPrice)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {transaction.billingId ? (
                          <Badge variant="success">Générée</Badge>
                        ) : (
                          <Badge variant="warning">En attente</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleDelete(transaction)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </TableCell>
                    </TableRow>

                    {/* Détails produits (expandable) */}
                    {expandedTransactionId === transaction.id && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50 dark:bg-gray-800">
                          <div className="py-3 space-y-2">
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                              Détails des produits :
                            </h4>
                            {transaction.soldProducts.map((soldProduct, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                              >
                                <span className="text-gray-900 dark:text-white">
                                  {getProductName(soldProduct.productId)}
                                </span>
                                <div className="flex items-center space-x-4">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Quantité: <span className="font-medium">{soldProduct.quantity}</span>
                                  </span>
                                  {soldProduct.note && (
                                    <span className="text-gray-500 dark:text-gray-400 italic">
                                      Note: {soldProduct.note}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Modals */}
      <TransactionForm
        isOpen={showTransactionForm}
        onClose={() => setShowTransactionForm(false)}
        onSuccess={handleSuccess}
      />

      <DeleteTransactionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        transaction={selectedTransaction}
        onSuccess={handleSuccess}
      />
    </div>
  );
};