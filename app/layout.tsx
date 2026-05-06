import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'AMESCAO - Association pour le Mieux-Être Social et Culturel d\'Aouda',
  description: 'Soutenir l\'éducation et l\'avenir de la jeunesse d\'Aouda, Togo.',
  openGraph: {
    title: 'AMESCAO',
    description: 'Soutenir l\'éducation et l\'avenir de la jeunesse d\'Aouda, Togo.',
    url: 'https://amescao.org',
    siteName: 'AMESCAO',
    images: [
      {
        url: 'https://picsum.photos/seed/amescao_hero/1200/630',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

