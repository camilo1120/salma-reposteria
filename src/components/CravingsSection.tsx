import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Cake, ArrowRight, Sparkles, Camera } from 'lucide-react';
import { OrderItem, formatCOP } from '../data/bakeryData';
import { soundFx } from '../utils/soundFx';

interface CravingsSectionProps {
  onAddOrderItem: (item: OrderItem) => void;
  onQuoteCake: () => void;
}

export const CravingsSection: React.FC<CravingsSectionProps> = ({
  onAddOrderItem,
  onQuoteCake,
}) => {
  const handleOrderCuchareable = () => {
    soundFx.playReceiptPrint();
    onAddOrderItem({
      id: `cuchareable-${Date.now()}`,
      category: 'cuchareable',
      title: 'Cuchareable de Red Velvet',
      subtitle: 'Capas de bizcocho húmedo + queso crema',
      details: ['Presentación artesanal 8 oz', 'Incluye cucharita dorada'],
      unitPrice: 16000,
      quantity: 1,
      previewImage: './images/cuchareable-red-velvet.jpg',
    });
  };

  return (
    <section
      id="antojos"
      className="py-16 sm:py-24 bg-[#FFFDFB] border-y border-[#451E10]/8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FADAD3]/80 text-[#451E10] text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#B74347]" />
            Más Dulces Antojos
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#451E10] leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Cuchareables y{' '}
            <span className="text-[#B74347]">Tortas Personalizadas</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-8">
          {/* Block 1: Cuchareables de Red Velvet */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="group rounded-[32px] overflow-hidden bg-[#FFF8F3] border border-[#451E10]/10 shadow-[0_18px_40px_-18px_rgba(69,30,16,0.22)] flex flex-col"
          >
            <div className="relative h-72 sm:h-80 overflow-hidden">
              <img
                src="./images/cuchareable-red-velvet.jpg"
                alt="Cuchareable de Red Velvet artesanal con capas de crema suave"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#B74347] text-white text-xs font-extrabold shadow-md">
                Edición Favorita · {formatCOP(16000)}
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between gap-6">
              <div>
                <h3
                  className="text-2xl sm:text-3xl font-black text-[#451E10]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Cuchareables de Red Velvet
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#451E10]/80 font-medium">
                  Capas irresistibles de nuestro bizcocho Red Velvet húmedo y
                  esponjoso con crema suave. El postre perfecto para disfrutar a
                  cucharadas.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleOrderCuchareable}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#B74347] hover:bg-[#962E32] text-white font-extrabold text-sm shadow-[0_12px_24px_-6px_rgba(183,67,71,0.45)] btn-tactile cursor-pointer"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Pedir Cuchareable</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#451E10]/55">
                  Se agrega directo a tu factura en vivo
                </span>
              </div>
            </div>
          </motion.article>

          {/* Block 2: Tortas Personalizadas (Real Salma Cake Photo!) */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="group rounded-[32px] overflow-hidden bg-[#451E10] text-[#FFF8F3] border border-[#451E10] shadow-[0_22px_48px_-18px_rgba(69,30,16,0.4)] flex flex-col"
          >
            <div className="relative h-72 sm:h-80 overflow-hidden">
              <img
                src="./images/real-cake.jpg"
                alt="Torta artesanal personalizada Salma Repostería con rosetones de crema y arequipe"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#451E10] via-transparent to-transparent opacity-65" />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#FFF8F3]/95 text-[#451E10] text-xs font-extrabold shadow-md flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#B74347]" />
                Sube tu foto de referencia
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between gap-6">
              <div>
                <h3
                  className="text-2xl sm:text-3xl font-black text-[#FFF8F3]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Tortas Personalizadas
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#FFF8F3]/82 font-medium">
                  Celebramos tus momentos más especiales. Hacemos tortas artesanales
                  sobre pedido, diseñadas a tu gusto en sabor y decoración.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onQuoteCake}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FADAD3] hover:bg-white text-[#451E10] font-extrabold text-sm shadow-lg btn-tactile cursor-pointer"
                >
                  <Cake className="w-4 h-4 text-[#B74347]" />
                  <span>Cotizar mi Torta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-[#FADAD3]/80">
                  Desde $65.000 · Diseña y adjunta tu imagen
                </span>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};
