'use client'

export default function CardItem({ item, onEdit, onDelete }: any) {
  return (
    <div className="border p-4 rounded shadow flex justify-between items-center">
      <div onClick={() => onEdit(item)} className="cursor-pointer">
        <p className="font-bold">{item.name || item.title}</p>
        <p className="text-sm text-gray-500">{item.role || item.date}</p>
      </div>

      <button
        onClick={() => {
          if (confirm('Supprimer ?')) onDelete(item.id)
        }}
        className="text-red-500"
      >
        🗑️
      </button>
    </div>
  )
}