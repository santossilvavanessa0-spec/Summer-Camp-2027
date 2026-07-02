import React, { useState, useEffect } from 'react';
import { Search, Filter, Shield, DollarSign, Users, Clock, FileDown, MessageSquare, Mail, PlusCircle, Trash2, Check, RefreshCw, Send, X, ExternalLink, Sparkles, Image as ImageIcon, Film, Plus } from 'lucide-react';
import { getRegistrations, updateRegistrationStatus, deleteRegistration, getStats, getAnnouncements, addAnnouncement, getGalleryImages, addGalleryImage, deleteGalleryImage, getPromoVideo, savePromoVideo } from '../utils/db';
import { Registration, RegistrationStatus, PaymentMethod } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
  onRefreshStats: () => void;
}

export default function AdminPanel({ onLogout, onRefreshStats }: AdminPanelProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState(getStats());
  const [announcements, setAnnouncements] = useState(getAnnouncements());
  
  // Table filters & search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pendente' | 'Confirmado' | 'Cancelado'>('All');
  
  // Custom Announcement modal state
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState<'WhatsApp' | 'E-mail' | 'Todos'>('Todos');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Media Management states
  const [galleryImgs, setGalleryImgs] = useState<any[]>([]);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newImgTitle, setNewImgTitle] = useState('');
  const [newImgCategory, setNewImgCategory] = useState('Gincanas');
  const [videoSaveSuccess, setVideoSaveSuccess] = useState(false);
  const [imgSaveSuccess, setImgSaveSuccess] = useState(false);

  // Load database values
  useEffect(() => {
    setRegistrations(getRegistrations());
    setStats(getStats());
    setAnnouncements(getAnnouncements());
    setGalleryImgs(getGalleryImages());
    setVideoUrlInput(getPromoVideo());
  }, []);

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrlInput.trim()) return;
    savePromoVideo(videoUrlInput.trim());
    setVideoSaveSuccess(true);
    setTimeout(() => setVideoSaveSuccess(false), 2000);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImgUrl.trim() || !newImgTitle.trim()) return;
    const updated = addGalleryImage(newImgUrl.trim(), newImgTitle.trim(), newImgCategory);
    setGalleryImgs(updated);
    setNewImgUrl('');
    setNewImgTitle('');
    setImgSaveSuccess(true);
    setTimeout(() => setImgSaveSuccess(false), 2000);
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta foto da galeria?')) {
      const updated = deleteGalleryImage(id);
      setGalleryImgs(updated);
    }
  };

  const handleUpdateStatus = (id: string, status: RegistrationStatus, amountPaid?: number) => {
    const updated = updateRegistrationStatus(id, status, amountPaid);
    setRegistrations(updated);
    setStats(getStats());
    onRefreshStats(); // Trigger app-wide stats refresh
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta inscrição permanentemente?')) {
      const updated = deleteRegistration(id);
      setRegistrations(updated);
      setStats(getStats());
      onRefreshStats();
    }
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement(annTitle, annContent, annType);
    setAnnouncements(getAnnouncements());
    
    setAnnTitle('');
    setAnnContent('');
    setAnnSuccess(true);
    setTimeout(() => {
      setAnnSuccess(false);
      setShowAnnounceModal(false);
    }, 1500);
  };

  // Filter registrations
  const filteredRegs = registrations.filter((r) => {
    const matchesSearch = 
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.registrationCode.toLowerCase().includes(search.toLowerCase()) ||
      r.cpf.includes(search);
    
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRegistered = filteredRegs.length;

  // Real WhatsApp integration: open prefilled API text message to a specific contact
  const triggerWhatsApp = (phone: string, name: string, code: string) => {
    const message = `Olá, ${name}! Sou da equipe da Juventude Convictos. Confirmamos o recebimento dos seus dados para o Summer Camp 2027 (Inscrição: ${code}). Por favor, envie o comprovante de pagamento para liberação total de sua vaga.`;
    const formattedPhone = phone.replace(/\D/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=55${formattedPhone}&text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // Interactive CSV/Table mock print export
  const exportToExcelView = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rows = registrations.map((r, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${r.fullName}</td>
        <td>${r.registrationCode}</td>
        <td>${r.email}</td>
        <td>${r.phone}</td>
        <td>${r.tshirtSize}</td>
        <td>${r.paymentMethod}</td>
        <td>R$ ${r.amountPaid},00</td>
        <td><strong>${r.status}</strong></td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Exportar Participantes Summer Camp 2027</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          h1 { color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 12px 15px; text-align: left; font-size: 13px; }
          th { background-color: #ea580c; color: white; text-transform: uppercase; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .summary { margin-top: 25px; padding: 15px; background: #f1f5f9; border-radius: 8px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Lista Oficial de Participantes - Summer Camp 2027</h1>
        <p>Juventude Convictos • IEQ Inhoaíba | Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</p>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome Completo</th>
              <th>Código</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Camisa</th>
              <th>Forma Pagamento</th>
              <th>Valor Pago</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="summary">
          Total de Inscritos na lista: ${registrations.length} participantes • Confirmações: ${registrations.filter(r => r.status === RegistrationStatus.CONFIRMED).length} • Pendentes: ${registrations.filter(r => r.status === RegistrationStatus.PENDING).length}
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

  return (
    <section id="admin" className="py-24 bg-[#050b18] relative overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Header administrative */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/5 border border-white/5 p-6 rounded-3xl gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0e172e] border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-500/5">
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider">LIDERANÇA & SECRETARIA</span>
              <h2 className="text-2xl font-black font-display text-white">Painel Administrativo</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAnnounceModal(true)}
              className="px-4.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white transition-all cursor-pointer flex items-center space-x-1.5 shadow-md shadow-orange-600/10"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Comunicado</span>
            </button>
            <button
              onClick={exportToExcelView}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white hover:bg-white/5 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <FileDown className="w-4 h-4 text-orange-400" />
              <span>Exportar Excel/PDF</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Bento Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Inscritos Totais', value: stats.filledSpots, icon: <Users className="w-6 h-6 text-orange-400" />, sub: 'Vagas de 80' },
            { label: 'Arrecadação Caixa', value: `R$ ${stats.totalRevenue},00`, icon: <DollarSign className="w-6 h-6 text-emerald-400" />, sub: 'Valores confirmados' },
            { label: 'Pagamentos Pendentes', value: `R$ ${stats.pendingAmount},00`, icon: <Clock className="w-6 h-6 text-yellow-400" />, sub: 'Aguardando validação' },
            { label: 'Vagas Livres', value: 80 - stats.filledSpots, icon: <Sparkles className="w-6 h-6 text-sky-400" />, sub: 'Último lote' }
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden shadow-md">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">{item.label}</span>
                  <p className="text-xl md:text-2xl font-black text-white">{item.value}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  {item.icon}
                </div>
              </div>
              <p className="text-[10px] text-gray-500 font-mono mt-3">● {item.sub}</p>
            </div>
          ))}
        </div>

        {/* Table + Actions Controls */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
            <h3 className="text-lg font-bold text-white font-display">Inscrições Recebidas</h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar participante, código, CPF..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Status Selector */}
              <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
                {['All', 'Confirmado', 'Pendente'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setStatusFilter(item as any)}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      statusFilter === item
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item === 'All' ? 'Todos' : item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono tracking-wider text-gray-400 uppercase">
                  <th className="pb-3.5 pl-2">Participante</th>
                  <th className="pb-3.5">Código / CPF</th>
                  <th className="pb-3.5">Contato / Email</th>
                  <th className="pb-3.5 text-center">Camisa</th>
                  <th className="pb-3.5">Forma</th>
                  <th className="pb-3.5">Pago</th>
                  <th className="pb-3.5 text-center">Status</th>
                  <th className="pb-3.5 text-right pr-2">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {filteredRegs.length > 0 ? (
                  filteredRegs.map((reg) => (
                    <tr key={reg.id} className="hover:bg-white/5 transition-colors group">
                      {/* Name / Church */}
                      <td className="py-4 pl-2">
                        <div className="font-semibold text-white text-sm">{reg.fullName}</div>
                        <div className="text-[10px] text-gray-400 font-sans mt-0.5">{reg.church} • Líder: {reg.leader}</div>
                      </td>

                      {/* Code / CPF */}
                      <td className="py-4">
                        <div className="font-mono text-xs font-bold text-orange-400">{reg.registrationCode}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">{reg.cpf}</div>
                      </td>

                      {/* Phone / Email */}
                      <td className="py-4">
                        <div className="font-mono text-xs font-medium">{reg.whatsapp}</div>
                        <div className="text-[10px] text-gray-500 truncate max-w-[150px] mt-0.5">{reg.email}</div>
                      </td>

                      {/* T-Shirt Size */}
                      <td className="py-4 text-center">
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold font-mono">
                          {reg.tshirtSize}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 font-sans text-[11px]">
                        {reg.paymentMethod}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-4 font-mono font-bold text-emerald-400">
                        R$ {reg.amountPaid || 0},00
                      </td>

                      {/* Status */}
                      <td className="py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                          reg.status === RegistrationStatus.CONFIRMED
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : reg.status === RegistrationStatus.PENDING
                            ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                          {reg.status}
                        </span>
                      </td>

                      {/* Action operations */}
                      <td className="py-4 text-right pr-2">
                        <div className="flex items-center justify-end space-x-2">
                          
                          {/* Sync / Confirm payment button */}
                          {reg.status !== RegistrationStatus.CONFIRMED && (
                            <button
                              onClick={() => handleUpdateStatus(reg.id, RegistrationStatus.CONFIRMED, 280)}
                              title="Confirmar Pagamento Total"
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 cursor-pointer transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Pre-filled WhatsApp button */}
                          <button
                            onClick={() => triggerWhatsApp(reg.whatsapp, reg.fullName, reg.registrationCode)}
                            title="Cobrar ou Avisar via WhatsApp"
                            className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 cursor-pointer transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete register */}
                          <button
                            onClick={() => handleDelete(reg.id)}
                            title="Excluir Inscrição"
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-500 italic font-sans">
                      Nenhuma inscrição encontrada para o filtro selecionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Media Management Section */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-2xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Film className="w-5 h-5 text-orange-500" />
              <span>Gerenciamento de Mídias (Vídeo & Fotos)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Configure o vídeo de destaque e as fotos que aparecem na galeria pública do Summer Camp.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Video URL manager */}
            <form onSubmit={handleSaveVideo} className="space-y-4 bg-[#0a1226]/50 p-5 rounded-2xl border border-white/5">
              <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Film className="w-4 h-4 text-orange-400" />
                <span>Vídeo Promocional (YouTube / Kapwing)</span>
              </h4>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-300">URL do Link (YouTube ou Kapwing)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: https://www.kapwing.com/videos/6a456e967d73370f680d63c9"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
                <p className="text-[10px] text-gray-500">
                  Dica: Você pode colar links normais ou links de incorporação do <code className="text-orange-400 font-mono">YouTube</code> ou <code className="text-orange-400 font-mono">Kapwing</code>. Eles serão formatados automaticamente.
                </p>
              </div>

              {videoSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-xs text-emerald-400 flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Vídeo promocional atualizado com sucesso!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-all cursor-pointer flex items-center space-x-1.5 shadow-md shadow-orange-600/10"
              >
                <span>Salvar Vídeo</span>
              </button>
            </form>

            {/* Right: Add image form */}
            <form onSubmit={handleAddPhoto} className="space-y-4 bg-[#0a1226]/50 p-5 rounded-2xl border border-white/5">
              <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-400" />
                <span>Adicionar Nova Foto à Galeria</span>
              </h4>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-300">Título da Imagem</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Culto da Fogueira"
                    value={newImgTitle}
                    onChange={(e) => setNewImgTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-300">Categoria / Tag</label>
                  <select
                    value={newImgCategory}
                    onChange={(e) => setNewImgCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#091124] border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Gincanas">Gincanas</option>
                    <option value="Louvor">Louvor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-300">URL da Imagem</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: https://images.unsplash.com/photo-..."
                  value={newImgUrl}
                  onChange={(e) => setNewImgUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              {imgSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-xs text-emerald-400 flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Foto adicionada à galeria com sucesso!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-all cursor-pointer flex items-center space-x-1.5 shadow-md shadow-orange-600/10"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Foto</span>
              </button>
            </form>
          </div>

          {/* Gallery management list */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Fotos na Galeria ({galleryImgs.length})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 max-h-72 overflow-y-auto p-2 border border-white/5 rounded-2xl bg-white/5">
              {galleryImgs.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#091124] aspect-square">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
                    <span className="text-[8px] bg-orange-500/20 border border-orange-500/30 text-orange-400 px-1.5 py-0.5 rounded font-bold uppercase w-fit font-mono">
                      {img.category}
                    </span>
                    <div className="flex justify-between items-center gap-1.5">
                      <p className="text-[10px] text-white font-semibold truncate flex-1">{img.title}</p>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(img.id)}
                        className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors cursor-pointer shrink-0"
                        title="Remover Foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History of Announcements Log */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-2xl">
          <h3 className="text-lg font-bold text-white font-display border-b border-white/5 pb-4 mb-5">Histórico de Comunicados Recentes</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white/5 border border-white/5 p-4.5 rounded-2xl relative space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white font-display text-sm">{ann.title}</h4>
                    <span className="text-[9px] font-mono text-gray-400">{new Date(ann.sentAt).toLocaleDateString('pt-BR')} às {new Date(ann.sentAt).toLocaleTimeString('pt-BR')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-orange-500/15 border border-orange-500/25 text-orange-400 text-[8px] font-bold uppercase tracking-wider font-mono">
                    {ann.type}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{ann.content}</p>
                <div className="text-[10px] text-gray-500 font-mono pt-1">
                  ● Enviado para {ann.recipientCount} destinatários.
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Write announcement modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card rounded-3xl p-6 md:p-8 max-w-lg w-full border border-orange-500/30 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAnnounceModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-display">Escrever Novo Comunicado</h3>
              <p className="text-xs text-gray-400">Simule o disparo de mensagens para o WhatsApp ou e-mail de todos os participantes cadastrados.</p>
            </div>

            <form onSubmit={handleSendAnnouncement} className="space-y-4">
              {annSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-xs text-emerald-400 flex items-center space-x-2">
                  <Check className="w-5 h-5 shrink-0" />
                  <span>Seu comunicado foi disparado com sucesso no sistema!</span>
                </div>
              ) : null}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Título / Assunto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Confirmação de tamanhos de camisas"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Canal de Disparo</label>
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#091124] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="Todos">Todos (WA + E-mail)</option>
                    <option value="WhatsApp">Apenas WhatsApp</option>
                    <option value="E-mail">Apenas E-mail</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Alcance de Destinatários</label>
                  <div className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 flex items-center">
                    {registrations.length} participantes ativos
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Mensagem / Corpo do Comunicado</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Digite o conteúdo da mensagem..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-600 to-yellow-500 text-white hover:scale-105 transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Disparar Comunicado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
