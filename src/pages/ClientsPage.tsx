import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table';
import { ClientForm } from '@/components/features/clients/ClientForm';
import { DeleteClientDialog } from '@/components/features/clients/DeleteClientDialog';
import { useClientStore } from '@/stores/clientStore';
import { formatCurrency, getInitials, generateAvatarColor } from '@/lib/utils';
import { cn } from '@/lib/cn';
import type { Client } from '@/types';

/**
 * Page de gestion des clients
 */
export const ClientsPage: React.FC = () => {
  const { clients, isLoading, error, fetchClients } = useClientStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  /**
   * Charge les clients au montage
   */
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  /**
   * Filtre les clients
   */
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.tel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.numIdentiteFiscal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handlers
   */
  const handleAdd = () => {
    setSelectedClient(null);
    setShowClientForm(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setShowClientForm(true);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteDialog(true);
  };

  const handleSuccess = () => {
    fetchClients();
  };

  /**
   * Calcule les statistiques
   */
  const totalValue = clients.reduce((sum, client) => sum + client.value, 0);
  const activeClients = clients.filter(c => c.value > 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Clients
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez votre portefeuille clients
          </p>
        </div>
        <Button onClick={handleAdd}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouveau client
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total clients */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                Total clients
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 mt-1">
                {clients.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Clients actifs */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Clients actifs
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-1">
                {activeClients}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Valeur totale */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">
                Valeur totale
              </p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-300 mt-1">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Barre de recherche */}
      <Input
        type="text"
        placeholder="Rechercher par nom, email, numéro téléphone ou numéro fiscal..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tableau ou Grille des clients */}
      <Card>
        {isLoading && clients.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Chargement des clients...
              </p>
            </div>
          </div>
        ) : filteredClients.length === 0 ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'Aucun client trouvé' : 'Aucun client'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm
                  ? 'Essayez de modifier votre recherche'
                  : 'Commencez par ajouter votre premier client'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd}>Ajouter un client</Button>
              )}
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>N° Fiscal</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  {/* Client (avec avatar) */}
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold',
                        generateAvatarColor(client.name)
                      )}>
                        {getInitials(client.name)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {client.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {client.address || 'Pas d\'adresse'}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {client.email}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {client.tel || 'Pas de téléphone'}
                      </p>
                    </div>
                  </TableCell>

                  {/* Numéro fiscal */}
                  <TableCell>
                    <Badge variant="default">{client.numIdentiteFiscal}</Badge>
                  </TableCell>

                  {/* Valeur */}
                  <TableCell>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(client.value)}
                    </span>
                  </TableCell>

                  {/* Statut */}
                  <TableCell>
                    {client.value > 0 ? (
                      <Badge variant="success">Actif</Badge>
                    ) : (
                      <Badge variant="default">Inactif</Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(client)}
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
      <ClientForm
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
        client={selectedClient}
        onSuccess={handleSuccess}
      />

      <DeleteClientDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        client={selectedClient}
        onSuccess={handleSuccess}
      />
    </div>
  );
};