import React, { useState, useEffect } from 'react';
import { Menu, X, Compass, LogOut, Shield, User, Landmark } from 'lucide-react';
import { LoggedInUser, getCurrentUser, logout } from '../utils/db';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  user: LoggedInUser | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({ activeSection, onNavigate, user, onLogout, onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Início' },
    { id: 'about', label: 'Sobre' },
    { id: 'highlights', label: 'Destaques' },
    { id: 'gallery', label: 'Galeria' },
    { id: 'schedule', label: 'Programação' },
    { id: 'pricing', label: 'Valores' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contato' },
  ];

  const handleNavItemClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('hero')}>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Compass className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display tracking-wider text-white">SUMMER CAMP</span>
                <span className="text-[10px] font-mono tracking-widest text-orange-400 font-semibold">JUVENTUDE CONVICTOS</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'text-orange-500 bg-orange-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Button & Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2">
                  {user.role === 'admin' ? (
                    <Shield className="w-4 h-4 text-orange-500" />
                  ) : (
                    <User className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-xs font-semibold text-white max-w-[120px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                </div>
                
                <button
                  onClick={() => onNavigate(user.role === 'admin' ? 'admin' : 'participant')}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                >
                  {user.role === 'admin' ? 'Painel' : 'Minha Área'}
                </button>

                <button
                  onClick={onLogout}
                  title="Sair"
                  className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <User className="w-4 h-4" />
                <span>Entrar</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('registration')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-md shadow-orange-500/20 hover:scale-[1.03] transition-all cursor-pointer"
            >
              Inscrever-se
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => onNavigate('registration')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-md shadow-orange-500/20"
            >
              Inscrição
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden glass border-t border-white/5 animate-in slide-in-from-top-5 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-orange-500 bg-orange-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="pt-4 pb-2 border-t border-white/10 mt-2 px-4 space-y-3">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {user.role === 'admin' ? (
                      <Shield className="w-4 h-4 text-orange-500" />
                    ) : (
                      <User className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-sm font-semibold text-white">{user.fullName}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNavItemClick(user.role === 'admin' ? 'admin' : 'participant')}
                      className="px-3 py-2 rounded-lg text-center text-xs font-medium bg-white/5 text-gray-300 hover:text-white"
                    >
                      {user.role === 'admin' ? 'Painel Admin' : 'Minha Área'}
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="px-3 py-2 rounded-lg text-center text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setIsOpen(false);
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-xl text-base font-semibold border border-white/20 text-white hover:bg-white/10"
                >
                  Entrar na Área do Participante
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
