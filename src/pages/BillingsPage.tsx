import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table';
import { BillingDetailModal } from '@/components/features/billings/BillingDetailModal';
import { useTransactionStore } from '@/stores/transactionStore';
import { useClientStore } from '@/stores/clientStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Transaction } from '@/types';

export const BillingsPage: React.FC = () => {
  const { transactions, isLoading, error, fetchTransactions } = useTransactionStore();
  const { clients, fetchClients } = useClientStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
    fetchClients();
  }, [fetchTransactions, fetchClients]);

  // Filtre les transactions qui ont une facture
  const transactionsWithBilling = transactions.filter((t) => t.billingId);

  // Filtre selon la recherche
  const filteredTransactions = transactionsWithBilling.filter((transaction) => {
    const client = clients.find((c) => c.id === transaction.clientId);
    const clientName = client?.name.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return (
      clientName.includes(search) ||
      transaction.id.toLowerCase().includes(search) ||
      formatCurrency(transaction.totalPrice).toLowerCase().includes(search)
    );
  });

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Client inconnu';
  };

  // Statistiques
  const totalBillings = transactionsWithBilling.length;
  const totalAmount = transactionsWithBilling.reduce((sum, t) => sum + t.totalPrice, 0);
  const totalWithTax = totalAmount * 1.19; // Assuming 19% tax

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Factures
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Consultez et téléchargez vos factures
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                Total factures
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 mt-1">
                {totalBillings}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Montant HT
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-1">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">
                Montant TTC
              </p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-300 mt-1">
                {formatCurrency(totalWithTax)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Barre de recherche */}
      <Input
        type="text"
        placeholder="Rechercher par client, montant..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Table des factures */}
      <Card>
        {isLoading && transactions.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Chargement des factures...
              </p>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'Aucune facture trouvée' : 'Aucune facture'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? 'Essayez de modifier votre recherche'
                  : 'Les factures sont générées automatiquement lors de la création de transactions'}
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Montant HT</TableHead>
                <TableHead>TVA</TableHead>
                <TableHead>Montant TTC</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                const totalHT = transaction.totalPrice;
                const tva = totalHT * 0.19;
                const totalTTC = totalHT + tva;

                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {formatDate(transaction.date, 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {getClientName(transaction.clientId)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        #{transaction.id.substring(0, 8)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(totalHT)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatCurrency(tva)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(totalTTC)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Générée</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleViewDetail(transaction)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voir
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Modal de détail */}
      <BillingDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};