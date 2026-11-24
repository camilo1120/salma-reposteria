import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Flame, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Layered Authentic Photos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Main Real Packaging Photo from Salma */}
              <div className="col-span-7 relative">
                <div className="rounded-[26px] overflow-hidden border-4 border-white shadow-[0_22px_46px_-12px_rgba(69,30,16,0.28)] bg-[#FADAD3]">
                  <img
                    src="./images/real-cookies-box.jpg"
                    alt="Empaque real de caja de galletas Salma Repostería con papel cuadros rosa"
                    className="w-full h-[310px] sm:h-[390px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -left-2 sm:-left-4 bg-[#451E10] text-[#FFF8F3] px-3.5 py-2 rounded-2xl shadow-lg text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FADAD3]" />
                  Empaque real By Salma
                </div>
              </div>

              {/* Secondary Artisanal Process Photo */}
              <div className="col-span-5 space-y-4">
                <div className="rounded-[22px] overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src="./images/about-kitchen.jpg"
                    alt="Proceso artesanal en cocina Salma Repostería"
                    className="w-full h-[210px] sm:h-[260px] object-cover"
                  />
                </div>
                <div className="rounded-2xl bg-gingham-soft border border-[#B74347]/15 p-4 text-center shadow-xs">
                  <p
                    className="text-2xl sm:text-3xl font-black text-[#B74347]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    100%
                  </p>
                  <p className="text-xs font-bold text-[#451E10]/80 leading-tight mt-0.5">
                    Horneado a mano en cada pedido
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Brand Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1EC] border border-[#B74347]/20 text-[#B74347] text-xs font-extrabold uppercase tracking-widest">
              <span>¿Quiénes Somos?</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#451E10] leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Sobre{' '}
              <span className="text-[#B74347]">Salma Repostería</span>
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#451E10]/85 font-medium">
              Somos una repostería artesanal apasionada por crear momentos dulces e
              inolvidables. Cada una de nuestras galletas, cuchareables y tortas se
              hornea con ingredientes seleccionados y dedicación en cada detalle,
              buscando siempre ese sabor casero irresistible que te hace querer
              repetir.
            </p>

            {/* Editorial Craft Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {[
                {
                  icon: Flame,
                  title: 'Centro Suave',
                  text: 'Temperatura exacta para lograr borde dorado y corazón cremoso.',
                },
                {
                  icon: Heart,
                  title: 'Hecho con Amor',
                  text: 'Recetas propias desde nuestro taller en Floridablanca.',
                },
                {
                  icon: Award,
                  title: 'Ingredientes Top',
                  text: 'Chocolate real, leche Klim, Oreo y arequipe artesanal.',
                },
              ].map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-2xl bg-white p-4 border border-[#451E10]/8 shadow-[0_8px_24px_-12px_rgba(69,30,16,0.12)]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FADAD3]/65 text-[#B74347] flex items-center justify-center mb-2.5">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#451E10]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#451E10]/70 mt-1 leading-relaxed">
                      {pillar.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
