'use client';

import React from 'react';
import { Trash2, FileText } from 'lucide-react';

interface CardItemProps {
  item: Record<string, any>;
  onEdit: (item: Record<string, any>) => void;
  onDelete: (id: string) => void;
}

/**
 * Carte d'affichage d'un élément (utilisée dans la grille)
 */
export default function CardItem({ item, onEdit, onDelete }: CardItemProps) {
  const title = item.title || item.name || item.event_title || 'Sans titre';
  const subtitle = item.role || item.date || item.event_date || item.email || '';
  const photo = item.cover_photo || item.photo || (item.photos && item.photos[0]) || null;

  return (
    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
      <div 
        onClick={() => onEdit(item)} 
        className="flex items-center gap-4 cursor-pointer flex-1 overflow-hidden"
      >
        {photo ? (
          <img src={photo} alt={title} className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <FileText size={24} />
          </div>
        )}
        <div className="truncate">
          <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
            {title}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {typeof subtitle === 'string' && subtitle.includes('T') ? new Date(subtitle).toLocaleDateString('fr-FR') : subtitle}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm('Voulez-vous vraiment supprimer cet élément ?')) onDelete(item.id);
        }}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2"
        title="Supprimer"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
