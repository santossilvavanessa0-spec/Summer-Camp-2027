import React, { useState, useEffect } from 'react';
import { User, QrCode, Download, Edit3, ShieldAlert, CreditCard, RefreshCw, Key, Check, Info, FileText } from 'lucide-react';
import { getRegistrations, saveRegistrations, getCurrentUser, login, logout, LoggedInUser } from '../utils/db';
import { Registration, RegistrationStatus, TshirtSize, PaymentMethod } from '../types';

interface ParticipantAreaProps {
  user: LoggedInUser | null;
  onLoginSuccess: (user: LoggedInUser) => void;
  onLogout: () => void;
}

export default function ParticipantArea({ user, onLoginSuccess, onLogout }: ParticipantAreaProps) {
  // Login form state
  const [email, setEmail] = useState('');
  const [codeOrCpf, setCodeOrCpf] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Registration data editing state
  const [regData, setRegData] = useState<Registration | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  
  // Edited values
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [tshirtSize, setTshirtSize] = useState<TshirtSize>(TshirtSize.M);
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');

  // Authorization Form Modal state
  const [showAuthForm, setShowAuthForm] = useState(false);

  // Sync edited values when regData changes
  useEffect(() => {
    if (regData) {
      setPhone(regData.phone);
      setWhatsapp(regData.whatsapp);
      setAddress(regData.address);
      setTshirtSize(regData.tshirtSize);
      setAllergies(regData.allergiesDetails || '');
      setMedications(regData.medicationsDetails || '');
    }
  }, [regData]);

  // Load registration details for logged-in participant
  useEffect(() => {
    if (user && user.role === 'participant') {
      const regs = getRegistrations();
      const found = regs.find(r => r.id === user.id || r.registrationCode === user.registrationCode);
      if (found) {
        setRegData(found);
      }
    } else {
      setRegData(null);
    }
  }, [user]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!email.trim() || !codeOrCpf.trim()) {
      setLoginError('Preencha o e-mail e o código/CPF para entrar.');
      return;
    }

    const loggedUser = login(email, codeOrCpf);
    if (loggedUser && loggedUser.role === 'participant') {
      onLoginSuccess(loggedUser);
    } else {
      setLoginError('E-mail, Código ou CPF inválidos. Tente novamente.');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData) return;

    const regs = getRegistrations();
    const index = regs.findIndex(r => r.id === regData.id);
    if (index !== -1) {
      const updatedReg = {
        ...regs[index],
        phone,
        whatsapp,
        address,
        tshirtSize,
        allergiesDetails: allergies,
        hasAllergies: allergies.trim().length > 0,
        medicationsDetails: medications,
        hasMedications: medications.trim().length > 0
      };
      
      regs[index] = updatedReg;
      saveRegistrations(regs);
      setRegData(updatedReg);
      setIsEditing(false);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 4000);
    }
  };

  // Helper to generate custom styled QR Code URL
  const qrUrl = regData 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        `SUMMER-CAMP-2027|CODE:${regData.registrationCode}|NAME:${regData.fullName}|STATUS:${regData.status}`
      )}&color=ea580c&bgcolor=ffffff`
    : '';

  // Simple printable authorization screen
  const printAuthorization = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !regData) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Autorização Summer Camp 2027</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #ea580c; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #ea580c; letter-spacing: 1px; }
          .org { font-size: 12px; color: #666; font-family: monospace; text-transform: uppercase; margin-top: 5px; }
          h1 { font-size: 20px; text-align: center; text-transform: uppercase; margin-bottom: 40px; }
          .form-text { text-align: justify; font-size: 14px; margin-bottom: 30px; }
          .line { display: inline-block; border-bottom: 1px solid #000; width: 250px; text-align: center; }
          .long-line { display: inline-block; border-bottom: 1px solid #000; width: 450px; }
          .signatures { margin-top: 80px; display: flex; justify-content: space-between; }
          .sig-block { text-align: center; width: 45%; }
          .footer { margin-top: 100px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SUMMER CAMP 2027</div>
          <div class="org">Juventude Convictos • IEQ Inhoaíba</div>
        </div>
        
        <h1>Autorização de Viagem e Hospedagem</h1>
        
        <div class="form-text">
          Eu, <span class="long-line"></span>,<br>
          portador do RG nº <span class="line"></span> e CPF nº <span class="line"></span>,<br>
          na qualidade de pai, mãe ou responsável legal do(a) menor <strong>${regData.fullName}</strong>,<br>
          nascido(a) em <strong>${new Date(regData.birthDate).toLocaleDateString('pt-BR')}</strong>, portador do RG nº <strong>${regData.rg}</strong>,
          <strong>AUTORIZO</strong> o(a) mesmo(a) a viajar sob a coordenação da liderança da Juventude Convictos - IEQ Inhoaíba para participar do retiro de carnaval <strong>Summer Camp 2027</strong>, a realizar-se no período de 05 a 09 de Fevereiro de 2027, em Sítio das Tribos (Rio de Janeiro), bem como hospedar-se no mesmo estabelecimento.
        </div>
        
        <div class="form-text">
          Declaro estar ciente de que o menor deve obedecer aos regulamentos do evento e regras de convivência cristã e que o transporte fretado está incluso na programação.
        </div>
        
        <p style="margin-top: 40px; font-size: 14px;">Rio de Janeiro, _____ de ______________________ de 2026.</p>
        
        <div class="signatures">
          <div class="sig-block">
            <div style="border-top: 1px solid #000; margin-top: 50px; padding-top: 10px;">
              Assinatura do Responsável Legal
            </div>
          </div>
          <div class="sig-block">
            <div style="border-top: 1px solid #000; margin-top: 50px; padding-top: 10px;">
              CPF do Responsável
            </div>
          </div>
        </div>
        
        <div class="footer">
          Código da Inscrição: ${regData.registrationCode} • Gerado em ${new Date().toLocaleDateString('pt-BR')} via Portal Convictos 2027
        </div>
        
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // If user is not logged in or role is admin, show participant login
  if (!user || user.role !== 'participant' || !regData) {
    return (
      <section id="participant" className="py-24 bg-[#081021] relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background glow overlay */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full mx-auto px-4">
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-2xl font-extrabold font-display text-white">Portal do Participante</h2>
              <p className="text-xs text-gray-400">Insira as credenciais geradas na sua inscrição para acessar seu painel, QR Code e autorização.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center space-x-2">
                  <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-xs font-semibold text-gray-300">Seu E-mail Cadastrado</label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="login-code" className="text-xs font-semibold text-gray-300">Código de Inscrição ou CPF (apenas números)</label>
                <input
                  id="login-code"
                  type="text"
                  required
                  value={codeOrCpf}
                  onChange={(e) => setCodeOrCpf(e.target.value)}
                  placeholder="Ex: SC27-XXXX ou seu CPF"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center block"
              >
                Acessar Painel
              </button>
            </form>

            <div className="text-center pt-2 border-t border-white/5">
              <p className="text-xs text-gray-500">
                Ainda não fez sua inscrição?{' '}
                <a
                  href="#registration"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('registration');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-orange-400 hover:underline font-bold"
                >
                  Inscreva-se agora
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="participant" className="py-24 bg-[#081021] relative overflow-hidden min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/5 border border-white/5 p-6 rounded-3xl gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-yellow-500 flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider">PORTAL DO PARTICIPANTE</span>
              <h2 className="text-2xl font-black font-display text-white">{regData.fullName}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4.5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white hover:bg-white/5 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Edit3 className="w-4 h-4 text-orange-400" />
              <span>{isEditing ? 'Cancelar Edição' : 'Editar Cadastro'}</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {editSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-sm text-emerald-300 flex items-center space-x-2 animate-in fade-in">
            <Check className="w-5 h-5 shrink-0" />
            <span>Seus dados cadastrais foram atualizados com sucesso!</span>
          </div>
        )}

        {/* Edit Form (Collapsible) */}
        {isEditing && (
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-orange-500/20 animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-bold text-white font-display mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-orange-400" />
              <span>Editar Informações de Contato & Kit</span>
            </h3>

            <form onSubmit={handleSaveEdit} className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Telefone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-gray-300">Endereço Residencial</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Tamanho da Camisa</label>
                <select
                  value={tshirtSize}
                  onChange={(e) => setTshirtSize(e.target.value as TshirtSize)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091124] border border-white/10 text-sm text-white focus:outline-none"
                >
                  {Object.values(TshirtSize).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Detalhes de Alergias (Vazio se nenhuma)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-gray-300">Uso Contínuo de Medicamentos (Vazio se nenhum)</label>
                <input
                  type="text"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-600 to-yellow-500 text-white hover:scale-105 transition-all cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Column 1: Voucher & QR Access */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col items-center justify-between text-center min-h-[380px]">
            <div className="w-full space-y-4">
              <h3 className="text-lg font-bold text-white font-display border-b border-white/10 pb-2 flex items-center justify-center gap-1.5">
                <QrCode className="w-5 h-5 text-orange-400" />
                <span>Credencial de Entrada</span>
              </h3>
              
              <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex items-center justify-center shadow-lg relative overflow-hidden">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="QR Code de Entrada"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              
              <p className="text-xs text-orange-400 font-bold font-mono tracking-wider uppercase mt-1">
                CÓDIGO: {regData.registrationCode}
              </p>
            </div>

            <p className="text-[11px] text-gray-400 font-sans leading-normal max-w-[200px] mt-4">
              Apresente este QR Code no dia do embarque para registrar sua entrada no ônibus.
            </p>
          </div>

          {/* Column 2: Status & Payment details */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between min-h-[380px] space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display border-b border-white/10 pb-2 flex items-center gap-1.5">
                <CreditCard className="w-5 h-5 text-orange-400" />
                <span>Status da Inscrição</span>
              </h3>

              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Situação:</span>
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
                    regData.status === RegistrationStatus.CONFIRMED
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : regData.status === RegistrationStatus.PENDING
                      ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                    {regData.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Forma Escolhida:</span>
                  <span className="text-sm font-semibold text-white">{regData.paymentMethod}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Valor Pago:</span>
                  <span className="text-sm font-bold text-emerald-400">R$ {regData.amountPaid || 0},00</span>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-xs text-gray-400">Custo Total:</span>
                  <span className="text-sm font-semibold text-white">R$ 280,00</span>
                </div>
              </div>
            </div>

            {/* Dynamic payment actions / guidance */}
            {regData.status === RegistrationStatus.PENDING ? (
              <div className="bg-orange-500/5 border border-orange-500/15 p-4 rounded-2xl text-xs space-y-2 text-left">
                <div className="flex items-center space-x-1 text-orange-400 font-bold">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Chave PIX de Pagamento</span>
                </div>
                <p className="text-gray-300 text-[11px] font-sans leading-normal">
                  Chave CNPJ da IEQ Inhoaíba para depósito:<br/>
                  <strong className="text-white select-all">12.345.678/0001-99</strong>
                </p>
                <p className="text-[10px] text-gray-400 font-sans">
                  Após realizar o PIX de R$ 280,00 (ou da primeira parcela), envie o comprovante para os líderes da Juventude Convictos para liberação da vaga.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-2xl text-xs space-y-1.5 text-left">
                <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Vaga Confirmada!</span>
                </div>
                <p className="text-gray-300 text-[11px] font-sans leading-normal">
                  Sua inscrição foi auditada e aprovada pela secretaria financeira. Sua hospedagem e camisa estão devidamente reservadas.
                </p>
              </div>
            )}
          </div>

          {/* Column 3: Quick kit details & documents download */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between min-h-[380px] space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display border-b border-white/10 pb-2 flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-orange-400" />
                <span>Kit & Documentos</span>
              </h3>

              <div className="space-y-3.5">
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Tamanho de Camisa Selecionado:</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Camisa Convictos 2027</span>
                    <span className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center font-black text-xs">{regData.tshirtSize}</span>
                  </div>
                </div>

                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Igreja / Líder Declarado:</span>
                  <p className="text-xs text-gray-200 font-medium truncate">{regData.church} / {regData.leader}</p>
                </div>
              </div>
            </div>

            {/* Download section for authorization */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Documento Obrigatório (Menores):</span>
              <button
                onClick={printAuthorization}
                className="w-full py-3.5 rounded-xl font-bold border border-white/20 hover:border-white/40 text-xs text-white hover:bg-white/5 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Baixar Autorização (PDF)</span>
              </button>
              <p className="text-[10px] text-gray-400 text-center leading-normal">
                Imprima, peça para seu responsável legal assinar e entregue aos líderes no embarque.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
