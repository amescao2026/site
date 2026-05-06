'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase/client'
import CardItem from './CardItem'

export default function DataList({ table, onEdit }: any) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 📡 FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setData(data || [])
    } catch (err: any) {
      console.error(err)
      setError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!table) return
    fetchData()
  }, [table])

  // 🗑️ DELETE ITEM
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Voulez-vous vraiment supprimer cet élément ?')
    if (!confirmDelete) return

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      // 🔄 refresh local state sans refetch complet
      setData((prev) => prev.filter((item) => item.id !== id))

    } catch (err) {
      console.error(err)
      alert('Erreur lors de la suppression')
    }
  }

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Chargement...
      </div>
    )
  }

  // ❌ ERROR
  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-red-500">
        {error}
      </div>
    )
  }

  // 📭 EMPTY STATE
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Aucun élément trouvé
      </div>
    )
  }

  // ✅ DATA DISPLAY
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

      {data.map((item) => (
        <CardItem
          key={item.id}
          item={item}
          table={table}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}

    </div>
  )
}