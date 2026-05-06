'use client';

import React from 'react';
import { Plus, FileText } from 'lucide-react';
import CardItem from './CardItem';

interface MainContentProps {
  activeTable: string;
  isLoading: boolean;
  data: Record<string, any>[];
  onAddNew: () => void;
  onEdit: (item: Record<string, any>) => void;
  onDelete: (id: string) => void;
}

/**
 * Contenu principal - affiche la grille des éléments
 */
export default function MainContent({
  activeTable,
  isLoading,
  data,
  onAddNew,
  onEdit,
  onDelete
}: MainContentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER CONTENU */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-500">
            Gérez vos données de la table <strong className="text-gray-800 capitalize">{activeTable}</strong>
          </p>
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            Nouveau
          </button>
        </div>

        {/* CONTENU */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune donnée</h3>
            <p className="text-gray-500">Commencez par ajouter un nouvel élément.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item: Record<string, any>) => (
              <CardItem 
                key={item.id} 
                item={item} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
