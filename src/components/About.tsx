import React from 'react';
import { Sparkles, Calendar, Target, Award } from 'lucide-react';

export default function About() {
  const points = [
    {
      icon: <Calendar className="w-6 h-6 text-orange-500" />,
      title: "4 Dias Intensos",
      desc: "Do dia 05 ao dia 09 de fevereiro, desconecte-se do barulho e conecte-se com o céu."
    },
    {
      icon: <Target className="w-6 h-6 text-yellow-500" />,
      title: "Encontro Real",
      desc: "Momentos de adoração sincera e palavra inspiradora para alinhar seu coração com o de Deus."
    },
    {
      icon: <Award className="w-6 h-6 text-orange-400" />,
      title: "Atividades Incríveis",
      desc: "Jogos cooperativos, competições entre tribos, piscinas e muito lazer à sua disposição."
    }
  ];

  return (
    <section id="about" className="py-24 bg-[#081021] relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-orange-600/5 rounded-full filter blur-[120px] -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full filter blur-[120px] translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-mono font-bold tracking-wider text-orange-300">PROPÓSITO</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
              Muito mais que <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">um retiro</span>.
            </h2>

            <p className="text-base md:text-lg text-gray-300 leading-relaxed font-sans">
              Prepare-se para viver dias inesquecíveis de comunhão, adoração, diversão, ministrações, esportes, desafios, amizades e experiências profundas com Deus.
            </p>
            
            <p className="text-base md:text-lg text-gray-300 leading-relaxed font-sans">
              No <strong className="text-white font-semibold">Summer Camp 2027</strong>, você descobrirá que Deus ainda transforma vidas de forma extraordinária. Nós não queremos apenas te proporcionar um carnaval diferente; nós estamos gerando um ambiente de aliança e intimidade espiritual que vai marcar toda a sua juventude.
            </p>

            {/* Grid of point cards */}
            <div className="grid sm:grid-cols-3 gap-6 pt-6">
              {points.map((p, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="mb-3.5 p-2 w-fit rounded-xl bg-white/5">
                    {p.icon}
                  </div>
                  <h3 className="text-md font-bold text-white mb-1.5 font-display">{p.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Grid Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop"
                alt="Jovens em momento de ministração profunda"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081021] via-transparent to-transparent opacity-80" />
              
              {/* Floating Overlays */}
              <div className="absolute bottom-6 left-6 right-6 glass p-5 rounded-2xl border border-white/10 shadow-lg">
                <span className="text-[10px] font-mono tracking-widest text-orange-400 uppercase font-bold">FRUTO DO RETIRO</span>
                <h4 className="text-lg font-bold text-white mt-0.5 font-display">Encontros reais com Jesus</h4>
                <p className="text-xs text-gray-300 mt-1 font-sans">
                  "Eu fui para me divertir e voltei com a minha vida completamente restaurada e cheia do Espírito Santo."
                </p>
                <div className="mt-3 flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-[10px] text-white font-bold">JC</div>
                  <span className="text-[10px] text-gray-400 font-mono">Testemunho Convictos 2026</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
