import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

/**
 * Props du MainLayout
 */
interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /**
   * Toggle la sidebar (mobile)
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {/* Container avec max-width pour le contenu */}
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Footer (optionnel) */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-4 px-6">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              © 2025 Billy. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
