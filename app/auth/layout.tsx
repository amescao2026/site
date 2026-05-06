'use client'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Le middleware gère les redirections (utilisateur déjà connecté → /home)
  // Ce layout n'a juste besoin de rendre les enfants
  return <>{children}</>
}