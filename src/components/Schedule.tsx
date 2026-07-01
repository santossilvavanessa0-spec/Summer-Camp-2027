import React, { useState } from 'react';
import { CalendarRange, MapPin, Compass, Clock, Sparkles } from 'lucide-react';
import { TIMELINE } from '../data';

export default function Schedule() {
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  return (
    <section id="schedule" className="py-24 bg-[#050b18] relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-orange-600/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3.5 py-1.5 rounded-full">
            Programação Oficial
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            Cronograma do <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">Summer Camp</span>
          </h2>
          <p className="text-gray-400 text-base">
            Preparamos cada momento com muito zelo espiritual, gincanas radicais e lazer. Prepare seu coração!
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex justify-center p-1.5 rounded-2xl bg-white/5 border border-white/10 max-w-lg mx-auto mb-12">
          {TIMELINE.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDayIdx(idx)}
              className={`flex-1 py-3 text-center rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeDayIdx === idx
                  ? 'bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-md shadow-orange-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.day}
            </button>
          ))}
        </div>

        {/* Interactive Timeline Body */}
        <div className="glass-card rounded-3xl p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <CalendarRange className="w-40 h-40 text-orange-500" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Compass className="w-6 h-6 text-orange-400 animate-spin-slow" />
              </div>
              <div>
                <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider">{TIMELINE[activeDayIdx].day} • Retiro de Carnaval</span>
                <h3 className="text-2xl font-black font-display text-white mt-0.5">{TIMELINE[activeDayIdx].title}</h3>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl w-fit">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Atividades de manhã à noite</span>
            </div>
          </div>

          {/* Events List */}
          <div className="relative border-l-2 border-white/10 ml-4 md:ml-6 pl-6 md:pl-10 space-y-8 py-2">
            {TIMELINE[activeDayIdx].events.map((evt, idx) => (
              <div key={idx} className="relative group">
                {/* Checkpoint Dot */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-orange-500 group-hover:bg-orange-500 group-hover:scale-125 shadow-lg shadow-orange-500/30 transition-all duration-300" />
                
                {/* Event Card */}
                <div className="glass-light rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-orange-400 font-bold tracking-wider">
                      Atividade {idx + 1}
                    </span>
                    <Sparkles className="w-4 h-4 text-yellow-500/50 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <p className="text-base md:text-lg text-white font-medium font-sans">
                    {evt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500 italic">
              * O cronograma detalhado de horários exatos será distribuído no guia de boas-vindas na chegada ao sítio.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
