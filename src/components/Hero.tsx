import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Flame, ChevronDown } from 'lucide-react';
import { getStats } from '../utils/db';
const heroCover = 'https://i.postimg.cc/CMRss802/capa.jpg';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  updateTrigger: number; // Used to re-render stats when a user registers
}

export default function Hero({ onNavigate, updateTrigger }: HeroProps) {
  const [stats, setStats] = useState(getStats());
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Load stats when triggered
  useEffect(() => {
    setStats(getStats());
  }, [updateTrigger]);

  // Summer Camp 2027 Carnival date (Feb 5, 2027)
  useEffect(() => {
    const targetDate = new Date('2027-02-05T14:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = (stats.filledSpots / stats.totalSpots) * 100;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050b18] pt-24 pb-16">
      {/* Imagem de Fundo Completa com Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroCover}
          alt="Jovens comemorando e adorando"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.25] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Gradients to blend background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-[#050b18]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050b18]/80 via-transparent to-[#050b18]/80" />
      </div>

      {/* Decorative colored lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full filter blur-[100px] z-0 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[100px] z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        {/* Organização Badge */}
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 px-4 py-1.5 rounded-full mb-6 animate-bounce">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
            Juventude Convictos • IEQ Inhoaíba
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-8xl font-black font-display tracking-tight text-white mb-4 uppercase leading-none">
          SUMMER <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300">CAMP 2027</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-gray-300 font-sans max-w-2xl mb-8 font-light leading-relaxed">
          Quatro dias que podem <strong className="text-white font-semibold">transformar sua história</strong>. O retiro de carnaval mais esperado do ano.
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl w-full mb-10">
          {[
            { label: 'Dias', value: timeLeft.days },
            { label: 'Horas', value: timeLeft.hours },
            { label: 'Minutos', value: timeLeft.minutes },
            { label: 'Segundos', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-3 md:p-5 flex flex-col items-center border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-yellow-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="text-3xl md:text-5xl font-black font-mono text-white tracking-tight">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-orange-400 mt-1 font-bold">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full max-w-md">
          <button
            onClick={() => onNavigate('registration')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Quero Participar
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg border border-white/20 text-white hover:bg-white/5 hover:border-white/40 active:scale-95 transition-all cursor-pointer"
          >
            Saiba Mais
          </button>
        </div>

        {/* Progress Bar & Quick Info Box */}
        <div className="glass-card rounded-3xl p-6 max-w-xl w-full border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-orange-500" />
              <span>Inscrições Confirmadas</span>
            </span>
            <span className="text-sm font-bold text-orange-400 font-mono">
              {stats.filledSpots} de {stats.totalSpots} vagas
            </span>
          </div>

          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/10 mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 shadow-md shadow-orange-500/50 transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-red-400 font-bold tracking-wide uppercase flex items-center gap-1 animate-pulse">
              ● Últimas vagas disponíveis!
            </span>
            <span className="text-xs text-gray-400">
              Corra para garantir seu desconto
            </span>
          </div>
        </div>

        {/* Quick event meta cards (Desktop) */}
        <div className="hidden md:flex items-center justify-center gap-8 mt-12 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span>05 a 09 de Fevereiro de 2027</span>
          </div>
          <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span>Sítio das Tribos (Rio de Janeiro)</span>
          </div>
          <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <span>Ônibus Fretado Incluso</span>
          </div>
        </div>

        {/* Down Arrow Indicator */}
        <button
          onClick={() => onNavigate('about')}
          className="mt-12 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer animate-bounce"
          aria-label="Rolar para baixo"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
}
