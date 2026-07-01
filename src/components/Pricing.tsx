import React from 'react';
import { Check, ShieldCheck, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

interface PricingProps {
  onNavigate: (sectionId: string) => void;
}

export default function Pricing({ onNavigate }: PricingProps) {
  const includes = [
    'Hospedagem completa (4 dias em sítio fechado)',
    'Alimentação completa (café, almoço, lanche, jantar)',
    'Camisa oficial do Summer Camp 2027',
    'Material de apoio (pulseiras, blocos, gincana)',
    'Transporte de ida e volta (saindo da IEQ Inhoaíba)'
  ];

  return (
    <section id="pricing" className="py-24 bg-[#081021] relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full filter blur-[150px] -translate-x-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3.5 py-1.5 rounded-full">
            Investimento
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            Tudo incluso por um <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">valor único</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Sem taxas escondidas. Facilitamos o pagamento para que nenhum jovem fique de fora!
          </p>
        </div>

        {/* Pricing Layout Container */}
        <div className="grid md:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
          
          {/* Main Card (Premium Glass Design) */}
          <div className="md:col-span-7 glass-card rounded-3xl p-6 md:p-8 border border-orange-500/30 relative overflow-hidden shadow-2xl">
            {/* Corner Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-yellow-500 text-white font-bold text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>VAGAS LIMITADAS</span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white font-display">Inscrição Individual</h3>
              <p className="text-xs text-gray-400 mt-1 font-sans">Acomodação, refeições, kit e ônibus fretado</p>
            </div>

            {/* Price section */}
            <div className="flex items-baseline mb-6">
              <span className="text-xl font-bold text-orange-400 mr-2">R$</span>
              <span className="text-6xl font-black font-display text-white tracking-tight">280</span>
              <span className="text-lg font-bold text-gray-400 ml-1">,00</span>
              <span className="text-xs text-gray-400 ml-3 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">Valor total</span>
            </div>

            {/* Included list */}
            <div className="space-y-3.5 mb-8 border-t border-white/10 pt-6">
              {includes.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-sm">
                  <div className="mt-0.5 p-0.5 rounded-full bg-orange-500/15 text-orange-400">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-gray-300 font-sans leading-snug">{item}</span>
                </div>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={() => onNavigate('registration')}
              className="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center block"
            >
              Garantir Minha Vaga
            </button>
          </div>

          {/* Side Helper Panel */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Helper 1: Installments info */}
            <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-md font-display">Facilidade de Pagamento</h4>
              </div>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Parcele via <strong className="text-white">cartão de crédito em até 10x</strong> ou divida em <strong className="text-white">mensalidades via PIX ou carnê</strong> diretamente com os organizadores da Juventude Convictos.
              </p>
            </div>

            {/* Helper 2: Security info */}
            <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-md font-display">Inscrição 100% Segura</h4>
              </div>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Seus dados pessoais estão protegidos de acordo com as diretrizes da LGPD. Você receberá um código e comprovante exclusivo para acessar o sítio.
              </p>
            </div>

            {/* Alert info box */}
            <div className="flex items-start space-x-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
              <p className="text-xs text-yellow-300 leading-relaxed font-sans">
                <strong>Atenção menores de 18 anos:</strong> Será obrigatório entregar a autorização preenchida e assinada por seus responsáveis no dia do embarque. Baixe o documento na área do participante após se inscrever.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
