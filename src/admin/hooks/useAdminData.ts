import { useState, useEffect } from 'react';
import { getAll, insertItem, updateItem, deleteItem } from '../config/database';

/**
 * Hook personnalisé pour gérer les données du tableau de bord admin
 */
export function useAdminData(activeTable: string) {
  const [data, setData] = useState<Record<string, any>>({});
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Charger les données de la table active
  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const fetchedData = await getAll(activeTable);
      setData(prev => ({ ...prev, [activeTable]: fetchedData }));
    } catch (error) {
      console.error(`[useAdminData] Erreur de chargement pour ${activeTable}:`, error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Recharger quand la table active change
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTable]);

  // Ajouter un nouvel élément
  const handleAddNew = async (payload: Record<string, any>) => {
    try {
      await insertItem(activeTable, payload);
      await loadData();
    } catch (error) {
      console.error('[useAdminData] Erreur lors de l\'ajout:', error);
      throw error;
    }
  };

  // Mettre à jour un élément
  const handleUpdate = async (id: string, payload: Record<string, any>) => {
    try {
      await updateItem(activeTable, id, payload);
      await loadData();
    } catch (error) {
      console.error('[useAdminData] Erreur lors de la mise à jour:', error);
      throw error;
    }
  };

  // Supprimer un élément
  const handleDelete = async (id: string) => {
    try {
      await deleteItem(activeTable, id);
      await loadData();
    } catch (error) {
      console.error('[useAdminData] Erreur lors de la suppression:', error);
      throw error;
    }
  };

  // Sauvegarder (créer ou mettre à jour)
  const handleSave = async (item: Record<string, any>) => {
    if (item.id) {
      await handleUpdate(item.id, item);
    } else {
      await handleAddNew(item);
    }
  };

  const currentTableData = data[activeTable] || [];

  return {
    data: currentTableData,
    isLoading: isLoadingData,
    loadData,
    onSave: handleSave,
    onDelete: handleDelete
  };
}
