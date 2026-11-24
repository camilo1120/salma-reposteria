import React from 'react';
import { motion } from 'framer-motion';
import { Plus, SlidersHorizontal, Sparkles } from 'lucide-react';
import { COOKIE_FLAVORS, CookieFlavor, formatCOP } from '../data/bakeryData';

interface FlavorsSectionProps {
  onQuickAddCookie: (flavor: CookieFlavor) => void;
  onCustomizeFlavor: (flavor: CookieFlavor) => void;
}

export const FlavorsSection: React.FC<FlavorsSectionProps> = ({
  onQuickAddCookie,
  onCustomizeFlavor,
}) => {
  return (
    <section
      id="sabores"
      className="py-16 sm:py-24 bg-[#FFFDFB] border-y border-[#451E10]/8 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FADAD3]/75 text-[#451E10] text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#B74347]" />
              Menú de Galletas Artesanales
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#451E10] leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nuestros <span className="text-[#B74347]">6 Sabores</span> de Galletas
            </h2>
            <p className="text-sm sm:text-base text-[#451E10]/75 font-medium">
              Agrégalas directo a tu factura por unidad ($5.000) o ábrelas en nuestra
              Cocina Interactiva para añadir rellenos y toppings a tu antojo.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2.5 rounded-2xl bg-[#FFF1EC] border border-[#B74347]/15 text-xs sm:text-sm font-bold text-[#451E10]">
            <span>Todas a</span>
            <span className="text-base font-black text-[#B74347] font-mono">
              $5.000 c/u
            </span>
          </div>
        </div>

        {/* 6 Flavors Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {COOKIE_FLAVORS.map((flavor, idx) => (
            <motion.article
              key={flavor.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.45,
                delay: idx * 0.05,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="group rounded-[28px] bg-[#FFF8F3] border border-[#451E10]/10 overflow-hidden shadow-[0_12px_32px_-16px_rgba(69,30,16,0.2)] hover:shadow-[0_24px_48px_-18px_rgba(69,30,16,0.28)] transition-shadow duration-300 flex flex-col"
            >
              {/* Photo Container */}
              <div className="relative aspect-square overflow-hidden bg-[#FFF2EA]">
                <img
                  src={flavor.image}
                  alt={`Galleta artesanal ${flavor.name} de Salma Repostería`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-[#FFFDFB]/92 backdrop-blur-sm text-[#451E10] text-[11px] font-extrabold shadow-sm border border-[#451E10]/8">
                    {flavor.shortTag}
                  </span>
                  {flavor.popular && (
                    <span className="px-2.5 py-1 rounded-full bg-[#B74347] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      Top
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#451E10]/90 text-[#FFF8F3] font-mono text-xs font-bold backdrop-blur-sm">
                  {formatCOP(flavor.price)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-5">
                <div>
                  <h3
                    className="text-2xl font-black text-[#451E10] tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {flavor.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#451E10]/78 font-medium">
                    {flavor.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onQuickAddCookie(flavor)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#451E10] hover:bg-[#2B1108] text-[#FFF8F3] text-xs sm:text-sm font-extrabold btn-tactile cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-[#FADAD3]" />
                    <span>Agregar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onCustomizeFlavor(flavor)}
                    title="Abrir en la Cocina Interactiva"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl bg-[#FADAD3]/75 hover:bg-[#FADAD3] text-[#451E10] text-xs sm:text-sm font-extrabold btn-tactile cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#B74347]" />
                    <span>Personalizar</span>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
