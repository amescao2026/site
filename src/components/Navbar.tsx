'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, UserProfile } from '../types';
import ProfileModal from './ProfileModal';
import { getCurrentUserProfile, getMediaUrl } from '../services/supabase';

const Navbar: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const pathname = usePathname();

  // Charger le profil de l'utilisateur au montage
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const navItems = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.events, path: '/events' },
    { name: t.nav.albums, path: '/albums' },
    { name: t.nav.contact, path: '/contact' },
    { name: t.nav.support, path: '/support' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "anticipate" }}
              className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20"
            >
              A
            </motion.div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-main leading-none">AMESCAO</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Aouda, Togo</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-5 py-2 text-sm font-black uppercase tracking-widest transition-all duration-300 rounded-xl overflow-hidden group ${
                  pathname === item.path ? 'text-primary' : 'text-muted hover:text-body'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {pathname === item.path && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl z-0"
                  />
                )}
              </Link>
              ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
              <div className="relative group">
              <button className="w-10 h-10 rounded-xl hover:bg-secondary transition-all flex items-center justify-center text-muted">
                <Globe size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-card rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-subtle p-2 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-secondary transition-all ${
                      language === lang.code ? 'text-primary bg-primary/5' : 'text-muted'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl hover:bg-secondary transition-all flex items-center justify-center text-muted"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Profile Circle */}
            {!loadingProfile && profile && (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-accent hover:border-accent-dark transition-all overflow-hidden"
                title={`${profile.name} ${profile.surname}`}
              >
                {profile.photo ? (
                  <img
                    src={getMediaUrl(profile.photo)}
                    alt={`${profile.name} ${profile.surname}`}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white text-xs font-bold">
                    {profile.name?.charAt(0)}{profile.surname?.charAt(0)}
                  </div>
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 rounded-xl hover:bg-secondary transition-all flex items-center justify-center text-muted"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
            <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass border-t border-subtle overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-4">
              {/* Mobile Profile Section */}
              {!loadingProfile && profile && (
                <div className="flex items-center gap-4 pb-4 border-b border-subtle">
                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-accent hover:border-accent-dark transition-all overflow-hidden flex-shrink-0"
                    title={`${profile.name} ${profile.surname}`}
                  >
                    {profile.photo ? (
                      <img
                        src={getMediaUrl(profile.photo)}
                        alt={`${profile.name} ${profile.surname}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white text-sm font-bold">
                        {profile.name?.charAt(0)}{profile.surname?.charAt(0)}
                      </div>
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="font-black text-heading">
                      {profile.name} {profile.surname}
                    </p>
                    <p className="text-xs text-muted">{profile.email}</p>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                      pathname === item.path
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-muted hover:bg-secondary'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </nav>
  );
};

export default Navbar;
