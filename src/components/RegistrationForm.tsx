import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle, HeartHandshake } from 'lucide-react';
import { addRegistration, login, LoggedInUser } from '../utils/db';
import { TshirtSize, PaymentMethod } from '../types';

interface RegistrationFormProps {
  onSuccess: (user: LoggedInUser) => void;
  onNavigate: (sectionId: string) => void;
}

export default function RegistrationForm({ onSuccess, onNavigate }: RegistrationFormProps) {
  // Form values
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [church, setChurch] = useState('');
  const [leader, setLeader] = useState('');
  const [hasAllergies, setHasAllergies] = useState(false);
  const [allergiesDetails, setAllergiesDetails] = useState('');
  const [hasMedications, setHasMedications] = useState(false);
  const [medicationsDetails, setMedicationsDetails] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [tshirtSize, setTshirtSize] = useState<TshirtSize>(TshirtSize.M);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [installments, setInstallments] = useState(1);
  const [agreeRules, setAgreeRules] = useState(false);

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ name: string; code: string; email: string } | null>(null);

  // Input masks
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    setCpf(value.substring(0, 14));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'phone' | 'whatsapp') => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    if (type === 'phone') {
      setPhone(value.substring(0, 15));
    } else {
      setWhatsapp(value.substring(0, 15));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'O nome completo é obrigatório.';
    if (!cpf.trim()) newErrors.cpf = 'O CPF é obrigatório.';
    if (cpf.length < 14) newErrors.cpf = 'Digite um CPF válido.';
    if (!phone.trim()) newErrors.phone = 'O telefone é obrigatório.';
    if (!whatsapp.trim()) newErrors.whatsapp = 'O WhatsApp é obrigatório.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Digite um e-mail válido.';
    if (!church.trim()) newErrors.church = 'Informe a igreja que você frequenta.';
    if (!leader.trim()) newErrors.leader = 'Informe o nome de seu líder/pastor.';
    if (!emergencyContact.trim()) newErrors.emergencyContact = 'O contato de emergência é obrigatório.';
    if (!agreeRules) newErrors.agreeRules = 'Você deve aceitar as regras do retiro para se inscrever.';
    
    if (hasAllergies && !allergiesDetails.trim()) newErrors.allergiesDetails = 'Por favor, detalhe suas alergias.';
    if (hasMedications && !medicationsDetails.trim()) newErrors.medicationsDetails = 'Por favor, detalhe os medicamentos.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorEl = document.getElementById('registration-title');
      if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      const regObj = {
        fullName,
        birthDate,
        cpf,
        rg,
        phone,
        whatsapp,
        email,
        address,
        church,
        leader,
        hasAllergies,
        allergiesDetails: hasAllergies ? allergiesDetails : '',
        hasMedications,
        medicationsDetails: hasMedications ? medicationsDetails : '',
        emergencyContact,
        tshirtSize,
        paymentMethod,
        installmentsCount: undefined
      };

      try {
        const createdReg = addRegistration(regObj);
        
        // Log in user automatically
        const loggedUser = login(createdReg.email, createdReg.registrationCode);
        
        setSuccessData({
          name: createdReg.fullName,
          code: createdReg.registrationCode,
          email: createdReg.email
        });

        setIsSubmitting(false);

        if (loggedUser) {
          // Fire onSuccess immediately after visual check or button click
          onSuccess(loggedUser);
        }
      } catch (err) {
        setIsSubmitting(false);
        alert('Erro ao salvar inscrição. Verifique os dados e tente novamente.');
      }
    }, 1200);
  };

  if (successData) {
    return (
      <section id="registration" className="py-24 bg-[#050b18] relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full filter blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-lg w-full mx-auto px-4 text-center">
          <div className="glass-card rounded-3xl p-8 md:p-10 border border-orange-500/30 shadow-2xl space-y-6">
            
            {/* Success Visual */}
            <div className="flex flex-col items-center">
              <span className="text-6xl md:text-7xl mb-4 animate-bounce">🎉</span>
              <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-3xl font-black font-display text-white">Parabéns!</h2>
              <p className="text-orange-400 font-bold font-mono text-sm tracking-wider uppercase mt-1">Inscrição Efetuada com Sucesso</p>
            </div>

            <div className="text-gray-300 font-sans space-y-3.5 border-y border-white/10 py-6 text-sm">
              <p className="text-base font-semibold text-white">Olá, {successData.name}!</p>
              <p>Sua pré-inscrição para o <strong className="text-white">Summer Camp 2027</strong> foi processada.</p>
              
              {/* Payment Box */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-3 space-y-2 text-left">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Código de Acesso:</span>
                  <strong className="text-white font-bold">{successData.code}</strong>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Forma de Pagamento:</span>
                  <strong className="text-orange-400">{paymentMethod}</strong>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Status:</span>
                  <strong className="text-yellow-400">Aguardando Confirmação</strong>
                </div>
              </div>

              <p className="text-xs text-gray-400 italic">
                Enviamos as instruções e código PIX para o e-mail: <strong>{successData.email}</strong>.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('participant')}
                className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Ir para Minha Área</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => {
                  setSuccessData(null);
                  setFullName('');
                  setBirthDate('');
                  setCpf('');
                  setRg('');
                  setPhone('');
                  setWhatsapp('');
                  setEmail('');
                  setAddress('');
                  setChurch('');
                  setLeader('');
                  setHasAllergies(false);
                  setAllergiesDetails('');
                  setHasMedications(false);
                  setMedicationsDetails('');
                  setEmergencyContact('');
                  setTshirtSize(TshirtSize.M);
                  setAgreeRules(false);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Realizar Nova Inscrição
              </button>
            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="registration" className="py-24 bg-[#050b18] relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3.5 py-1.5 rounded-full">
            Inscrição On-line
          </span>
          <h2 id="registration-title" className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            Garante a sua vaga no <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">Summer Camp 2027</span>
          </h2>
          <p className="text-gray-400 text-base">
            Preencha todos os dados com atenção para garantir sua inscrição com sucesso.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="glass-card rounded-3xl p-6 md:p-10 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Dados Pessoais */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold font-mono">1</span>
                <h3 className="text-lg font-bold text-white font-display">Dados Pessoais do Participante</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Nome Completo */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-fullname" className="text-xs font-semibold text-gray-300">Nome Completo</label>
                  <input
                    id="reg-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.fullName ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.fullName && <p className="text-xs text-red-400 font-mono mt-1">● {errors.fullName}</p>}
                </div>

                {/* Data de Nascimento */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-birthdate" className="text-xs font-semibold text-gray-300">Data de Nascimento</label>
                  <input
                    id="reg-birthdate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#091124] border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.birthDate ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.birthDate && <p className="text-xs text-red-400 font-mono mt-1">● {errors.birthDate}</p>}
                </div>

                {/* CPF */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-cpf" className="text-xs font-semibold text-gray-300">CPF</label>
                  <input
                    id="reg-cpf"
                    type="text"
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.cpf ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.cpf && <p className="text-xs text-red-400 font-mono mt-1">● {errors.cpf}</p>}
                </div>

                {/* RG */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-rg" className="text-xs font-semibold text-gray-300">RG</label>
                  <input
                    id="reg-rg"
                    type="text"
                    value={rg}
                    onChange={(e) => setRg(e.target.value.replace(/\D/g, ''))}
                    placeholder="00.000.000-0"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.rg ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.rg && <p className="text-xs text-red-400 font-mono mt-1">● {errors.rg}</p>}
                </div>

                {/* Telefone */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-phone" className="text-xs font-semibold text-gray-300">Telefone para Contato</label>
                  <input
                    id="reg-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e, 'phone')}
                    placeholder="(21) 90000-0000"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.phone ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.phone && <p className="text-xs text-red-400 font-mono mt-1">● {errors.phone}</p>}
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-whatsapp" className="text-xs font-semibold text-gray-300">WhatsApp Oficial</label>
                  <input
                    id="reg-whatsapp"
                    type="text"
                    value={whatsapp}
                    onChange={(e) => handlePhoneChange(e, 'whatsapp')}
                    placeholder="(21) 90000-0000"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.whatsapp ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.whatsapp && <p className="text-xs text-red-400 font-mono mt-1">● {errors.whatsapp}</p>}
                </div>

                {/* E-mail */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="reg-email" className="text-xs font-semibold text-gray-300">E-mail para Receber Comprovante</label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.email && <p className="text-xs text-red-400 font-mono mt-1">● {errors.email}</p>}
                </div>

                {/* Endereço */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="reg-address" className="text-xs font-semibold text-gray-300">Endereço Residencial Completo</label>
                  <input
                    id="reg-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, complemento - Bairro, Cidade"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.address ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.address && <p className="text-xs text-red-400 font-mono mt-1">● {errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Comunidade e Líderes */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold font-mono">2</span>
                <h3 className="text-lg font-bold text-white font-display">Igreja & Liderança</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Igreja */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-church" className="text-xs font-semibold text-gray-300">Qual igreja frequenta?</label>
                  <input
                    id="reg-church"
                    type="text"
                    value={church}
                    onChange={(e) => setChurch(e.target.value)}
                    placeholder="Ex: IEQ Inhoaíba ou Outra"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.church ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.church && <p className="text-xs text-red-400 font-mono mt-1">● {errors.church}</p>}
                </div>

                {/* Líder */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-leader" className="text-xs font-semibold text-gray-300">Quem é o seu Líder de Célula / Pastor?</label>
                  <input
                    id="reg-leader"
                    type="text"
                    value={leader}
                    onChange={(e) => setLeader(e.target.value)}
                    placeholder="Nome do seu líder ou pastor"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.leader ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.leader && <p className="text-xs text-red-400 font-mono mt-1">● {errors.leader}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Saúde e Cuidados */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold font-mono">3</span>
                <h3 className="text-lg font-bold text-white font-display">Saúde & Cuidados Médicos</h3>
              </div>

              <div className="space-y-5">
                {/* Alergias */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-white/5 px-4 py-3 rounded-2xl border border-white/10">
                    <input
                      id="reg-hasallergies"
                      type="checkbox"
                      checked={hasAllergies}
                      onChange={(e) => setHasAllergies(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-slate-900 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                    <label htmlFor="reg-hasallergies" className="text-sm font-semibold text-white cursor-pointer select-none">
                      Possui algum tipo de alergia? (Medicamento, alimento, insetos...)
                    </label>
                  </div>
                  
                  {hasAllergies && (
                    <div className="pl-6 animate-in slide-in-from-top-2 duration-200">
                      <textarea
                        value={allergiesDetails}
                        onChange={(e) => setAllergiesDetails(e.target.value)}
                        placeholder="Por favor, detalhe quais as suas alergias e quais cuidados tomar..."
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.allergiesDetails ? 'border-red-500' : 'border-white/10'}`}
                      />
                      {errors.allergiesDetails && <p className="text-xs text-red-400 font-mono mt-1">● {errors.allergiesDetails}</p>}
                    </div>
                  )}
                </div>

                {/* Medicamentos */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-white/5 px-4 py-3 rounded-2xl border border-white/10">
                    <input
                      id="reg-hasmedications"
                      type="checkbox"
                      checked={hasMedications}
                      onChange={(e) => setHasMedications(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-slate-900 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                    <label htmlFor="reg-hasmedications" className="text-sm font-semibold text-white cursor-pointer select-none">
                      Faz uso contínuo de algum medicamento?
                    </label>
                  </div>
                  
                  {hasMedications && (
                    <div className="pl-6 animate-in slide-in-from-top-2 duration-200">
                      <textarea
                        value={medicationsDetails}
                        onChange={(e) => setMedicationsDetails(e.target.value)}
                        placeholder="Por favor, liste os medicamentos de uso contínuo e horários de ingestão..."
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.medicationsDetails ? 'border-red-500' : 'border-white/10'}`}
                      />
                      {errors.medicationsDetails && <p className="text-xs text-red-400 font-mono mt-1">● {errors.medicationsDetails}</p>}
                    </div>
                  )}
                </div>

                {/* Contato de Emergência */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-emergency" className="text-xs font-semibold text-gray-300">Contato de Emergência (Nome, parentesco e telefone)</label>
                  <input
                    id="reg-emergency"
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Ex: Mãe: Maria (21) 98888-8888"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.emergencyContact ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.emergencyContact && <p className="text-xs text-red-400 font-mono mt-1">● {errors.emergencyContact}</p>}
                </div>
              </div>
            </div>

            {/* Section 4: Kit e Pagamento */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold font-mono">4</span>
                <h3 className="text-lg font-bold text-white font-display">Opções de Kit & Pagamento</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Tamanho Camisa */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-tshirtsize" className="text-xs font-semibold text-gray-300">Tamanho da Camisa Oficial</label>
                  <select
                    id="reg-tshirtsize"
                    value={tshirtSize}
                    onChange={(e) => setTshirtSize(e.target.value as TshirtSize)}
                    className="w-full px-4 py-3 rounded-xl bg-[#091124] border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    {Object.values(TshirtSize).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Forma de Pagamento */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-payment" className="text-xs font-semibold text-gray-300">Forma de Pagamento</label>
                  <select
                    id="reg-payment"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-4 py-3 rounded-xl bg-[#091124] border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    {Object.values(PaymentMethod).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Termos e Envio */}
            <div className="border-t border-white/10 pt-8 space-y-6">
              
              {/* Checkbox regras */}
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <input
                    id="reg-agree"
                    type="checkbox"
                    checked={agreeRules}
                    onChange={(e) => setAgreeRules(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-slate-900 text-orange-500 focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="reg-agree" className="text-xs font-medium text-gray-300 cursor-pointer select-none leading-relaxed">
                    Estou ciente e aceito todas as regras do <strong className="text-white">Summer Camp 2027</strong>. Comprometo-me a obedecer aos horários e diretrizes da equipe de liderança, manter postura respeitosa e participar ativamente das ministrações e programações gerais.
                  </label>
                </div>
                {errors.agreeRules && <p className="text-xs text-red-400 font-mono mt-1">● {errors.agreeRules}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/5 rounded-3xl p-6">
                <div className="flex items-start space-x-3 text-left">
                  <ShieldCheck className="w-8 h-8 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Ambiente de Inscrição Seguro</h4>
                    <p className="text-[11px] text-gray-400 font-sans leading-normal">
                      Sua vaga ficará pré-reservada por 72h até a confirmação do pagamento.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-lg shadow-orange-500/20 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>Finalizar Inscrição</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
