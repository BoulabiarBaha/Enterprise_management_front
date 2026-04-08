import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/constants';
import { useStatsStore } from '@/stores/statsStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Composant StatCard - Carte de statistique
 */
interface StatCardProps {
  title: string;
  value: number | undefined;
  change: string;
  isPositive: boolean;
  descriptionSpan: string;
  icon: React.ReactNode;
  iconBgColor: string;
  tooltip?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, descriptionSpan, icon, iconBgColor, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {value}
            </p>
            <div className="flex items-center flex-wrap mt-2">
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '↑' : '↓'} {change}
              </span>
              {tooltip && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                {descriptionSpan}
              </span>
            </div>
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        {showTooltip && tooltip && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 animate-fade-in">
            {tooltip}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Page Dashboard
 * 
 * Affiche:
 * - Message de bienvenue
 * - Statistiques clés (produits, clients, transactions, CA)
 * - Graphiques (à venir)
 * - Activités récentes
 */
export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { stats, isLoading, error, fetchStats } = useStatsStore();

  /**
   * Charge les statistiques au montage
   */
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statsData = [
    {
      title: 'Total Produits',
      value: stats?.totalProducts || 0,
      change: `${stats?.productCoverageRate.toFixed(2) || 0}%`,
      isPositive: (stats?.productCoverageRate ?? 0) >= 50,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      iconBgColor: 'bg-blue-500',
      descriptionSpan: 'taux de couverture',
      tooltip: "Le taux de couverture indique le pourcentage de produits qui ont été vendus au moins une fois par rapport à l'ensemble des produits dans votre catalogue.",
    },
    {
      title: 'Clients Actifs',
      value: stats?.activeClients,
      change: `${stats?.clientConversionRate.toFixed(2) || 0}%`,
      isPositive: true,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      iconBgColor: 'bg-green-500',
      descriptionSpan: 'taux de conversion',
      tooltip: 'Le taux de conversion représente le pourcentage de clients actifs par rapport au total de vos clients.',
    },
    {
      title: 'Transactions',
      value: stats?.totalTransactions,
      change: `${stats?.repurchaseRate.toFixed(2) || 0}%`,
      isPositive: true,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      iconBgColor: 'bg-purple-500',
      descriptionSpan: `taux de réachat`,
      tooltip: 'Le taux de réachat indique le pourcentage de clients actifs ayant réalisé 2 achats ou plus.',
    },
    {
      title: `Chiffre d'Affaires`,
      value: stats?.totalRevenue,
      change: `${(stats?.revenueChange ?? 0) >= 0 ? '+' : ''}${stats?.revenueChange?.toFixed(2) || 0}%`,
      isPositive: (stats?.revenueChange ?? 0) >= 0,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBgColor: 'bg-orange-500',
      descriptionSpan: 'vs le mois précédant',
      tooltip: "Ce pourcentage indique l'évolution de votre chiffre d'affaire par rapport au mois précédent.",
    },
  ];

  // Merge monthly revenue and clients data for the chart (chronological order)
  const chartData = useMemo(() => {
    const monthNames: Record<string, string> = {
      '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr',
      '05': 'Mai', '06': 'Juin', '07': 'Juil', '08': 'Août',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc',
    };

    // Build a map keyed by month string (e.g. "2026-02")
    const dataMap = new Map<string, { name: string; revenue: number; clients: number }>();

    stats?.monthlyRevenue?.forEach((item) => {
      const key = item.month ?? '';
      const monthNum = key.split('-')[1] ?? '';
      dataMap.set(key, {
        name: monthNames[monthNum] || monthNum,
        revenue: item.revenue,
        clients: 0,
      });
    });

    stats?.monthlyClients?.forEach((item) => {
      const key = item.month ?? '';
      const monthNum = key.split('-')[1] ?? '';
      const existing = dataMap.get(key);
      if (existing) {
        existing.clients = item.count;
      } else {
        dataMap.set(key, {
          name: monthNames[monthNum] || monthNum,
          revenue: 0,
          clients: item.count,
        });
      }
    });

    if (dataMap.size === 0) return [];

    return [...dataMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);
  }, [stats?.monthlyRevenue, stats?.monthlyClients]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {user?.username} ! 👋
        </h1>
        <p className="text-primary-100">
          Voici un aperçu de votre activité aujourd'hui
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-2" />
                  </div>
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : (
          // Stats cards
          statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))
        )}
      </div>


      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution sur 5 mois</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="revenue" orientation="left" />
                  <YAxis yAxisId="clients" orientation="right" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? `${value.toLocaleString()} DT` : value,
                      name === 'revenue' ? "Chiffre d'Affaires" : 'Clients',
                    ]}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Legend
                    formatter={(value: string) =>
                      value === 'revenue' ? "Chiffre d'Affaires" : 'Clients'
                    }
                  />
                  <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                  <Line yAxisId="clients" type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                <p>Aucune donnée disponible</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={() => navigate(ROUTES.TRANSACTIONS)}
                className="w-full px-4 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-left flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium">Nouvelle Transaction</span>
              </button>

              <button
                onClick={() => navigate(ROUTES.CLIENTS)}
                className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="font-medium">Ajouter Client</span>
              </button>

              <button
                onClick={() => navigate(ROUTES.PRODUCTS)}
                className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium">Nouveau Produit</span>
              </button>

              <button
                onClick={() => navigate(ROUTES.BILLINGS)}
                className="w-full px-4 py-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-left flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">Voir Factures</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};