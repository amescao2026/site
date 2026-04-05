'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

const Navbar: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
              <div className="absolute right-0 mt-2 w-32 bg-[#FFFFFF] dark:bg-[#1A1A1A] rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-[#E5E7EB] dark:border-[#2A2A2A] p-2 z-50">
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
            className="md:hidden glass border-t border-[#E5E7EB] dark:border-[#2A2A2A] overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
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
    </nav>
  );
};

export default Navbar;
