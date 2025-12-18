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