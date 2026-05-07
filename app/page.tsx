'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../src/services/supabase/client'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      router.push(data.session ? '/home' : '/auth/login')
    }
    checkAuth()
  }, [router])

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        <p className="text-white mt-4">Redirection...</p>
      </div>
    </div>
  )
}