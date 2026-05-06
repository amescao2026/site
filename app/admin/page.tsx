'use client';

import React, { useState } from 'react';
import { Calendar, ImageIcon, FileText, Users, UserCircle } from 'lucide-react';

// Imports des composants admin modulaires
import AdminGuard from '@/src/admin/components/AdminGuard';
import Sidebar from '@/src/admin/components/Sidebar';
import Header from '@/src/admin/components/Header';
import MainContent from '@/src/admin/components/MainContent';
import FormModal from '@/src/admin/components/modals/FormModal';

// Imports des hooks et services
import { useAdminData } from '@/src/admin/hooks/useAdminData';
import { logoutUser } from '@/src/admin/config/database';
import { NavItem } from '@/src/admin/types';

/**
 * Page Admin - Tableau de bord pour gérer le contenu Supabase
 * 
 * Architecture modulaire refactorisée :
 * - AdminGuard : Protection (vérification du rôle admin)
 * - Sidebar : Navigation avec tables
 * - Header : En-tête avec compteur d'éléments
 * - MainContent : Grille d'éléments avec actions
 * - FormModal : Formulaire dynamique pour create/update
 * - useAdminData : Hook personnalisé pour la gestion des données et des CRUD
 * 
 * Tous les composants modulaires sont dans src/admin/ pour une meilleure organisation.
 * Services de database dans src/admin/config/database.ts
 * Types dans src/admin/types.ts
 * Schémas dans src/admin/schemas.ts
 */
export default function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTable, setActiveTable] = useState('events');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(null);

  // Données de navigation
  const NAVIGATION: NavItem[] = [
    { id: 'events', label: 'Événements', icon: Calendar },
    { id: 'albums', label: 'Albums Photos', icon: ImageIcon },
    { id: 'reports', label: 'Rapports', icon: FileText },
    { id: 'bureau', label: 'Membres du Bureau', icon: Users },
    { id: 'profiles', label: 'Profils Utilisateurs', icon: UserCircle },
  ];

  // Hook pour gérer les données
  const { data, isLoading, onSave, onDelete } = useAdminData(activeTable);

  // Handlers
  const handleEdit = (item: Record<string, any>) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Delete error', error);
      alert('Erreur lors de la suppression.');
    }
  };

  const handleSaveModal = async (savedData: Record<string, any>) => {
    try {
      await onSave(savedData);
    } catch (error) {
      console.error('Save error', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error', error);
      alert('Erreur lors de la déconnexion');
    }
  };

  return (
    <AdminGuard>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          activeTable={activeTable}
          onTableChange={setActiveTable}
          navigation={NAVIGATION}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          
          {/* Header */}
          <Header
            activeTable={activeTable}
            navigation={NAVIGATION}
            dataCount={data.length}
          />

          {/* Content Area */}
          <MainContent
            activeTable={activeTable}
            isLoading={isLoading}
            data={data}
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>

        {/* Form Modal */}
        {isModalOpen && (
          <FormModal 
            table={activeTable}
            item={selectedItem}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveModal}
          />
        )}
      </div>
    </AdminGuard>
  );
}


