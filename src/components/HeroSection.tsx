import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Cookie, Star, MapPin, ChefHat } from 'lucide-react';
import { DessertMode } from '../data/bakeryData';

interface HeroSectionProps {
  onJumpToKitchen: (mode: DessertMode) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onJumpToKitchen }) => {
  return (
    <section
      id="inicio"
      className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-hidden"
    >
      {/* Subtle artisanal decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#FADAD3]/50 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-[360px] h-[360px] rounded-full bg-[#F5DFC9]/55 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FADAD3]/80 border border-[#B74347]/20 text-[#451E10] text-xs font-extrabold tracking-wide uppercase">
                <MapPin className="w-3.5 h-3.5 text-[#B74347]" />
                Floridablanca &amp; Bucaramanga
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 border border-[#451E10]/10 text-[#451E10] text-xs font-bold shadow-xs">
                <Star className="w-3.5 h-3.5 fill-[#E59E3A] text-[#E59E3A]" />
                4.9 · Horneado artesanal diario
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[62px] leading-[1.04] font-black tracking-tight text-[#451E10]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              El sabor del cielo{' '}
              <span className="relative inline-block text-[#B74347] italic font-bold">
                hecho postre
                <svg
                  viewBox="0 0 240 16"
                  className="absolute -bottom-1.5 left-0 w-full h-3 text-[#FADAD3]"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 12 C 65 2, 175 2, 237 11"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-[19px] leading-relaxed text-[#451E10]/80 max-w-xl font-medium">
              Crujientes por fuera, suaves por dentro. Pide por unidad, arma tu caja
              o cotiza tu torta ideal.
            </p>

            {/* Primary Interactive CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onJumpToKitchen('cookie')}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#B74347] hover:bg-[#962E32] text-white font-extrabold text-base shadow-[0_14px_30px_-6px_rgba(183,67,71,0.48)] btn-tactile cursor-pointer"
              >
                <ChefHat className="w-5 h-5" />
                <span>Arma tu Postre en Cocina</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#cajas"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-[#FFF1EC] text-[#451E10] font-extrabold text-base border-2 border-[#451E10]/14 shadow-xs btn-tactile"
              >
                <Cookie className="w-4 h-4 text-[#B74347]" />
                <span>Ver Cajas &amp; Sabores</span>
              </a>
            </div>

            {/* Quick Playful Mode Shortcuts */}
            <div className="pt-3 border-t border-[#451E10]/10">
              <p className="text-xs font-bold uppercase tracking-wider text-[#451E10]/55 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B74347]" />
                Experiencia Interactiva estilo Papa&apos;s Bakeria — Elige qué crear:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { mode: 'cookie' as DessertMode, emoji: '🍪', label: 'Galleta NY Style' },
                  { mode: 'cupcake' as DessertMode, emoji: '🧁', label: 'Cupcake Artesanal' },
                  { mode: 'cake' as DessertMode, emoji: '🎂', label: 'Torta + Foto Diseño' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => onJumpToKitchen(item.mode)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/85 hover:bg-[#FADAD3]/70 border border-[#451E10]/10 text-xs sm:text-sm font-bold text-[#451E10] shadow-xs btn-tactile cursor-pointer"
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Dramatic Food Photography Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Decorative pink gingham frame offset */}
            <div className="absolute -inset-3 sm:-inset-4 rounded-[34px] bg-gingham-pink border-2 border-[#F498B2]/35 -rotate-1" />

            <div className="relative rounded-[28px] overflow-hidden shadow-[0_28px_60px_-15px_rgba(69,30,16,0.34)] border-4 border-white bg-[#2B1108]">
              <img
                src="./images/hero-cookies.jpg"
                alt="Galletas artesanales Salma Repostería partidas mostrando su centro suave de chocolate y red velvet"
                className="w-full h-[340px] sm:h-[440px] lg:h-[490px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1108]/65 via-transparent to-transparent" />

              {/* Bottom caption inside hero photo */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div className="bg-[#FFFDFB]/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white max-w-[290px]">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#B74347]">
                    Recién salidas del horno
                  </p>
                  <p className="text-sm font-bold text-[#451E10] leading-snug">
                    Centro fundido irresistible en 6 sabores artesanales desde $5.000
                  </p>
                </div>

                {/* Floating SM Seal */}
                <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-full bg-[#FFF8F3] shadow-xl border-2 border-[#FADAD3] p-2 shrink-0 rotate-6">
                  <img
                    src="./images/logo-sm.png"
                    alt="Sello SM Salma Repostería"
                    className="w-14 h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
