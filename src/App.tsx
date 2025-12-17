import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { ROUTES } from '@/lib/constants';
import { ClientsPage } from './pages/ClientsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BillingsPage } from './pages/BillingsPage';

/**
 * Page temporaire pour les routes non implémentées
 */
const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Cette page est en cours de développement
        </p>
      </div>
    </div>
  );
};

/**
 * Composant App principal
 * 
 * Configuration des routes avec MainLayout
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Public routes (sans layout) */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

        {/* Protected routes (avec MainLayout) */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PRODUCTS}
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProductsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.CLIENTS}
          element={
            <ProtectedRoute>
              <MainLayout>
                <ClientsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TRANSACTIONS}
          element={
            <ProtectedRoute>
              <MainLayout>
                <TransactionsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.BILLINGS}
          element={
            <ProtectedRoute>
              <MainLayout>
                <BillingsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 - Not Found */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
                <a
                  href={ROUTES.DASHBOARD}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;