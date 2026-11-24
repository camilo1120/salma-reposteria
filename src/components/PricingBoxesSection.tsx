import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  MessageCircle,
  Sparkles,
  Check,
  X,
  Plus,
  Trash2,
  ReceiptText,
} from 'lucide-react';
import {
  BOX_PACKAGES,
  BoxPackage,
  COOKIE_FLAVORS,
  CookieFlavor,
  OrderItem,
  buildWhatsAppUrl,
  formatCOP,
} from '../data/bakeryData';
import { soundFx } from '../utils/soundFx';

interface PricingBoxesSectionProps {
  onAddOrderItem: (item: OrderItem) => void;
}

export const PricingBoxesSection: React.FC<PricingBoxesSectionProps> = ({
  onAddOrderItem,
}) => {
  const [activeBox, setActiveBox] = useState<BoxPackage | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<CookieFlavor[]>([]);

  const openBoxBuilder = (pkg: BoxPackage) => {
    setActiveBox(pkg);
    if (pkg.count === 6) {
      // Pre-fill all 6 iconic flavors as smart starting suggestion!
      setSelectedFlavors([...COOKIE_FLAVORS]);
    } else if (pkg.count === 1) {
      setSelectedFlavors([COOKIE_FLAVORS[0]]);
    } else {
      setSelectedFlavors([]);
    }
  };

  const addFlavorToSlot = (flavor: CookieFlavor) => {
    if (!activeBox) return;
    if (selectedFlavors.length >= activeBox.count) return;
    soundFx.playPop(selectedFlavors.length);
    setSelectedFlavors((prev) => [...prev, flavor]);
  };

  const removeSlot = (index: number) => {
    soundFx.playPop(-2);
    setSelectedFlavors((prev) => prev.filter((_, i) => i !== index));
  };

  const buildFlavorSummary = () => {
    const counts = new Map<string, number>();
    selectedFlavors.forEach((f) => {
      counts.set(f.name, (counts.get(f.name) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, qty]) => `${qty}× ${name}`);
  };

  const handleAddBoxToReceipt = () => {
    if (!activeBox || selectedFlavors.length !== activeBox.count) return;
    const summary = buildFlavorSummary();
    onAddOrderItem({
      id: `box-${Date.now()}`,
      category: activeBox.count === 1 ? 'cookie' : 'box',
      title: activeBox.name,
      subtitle: activeBox.count === 1 ? selectedFlavors[0].name : `Caja de regalo x${activeBox.count}`,
      details: summary,
      unitPrice: activeBox.price,
      quantity: 1,
      previewImage: selectedFlavors[0]?.image || './images/real-cookies-box.jpg',
    });
    soundFx.playReceiptPrint();
    setActiveBox(null);
  };

  const handleSendBoxWhatsApp = () => {
    if (!activeBox) return;
    const summary =
      selectedFlavors.length > 0
        ? buildFlavorSummary().join(', ')
        : 'Sabores surtidos a confirmar';
    const msg = `¡Hola Salma Repostería! 🍪✨ Quiero pedir:\n\n• *${activeBox.name}* (${formatCOP(activeBox.price)})\n• Sabores: ${summary}\n\n¿Me confirmas disponibilidad para entrega en Bucaramanga / Floridablanca?`;
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="cajas" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FADAD3]/80 text-[#451E10] text-xs font-extrabold uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5 text-[#B74347]" />
            Precios y Cajas de Regalo
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#451E10] leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Elige tu antojo o{' '}
            <span className="text-[#B74347]">arma tu caja ideal</span>
          </h2>
          <p className="text-sm sm:text-base text-[#451E10]/75 font-medium">
            Cada caja viene empacada con nuestro icónico papel vichy rosa, lista para
            sorprender o disfrutar recién salida del horno.
          </p>
        </div>

        {/* 4 Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {BOX_PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.23, 1, 0.32, 1] }}
              className={`relative rounded-[28px] p-6 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 ${
                pkg.highlight
                  ? 'bg-[#451E10] text-[#FFF8F3] shadow-[0_24px_48px_-14px_rgba(69,30,16,0.42)] ring-2 ring-[#B74347]'
                  : 'bg-white text-[#451E10] border border-[#451E10]/10 shadow-[0_12px_30px_-14px_rgba(69,30,16,0.16)]'
              }`}
            >
              {pkg.badge && (
                <span
                  className={`absolute -top-3 right-5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-sm ${
                    pkg.highlight
                      ? 'bg-[#B74347] text-white'
                      : 'bg-[#FADAD3] text-[#451E10]'
                  }`}
                >
                  {pkg.badge}
                </span>
              )}

              <div>
                {/* Visual Mini Box Slots Preview */}
                <div
                  className={`rounded-2xl p-3.5 mb-5 flex items-center justify-center gap-2 min-h-[76px] ${
                    pkg.highlight
                      ? 'bg-white/10 border border-white/12'
                      : 'bg-gingham-soft border border-[#F498B2]/25'
                  }`}
                >
                  <div
                    className={`grid gap-1.5 ${
                      pkg.count === 1
                        ? 'grid-cols-1'
                        : pkg.count === 3
                        ? 'grid-cols-3'
                        : pkg.count === 4
                        ? 'grid-cols-2'
                        : 'grid-cols-3'
                    }`}
                  >
                    {Array.from({ length: pkg.count }).map((_, i) => (
                      <img
                        key={i}
                        src={COOKIE_FLAVORS[i % COOKIE_FLAVORS.length].image}
                        alt=""
                        className={`${
                          pkg.count === 1 ? 'w-12 h-12' : 'w-8 h-8'
                        } rounded-full object-cover border-2 border-white shadow-sm`}
                      />
                    ))}
                  </div>
                </div>

                <h3
                  className="text-xl font-black tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {pkg.name}
                </h3>

                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span
                    className={`text-3xl font-black font-mono ${
                      pkg.highlight ? 'text-[#FADAD3]' : 'text-[#B74347]'
                    }`}
                  >
                    {formatCOP(pkg.price)}
                  </span>
                  {pkg.count === 1 && (
                    <span className="text-xs font-bold opacity-75">c/u</span>
                  )}
                </div>

                <p
                  className={`text-xs font-bold mt-1 ${
                    pkg.highlight ? 'text-[#FADAD3]/85' : 'text-[#451E10]/55'
                  }`}
                >
                  {pkg.unitLabel}
                </p>

                <p
                  className={`text-sm mt-3.5 leading-relaxed ${
                    pkg.highlight ? 'text-[#FFF8F3]/85' : 'text-[#451E10]/78'
                  }`}
                >
                  {pkg.description}
                </p>
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={() => openBoxBuilder(pkg)}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 btn-tactile cursor-pointer ${
                    pkg.highlight
                      ? 'bg-[#FADAD3] text-[#451E10] hover:bg-white'
                      : 'bg-[#451E10] text-[#FFF8F3] hover:bg-[#2B1108]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#B74347]" />
                  <span>{pkg.count === 1 ? 'Elegir Sabor' : 'Armar mi Caja'}</span>
                </button>

                <a
                  href={buildWhatsAppUrl(
                    `¡Hola Salma Repostería! 🍪 Quiero pedir la *${pkg.name}* (${formatCOP(pkg.price)}). ¿Qué sabores tienes disponibles hoy?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 btn-tactile ${
                    pkg.highlight
                      ? 'bg-white/12 text-white hover:bg-white/20'
                      : 'bg-[#FFF1EC] text-[#B74347] hover:bg-[#FADAD3]/65'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Armar mi caja por WhatsApp</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Visual Box Builder Modal */}
      <AnimatePresence>
        {activeBox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2B1108]/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveBox(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[30px] bg-[#FFF8F3] border border-[#451E10]/12 shadow-2xl p-5 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#451E10]/10">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#B74347]">
                    Empaque Salma Repostería
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-black text-[#451E10]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {activeBox.name} ·{' '}
                    <span className="text-[#B74347] font-mono">
                      {formatCOP(activeBox.price)}
                    </span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveBox(null)}
                  className="p-2 rounded-full bg-white border border-[#451E10]/10 text-[#451E10] hover:bg-[#FADAD3]/50 cursor-pointer"
                  aria-label="Cerrar armador de caja"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Open Salma Pink Checkered Box Visual */}
              <div className="mt-5 bakery-box-shell rounded-3xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img src="./images/logo-sm.png" alt="SM" className="h-6 w-auto" />
                    <span className="text-xs font-extrabold text-[#451E10]/70 uppercase tracking-wider">
                      Tu Caja ({selectedFlavors.length} / {activeBox.count})
                    </span>
                  </div>
                  {selectedFlavors.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedFlavors([])}
                      className="text-xs font-bold text-[#B74347] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Vaciar
                    </button>
                  )}
                </div>

                <div className="bg-gingham-pink bakery-box-inner rounded-2xl p-4">
                  <div
                    className={`grid gap-3 place-items-center ${
                      activeBox.count === 1
                        ? 'grid-cols-1'
                        : activeBox.count === 3
                        ? 'grid-cols-3'
                        : activeBox.count === 4
                        ? 'grid-cols-2 sm:grid-cols-4'
                        : 'grid-cols-3'
                    }`}
                  >
                    {Array.from({ length: activeBox.count }).map((_, slotIdx) => {
                      const chosen = selectedFlavors[slotIdx];
                      return (
                        <button
                          key={slotIdx}
                          type="button"
                          onClick={() => chosen && removeSlot(slotIdx)}
                          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all ${
                            chosen
                              ? 'cursor-pointer group'
                              : 'border-2 border-dashed border-[#B74347]/40 bg-white/75 text-[#451E10]/45'
                          }`}
                        >
                          {chosen ? (
                            <motion.div
                              initial={{ scale: 0.72, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                              className="relative w-full h-full"
                            >
                              <img
                                src={chosen.image}
                                alt={chosen.name}
                                className="w-full h-full rounded-full object-cover border-2 border-white shadow-md"
                              />
                              <span className="absolute -bottom-1.5 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-[#451E10] text-white text-[10px] font-bold shadow">
                                {chosen.name}
                              </span>
                              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#B74347] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                                <X className="w-3 h-3" />
                              </span>
                            </motion.div>
                          ) : (
                            <span className="text-[11px] font-bold">
                              Espacio {slotIdx + 1}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pick Flavors Grid */}
              <div className="mt-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#451E10]/65 mb-2.5">
                  Toca los sabores para llenar tu caja:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COOKIE_FLAVORS.map((flavor) => {
                    const isFull = selectedFlavors.length >= activeBox.count;
                    return (
                      <button
                        key={flavor.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => addFlavorToSlot(flavor)}
                        className={`flex items-center gap-2.5 p-2 rounded-2xl border text-left transition-all btn-tactile ${
                          isFull
                            ? 'opacity-50 bg-white/50 border-[#451E10]/8 cursor-not-allowed'
                            : 'bg-white border-[#451E10]/12 hover:border-[#B74347] hover:bg-[#FFF1EC] cursor-pointer shadow-xs'
                        }`}
                      >
                        <img
                          src={flavor.image}
                          alt={flavor.name}
                          className="w-11 h-11 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold text-[#451E10] truncate">
                            {flavor.name}
                          </p>
                          <p className="text-[10px] font-semibold text-[#B74347] flex items-center gap-0.5">
                            <Plus className="w-3 h-3" /> Añadir
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={selectedFlavors.length !== activeBox.count}
                  onClick={handleAddBoxToReceipt}
                  className={`flex-1 py-3.5 px-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 btn-tactile ${
                    selectedFlavors.length === activeBox.count
                      ? 'bg-[#451E10] hover:bg-[#2B1108] text-white cursor-pointer shadow-lg'
                      : 'bg-[#451E10]/20 text-[#451E10]/50 cursor-not-allowed'
                  }`}
                >
                  {selectedFlavors.length === activeBox.count ? (
                    <>
                      <ReceiptText className="w-4 h-4 text-[#FADAD3]" />
                      <span>Agregar a mi Factura ({formatCOP(activeBox.price)})</span>
                    </>
                  ) : (
                    <span>
                      Elige {activeBox.count - selectedFlavors.length} galleta(s) más
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendBoxWhatsApp}
                  className="py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1FB857] text-white font-extrabold text-sm flex items-center justify-center gap-2 btn-tactile cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                  {selectedFlavors.length === activeBox.count && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
