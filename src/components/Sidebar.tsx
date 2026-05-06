'use client'

import { useState } from 'react'
import {
  Users,
  FileText,
  Calendar,
  Image,
  User
} from 'lucide-react'

const items = [
  { name: 'bureau', icon: Users },
  { name: 'profiles', icon: User },
  { name: 'reports', icon: FileText },
  { name: 'events', icon: Calendar },
  { name: 'albums', icon: Image }
]

export default function Sidebar({ active, setActive }: any) {
  const [open, setOpen] = useState(true)

  return (
    <div className={`bg-gray-900 text-white h-screen transition-all ${open ? 'w-60' : 'w-20'}`}>
      
      <button onClick={() => setOpen(!open)} className="p-4">
        ☰
      </button>

      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-700 ${
              active === item.name && 'bg-gray-700'
            }`}
          >
            <Icon size={20} />
            {open && <span>{item.name}</span>}
          </div>
        )
      })}
    </div>
  )
}