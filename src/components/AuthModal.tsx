import React, { useState } from 'react';
import { X, Shield, User, Key, AlertTriangle } from 'lucide-react';
import { login, LoggedInUser } from '../utils/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: LoggedInUser) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'participant' | 'admin'>('participant');
  
  // Participant credentials
  const [email, setEmail] = useState('');
  const [codeOrCpf, setCodeOrCpf] = useState('');
  
  // Admin credentials
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // Status
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'participant') {
      if (!email.trim() || !codeOrCpf.trim()) {
        setError('Preencha todos os campos.');
        return;
      }
      
      const logged = login(email, codeOrCpf);
      if (logged && logged.role === 'participant') {
        onLoginSuccess(logged);
        onClose();
      } else {
        setError('E-mail ou Código/CPF inválidos. Verifique as credenciais ou registre-se!');
      }
    } else {
      if (!adminEmail.trim() || !adminPassword.trim()) {
        setError('Preencha os campos administrativos.');
        return;
      }
      
      const logged = login(adminEmail, adminPassword);
      if (logged && logged.role === 'admin') {
        onLoginSuccess(logged);
        onClose();
      } else {
        setError('Usuário administrador ou senha incorretos.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-card rounded-3xl p-6 md:p-8 max-w-md w-full border border-white/10 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-yellow-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
            <Key className="w-5 h-5 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white font-display">Acessar Conta</h3>
          <p className="text-xs text-gray-400">Entre para acompanhar sua inscrição ou gerenciar as tribos.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 rounded-xl bg-white/5 border border-white/5">
          <button
            onClick={() => {
              setActiveTab('participant');
              setError('');
            }}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-bold tracking-wide transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'participant' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Participante</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('admin');
              setError('');
            }}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-bold tracking-wide transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'admin' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Líder / Admin</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center space-x-2 animate-in slide-in-from-top-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {activeTab === 'participant' ? (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">E-mail Cadastrado</label>
                <input
                  type="email"
                  required
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#091124] border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Código de Inscrição ou CPF (apenas números)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SC27-XXXX ou 00000000000"
                  value={codeOrCpf}
                  onChange={(e) => setCodeOrCpf(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#091124] border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">E-mail de Líder</label>
                <input
                  type="email"
                  required
                  placeholder="admin@convictos.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#091124] border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Senha Administrativa</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#091124] border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Secret test hint card */}
              <div className="bg-orange-500/5 p-3 rounded-xl border border-orange-500/10 text-[10px] text-orange-400">
                💡 <strong>Acesso Teste:</strong> Use o e-mail <strong className="text-white select-all">admin@convictos.com</strong> e senha <strong className="text-white select-all">admin123</strong> para testar as funcionalidades administrativas.
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 text-white hover:scale-[1.01] transition-all cursor-pointer"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
