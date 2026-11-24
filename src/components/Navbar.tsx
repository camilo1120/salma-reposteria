import React, { useState, useEffect } from 'react';
import { Menu, X, ReceiptText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenReceipt: () => void;
  onJumpToKitchen: (mode?: 'cookie' | 'cupcake' | 'cake') => void;
}

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#sabores', label: '6 Sabores' },
  { href: '#cocina-interactiva', label: 'Cocina Interactiva', highlight: true },
  { href: '#cajas', label: 'Cajas & Precios' },
  { href: '#antojos', label: 'Cuchareables & Tortas' },
  { href: '#clientes', label: 'Clientes' },
];

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenReceipt,
  onJumpToKitchen,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,padding] duration-300 ${
        scrolled
          ? 'bg-[#FFF8F3]/92 backdrop-blur-md shadow-[0_6px_28px_rgba(69,30,16,0.08)] py-2.5 border-b border-[#451E10]/8'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <a
          href="#inicio"
          className="flex items-center gap-2 shrink-0 group focus:outline-none"
          aria-label="Salma Repostería Inicio"
        >
          <img
            src="./images/logo-full.png"
            alt="Salma Repostería"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/75 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-[#451E10]/10 shadow-sm">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                link.highlight
                  ? 'bg-[#FADAD3]/80 text-[#451E10] hover:bg-[#FADAD3] flex items-center gap-1.5'
                  : 'text-[#451E10]/80 hover:text-[#B74347] hover:bg-[#FFF1EC]'
              }`}
            >
              {link.highlight && <Sparkles className="w-3.5 h-3.5 text-[#B74347]" />}
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onJumpToKitchen('cookie')}
            className="hidden sm:inline-flex lg:hidden items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[#FADAD3] text-[#451E10] btn-tactile"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B74347]" />
            Arma tu Postre
          </button>

          <button
            type="button"
            onClick={onOpenReceipt}
            className="relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#451E10] text-[#FFF8F3] text-xs sm:text-sm font-bold shadow-[0_8px_20px_rgba(69,30,16,0.22)] hover:bg-[#2B1108] btn-tactile cursor-pointer"
          >
            <ReceiptText className="w-4 h-4 text-[#FADAD3]" />
            <span>Factura</span>
            {cartCount > 0 ? (
              <span className="inline-flex items-center gap-1 bg-[#B74347] text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-full">
                {cartCount}
                <span className="hidden sm:inline">
                  · ${Math.round(cartTotal / 1000)}k
                </span>
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#FADAD3]/60" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2.5 rounded-full bg-white/90 border border-[#451E10]/12 text-[#451E10] shadow-sm btn-tactile cursor-pointer"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden mx-4 mt-3 rounded-3xl bg-[#FFFDFB]/98 backdrop-blur-xl border border-[#451E10]/10 shadow-2xl p-4"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-base font-bold flex items-center justify-between transition-colors ${
                    link.highlight
                      ? 'bg-[#FADAD3]/65 text-[#451E10]'
                      : 'text-[#451E10] hover:bg-[#FFF1EC]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.highlight && (
                    <span className="text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-[#B74347] text-white">
                      ¡Juega!
                    </span>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
