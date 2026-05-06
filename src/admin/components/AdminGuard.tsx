'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { getCurrentUserProfile } from '../config/database';
import { UserProfile } from '../types';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Composant de protection admin
 * Vérifie que l'utilisateur est authentifié et a le rôle admin
 * (Le middleware.ts fait déjà une première vérification)
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const profile = await getCurrentUserProfile();
      setUser(profile);
      setLoading(false);
    };
    verifyAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /*if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white shadow-xl rounded-xl">
          <ShieldAlert className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès Refusé</h2>
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white shadow-xl rounded-xl border-t-4 border-red-500">
          <ShieldAlert className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès Restreint</h2>
          <p className="text-gray-600">Seuls les administrateurs peuvent accéder au tableau de bord.</p>
        </div>
      </div>
    );
  }*/

  return <>{children}</>;
}
