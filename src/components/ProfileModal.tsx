'use client'

import { useState, useEffect } from 'react'
import { UserProfile } from '../types'
import { getCurrentUserProfile, updateUserProfile, getMediaUrl } from '../services/supabase'
import { supabase } from '../services/supabase/client'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen && !profile) {
      fetchProfile()
    }
  }, [isOpen])

  const fetchProfile = async () => {
    setLoading(true)
    const userProfile = await getCurrentUserProfile()
    setProfile(userProfile)
    if (userProfile) {
      setEditedProfile(userProfile)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setProfile(null)
      onClose()
      window.location.href = '/auth/login'
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (profile) {
      setEditedProfile(profile)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    const success = await updateUserProfile(editedProfile)
    if (success) {
      const updatedProfile = await getCurrentUserProfile()
      setProfile(updatedProfile)
      setIsEditing(false)
    }
    setIsSaving(false)
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="bg-app rounded-lg shadow-xl p-6 dark:bg-slate-900">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : profile ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-heading">Profil</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Profile Photo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {profile.photo ? (
                    <img
                      src={getMediaUrl(profile.photo)}
                      alt={`${profile.name} ${profile.surname}`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-accent"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white text-3xl font-bold border-4 border-accent">
                      {profile.name?.charAt(0)}{profile.surname?.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {isEditing ? (
                <>
                  {/* Edit Form */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-body mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={editedProfile.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-white text-body"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-body mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={editedProfile.surname || ''}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-white text-body"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-body mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editedProfile.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Edit Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2 border border-gray-300 text-body rounded-md hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-800 transition disabled:opacity-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition disabled:opacity-50"
                    >
                      {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Profile Info */}
                  <div className="space-y-3 mb-6 text-center">
                    <div>
                      <p className="text-sm text-body/60">Nom Complet</p>
                      <p className="text-lg font-semibold text-heading">
                        {profile.name} {profile.surname}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-body/60">Email</p>
                      <p className="text-body break-words">{profile.email}</p>
                    </div>
                    {profile.role && profile.role !== 'member' && (
                      <div>
                        <p className="text-sm text-body/60">Rôle</p>
                        <p className="text-body capitalize">{profile.role}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleEdit}
                      className="flex-1 px-4 py-2 border border-gray-300 text-body rounded-md hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2"
                    >
                      ✎ Modifier
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-body">Impossible de charger le profil</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
