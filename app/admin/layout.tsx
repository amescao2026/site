'use client'

import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {children}
    </div>
  )
}


/*'use client'

import { useEffect, useState, ReactNode } from 'react'
import { supabase } from '../../src/services/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        if (!supabase) {
          router.push('/home')
          return
        }

        const { data } = await supabase.auth.getSession()

        if (!data.session) {
          router.push('/auth/login')
          return
        }

        // Vérifier le rôle d'admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single()

        if (profile?.role !== 'admin') {
          router.push('/home')
          return
        }

        setIsAdmin(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Admin role check error:', error)
        router.push('/home')
      }
    }

    checkAdminRole()
  }, [router])

  if (isLoading || !isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="text-white mt-4">Vérification des droits administrateur...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}*/