import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQs } from '../data';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#050b18] relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3.5 py-1.5 rounded-full">
            Dúvidas Frequentes
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">Frequentes</span>
          </h2>
          <p className="text-gray-400 text-base">
            Tem alguma dúvida sobre o retiro? Confira as perguntas comuns abaixo ou nos chame no WhatsApp!
          </p>
        </div>

        {/* Collapsible Accordion Grid */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {FAQs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-[#0a1226] border-orange-500/30 shadow-lg'
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                {/* Header Title trigger */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between text-white font-bold font-display text-md md:text-lg focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center space-x-3 pr-4">
                    <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? 'text-orange-400' : 'text-gray-400'}`} />
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-orange-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-gray-300 leading-relaxed font-sans border-t border-white/5 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
