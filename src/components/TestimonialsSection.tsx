import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart, MessageSquareQuote } from 'lucide-react';
import { TESTIMONIALS } from '../data/bakeryData';

export const TestimonialsSection: React.FC = () => {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);

  const active = TESTIMONIALS[index];

  return (
    <section id="clientes" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FADAD3]/80 text-[#451E10] text-xs font-extrabold uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5 text-[#B74347] fill-[#B74347]" />
              Lo que dicen nuestros clientes
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#451E10] leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Pedidos reales,{' '}
              <span className="text-[#B74347]">sonrisas dulces</span>
            </h2>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={prev}
              aria-label="Testimonio anterior"
              className="w-11 h-11 rounded-full bg-white border border-[#451E10]/12 text-[#451E10] hover:bg-[#FADAD3]/65 flex items-center justify-center shadow-xs btn-tactile cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente testimonio"
              className="w-11 h-11 rounded-full bg-[#451E10] text-[#FFF8F3] hover:bg-[#2B1108] flex items-center justify-center shadow-sm btn-tactile cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Carousel Stage + Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Active Featured Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="h-full rounded-[30px] bg-white border border-[#451E10]/10 shadow-[0_20px_44px_-18px_rgba(69,30,16,0.2)] overflow-hidden grid grid-cols-1 sm:grid-cols-12"
              >
                <div className="sm:col-span-5 relative min-h-[240px]">
                  <img
                    src={active.image}
                    alt={`Pedido entregado: ${active.productOrdered}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#451E10]/85 backdrop-blur-sm text-white text-[11px] font-bold">
                    {active.productOrdered}
                  </span>
                </div>

                <div className="sm:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-0.5 text-[#E59E3A]">
                        {Array.from({ length: active.rating }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          active.platform === 'WhatsApp'
                            ? 'bg-[#E5F9EC] text-[#15803D]'
                            : 'bg-[#FFF1EC] text-[#B74347]'
                        }`}
                      >
                        {active.platform} · {active.dateLabel}
                      </span>
                    </div>

                    <MessageSquareQuote className="w-7 h-7 text-[#FADAD3] mb-2" />
                    <p className="text-base sm:text-lg font-semibold leading-relaxed text-[#451E10]">
                      &ldquo;{active.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#451E10]/8 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-sm text-[#451E10]">
                        {active.author}
                      </p>
                      <p className="text-xs text-[#451E10]/60 font-medium">
                        {active.location}
                      </p>
                    </div>
                    <img
                      src="./images/logo-sm.png"
                      alt="Salma"
                      className="h-7 w-auto opacity-85"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Gallery Mini-Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            {TESTIMONIALS.map((item, idx) => {
              const isSelected = idx === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(idx)}
                  className={`relative rounded-2xl overflow-hidden text-left border-2 transition-all btn-tactile cursor-pointer min-h-[145px] ${
                    isSelected
                      ? 'border-[#B74347] shadow-lg scale-[1.01]'
                      : 'border-white shadow-sm opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.productOrdered}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B1108]/85 via-[#2B1108]/20 to-transparent" />
                  <div className="relative h-full p-3.5 flex flex-col justify-end text-white">
                    <p className="text-xs font-extrabold leading-tight line-clamp-1">
                      {item.author}
                    </p>
                    <p className="text-[11px] text-[#FADAD3] font-semibold line-clamp-1">
                      {item.productOrdered}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIndex(idx)}
              aria-label={`Ver reseña ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === index ? 'w-8 bg-[#B74347]' : 'w-2 bg-[#451E10]/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
