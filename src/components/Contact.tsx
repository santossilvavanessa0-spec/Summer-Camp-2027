import React from 'react';
import { MessageSquare, Instagram, MapPin, Compass, Send, Calendar, Users, Landmark, Heart } from 'lucide-react';

interface ContactProps {
  onNavigate: (sectionId: string) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
  const currentYear = new Date().getFullYear();

  // WhatsApp click action
  const handleContactWhatsApp = () => {
    const waMessage = 'Olá! Gostaria de tirar algumas dúvidas sobre o Summer Camp 2027!';
    window.open(`https://api.whatsapp.com/send?phone=5521987654321&text=${encodeURIComponent(waMessage)}`, '_blank');
  };

  // Google Maps coordinate directions link
  const openDirections = () => {
    const query = 'Igreja do Evangelho Quadrangular, Inhoaíba, Rio de Janeiro';
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <section id="contact" className="bg-[#040813] pt-24 pb-8 relative overflow-hidden border-t border-white/5">
      {/* Background radial lights */}
      <div className="absolute bottom-0 left-1/2 w-[600px] h-[300px] bg-orange-600/5 rounded-full filter blur-[150px] -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Main Grid: Info + Map */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3.5 py-1.5 rounded-full">
                Contato & Canais
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
                Fale com a nossa <span className="text-gradient-orange-yellow font-black">Liderança</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Quer patrocinar um jovem, tirar dúvidas sobre acomodações especiais ou opções de parcelamento? Estamos prontos para te ajudar!
              </p>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-4">
              
              {/* WhatsApp Card */}
              <div
                onClick={handleContactWhatsApp}
                className="glass hover:bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all duration-300 cursor-pointer flex items-start space-x-4 group"
              >
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <MessageSquare className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-white font-display text-base">Falar no WhatsApp</h4>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">Suporte para inscrições, pagamentos e dúvidas gerais.</p>
                  <span className="text-xs text-orange-400 font-bold font-mono mt-1.5 block group-hover:underline flex items-center space-x-1">
                    <span>(21) 98765-4321</span>
                  </span>
                </div>
              </div>

              {/* Instagram Card */}
              <div
                onClick={() => window.open('https://instagram.com', '_blank')}
                className="glass hover:bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all duration-300 cursor-pointer flex items-start space-x-4 group"
              >
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white font-display text-base">Siga no Instagram</h4>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">Acompanhe as novidades diárias, chamadas e sorteios.</p>
                  <span className="text-xs text-orange-400 font-bold font-mono mt-1.5 block group-hover:underline">
                    @juventudeconvictos
                  </span>
                </div>
              </div>

              {/* Location Card */}
              <div
                onClick={openDirections}
                className="glass hover:bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all duration-300 cursor-pointer flex items-start space-x-4 group"
              >
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white font-display text-base">Ponto de Encontro</h4>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">Igreja do Evangelho Quadrangular de Inhoaíba.</p>
                  <span className="text-xs text-orange-400 font-bold font-sans mt-1.5 block group-hover:underline">
                    Como Chegar (Direções Google Maps)
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Column 2: Simulated Interactive Map / Real Iframe Map (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-3xl p-4 border border-white/10 shadow-2xl relative overflow-hidden group">
              <span className="absolute top-6 left-6 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] font-mono font-bold tracking-wider text-orange-400 uppercase flex items-center space-x-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
                <span>IEQ Inhoaíba (Embarque)</span>
              </span>

              {/* Google Map iframe */}
              <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden relative border border-white/5">
                <iframe
                  title="Localização IEQ Inhoaiba"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.8368595460593!2d-43.59376662464731!3d-22.921257479241857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9be3f2dbcfda49%3A0xc37549cb05a30e84!2sInhoa%C3%ADba%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1719830000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter grayscale-[50%] invert-[90%] contrast-[110%] opacity-85 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            
            <p className="text-center text-[11px] text-gray-500 font-sans">
              * Nosso embarque oficial de ônibus será em frente à IEQ Inhoaíba no dia 05/02/2027 às 13:00.
            </p>
          </div>

        </div>

        {/* Brand / Footer menu */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-yellow-500 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-md font-bold font-display tracking-wider text-white">SUMMER CAMP 2027</span>
              <span className="text-[9px] font-mono tracking-widest text-orange-400 font-semibold uppercase">IEQ INHOAÍBA</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-gray-400">
            <button onClick={() => onNavigate('hero')} className="hover:text-orange-400 transition-colors cursor-pointer">Início</button>
            <button onClick={() => onNavigate('about')} className="hover:text-orange-400 transition-colors cursor-pointer">Sobre</button>
            <button onClick={() => onNavigate('gallery')} className="hover:text-orange-400 transition-colors cursor-pointer">Galeria</button>
            <button onClick={() => onNavigate('schedule')} className="hover:text-orange-400 transition-colors cursor-pointer">Programação</button>
            <button onClick={() => onNavigate('pricing')} className="hover:text-orange-400 transition-colors cursor-pointer">Valores</button>
          </div>
        </div>

        {/* Copywrite rights */}
        <div className="text-center pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-600 gap-4">
          <p>© {currentYear} Juventude Convictos - IEQ Inhoaíba. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Desenvolvido com carinho para o Reino de Deus</span>
            <Heart className="w-3 h-3 text-red-600 animate-pulse fill-red-600" />
          </p>
        </div>

      </div>
    </section>
  );
}
