'use client'

import { useEffect } from 'react'
import { supabase } from '../src/services/supabase/client'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        router.push('/auth/login')
        return
      }

      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push('/auth/login')
      } else {
        router.push('/home')
      }
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