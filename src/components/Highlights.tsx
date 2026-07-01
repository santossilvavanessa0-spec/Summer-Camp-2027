import React from 'react';
import { Flame, Music, Activity, Trophy, Trees, Utensils, Users, Heart } from 'lucide-react';
import { HIGHLIGHTS } from '../data';

// Icon map helper
const iconMap = {
  Flame: <Flame className="w-8 h-8 text-orange-500" />,
  Music: <Music className="w-8 h-8 text-yellow-500" />,
  Activity: <Activity className="w-8 h-8 text-orange-400" />,
  Trophy: <Trophy className="w-8 h-8 text-yellow-400" />,
  Trees: <Trees className="w-8 h-8 text-emerald-500" />,
  Utensils: <Utensils className="w-8 h-8 text-amber-500" />,
  Users: <Users className="w-8 h-8 text-sky-500" />,
  Heart: <Heart className="w-8 h-8 text-red-500" />
};

export default function Highlights() {
  return (
    <section id="highlights" className="py-24 bg-[#050b18] relative overflow-hidden">
      {/* Decorative backdrop light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3.5 py-1.5 rounded-full">
            Destaques do Retiro
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            Tudo preparado nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">mínimos detalhes</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Sua única preocupação será abrir o coração para viver o extraordinário de Deus nesses 4 dias.
          </p>
        </div>

        {/* Grid of Highlight Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHTS.map((item) => {
            const icon = iconMap[item.iconName] || <Flame className="w-8 h-8 text-orange-500" />;
            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 border border-white/5 hover:border-orange-500/20 hover:bg-[#0c1428] hover:-translate-y-2 transition-all duration-300 shadow-xl group relative overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-orange-500/10 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Icon Container */}
                <div className="mb-5 p-3 w-fit rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  {icon}
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-bold text-white mb-2 font-display group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dynamic callout banner */}
        <div className="mt-16 bg-gradient-to-r from-orange-600/10 via-yellow-500/5 to-transparent border border-orange-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-bold text-white font-display">Pronto para viver essa aventura?</h4>
            <p className="text-sm text-gray-300 font-sans">
              As tribos já estão sendo divididas e as camisas encomendadas. Não fique de fora!
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('registration');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-yellow-500 hover:scale-[1.03] transition-all cursor-pointer whitespace-nowrap"
          >
            Garantir Minha Inscrição
          </button>
        </div>

      </div>
    </section>
  );
}
