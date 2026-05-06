'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase/client'
import { uploadFile } from '../lib/upload'
import { LogOut, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfileCard() {
  const [profile, setProfile] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // 🔐 GET USER PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push('/auth/login')
        return
      }

      const user = data.session.user

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)
      setForm(profileData)
    }

    fetchProfile()
  }, [])

  // 📸 UPLOAD PHOTO
  const handleUpload = async (file: File) => {
    const url = await uploadFile(file, 'amescao')
    setForm({ ...form, photo: url })
  }

  // 💾 SAVE
  const handleSave = async () => {
    try {
      setLoading(true)

      await supabase
        .from('profiles')
        .update({
          name: form.name,
          surname: form.surname,
          photo: form.photo
        })
        .eq('id', profile.id)

      setProfile(form)
      setEditing(false)

    } catch (err) {
      alert('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  // 🔴 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!profile) return null

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">

      {/* PHOTO + EDIT */}
      <div className="flex flex-col items-center mb-4">

        <div className="relative group">

          {profile.photo ? (
            <img
              src={profile.photo}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-400 rounded-full flex items-center justify-center text-white text-2xl">
              {profile.name?.[0]}
            </div>
          )}

          {/* EDIT ICON */}
          <button
            onClick={() => setEditing(true)}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <Pencil size={16} />
          </button>

        </div>

      </div>

      {/* INFOS */}
      <div className="text-center">
        <p className="font-bold text-lg">
          {profile.name} {profile.surname}
        </p>
        <p className="text-gray-500">{profile.email}</p>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="mt-6 w-full flex items-center justify-center gap-2 text-red-600 border border-red-500 py-2 rounded hover:bg-red-50 transition"
      >
        <LogOut size={18} />
        Déconnexion
      </button>

      {/* MODAL EDIT */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-xl font-bold mb-4">Modifier profil</h2>

            {/* PHOTO */}
            <div className="mb-4 text-center">

              {form.photo ? (
                <img src={form.photo} className="w-20 h-20 rounded-full mx-auto" />
              ) : (
                <div className="w-20 h-20 bg-gray-400 rounded-full mx-auto flex items-center justify-center text-white">
                  {form.name?.[0]}
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e.target.files![0])}
                className="mt-2"
              />

            </div>

            {/* NAME */}
            <input
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nom"
              className="w-full border p-2 mb-2 rounded"
            />

            {/* SURNAME */}
            <input
              value={form.surname || ''}
              onChange={(e) => setForm({ ...form, surname: e.target.value })}
              placeholder="Prénom"
              className="w-full border p-2 mb-4 rounded"
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">

              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Annuler
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}