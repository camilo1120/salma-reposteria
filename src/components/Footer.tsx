import React from 'react';
import { MapPin, Clock, Instagram, MessageCircle, Heart } from 'lucide-react';
import { SALMA_CONTACT, buildWhatsAppUrl } from '../data/bakeryData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2B1108] text-[#FFF8F3] pt-16 pb-10 relative overflow-hidden">
      {/* Decorative top gingham border strip */}
      <div className="absolute top-0 inset-x-0 h-2.5 bg-gingham-pink opacity-85" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-block bg-[#FFF8F3] rounded-2xl px-4 py-2.5 shadow-md">
              <img
                src="./images/logo-full.png"
                alt="Salma Repostería"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-[#FFF8F3]/75 leading-relaxed max-w-sm">
              Repostería artesanal en Santander. Galletas crujientes por fuera y
              suaves por dentro, cuchareables de Red Velvet, cupcakes y tortas
              personalizadas hechas a tu medida.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={SALMA_CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#B74347] text-white text-xs font-extrabold transition-colors btn-tactile"
              >
                <Instagram className="w-4 h-4" />
                <span>{SALMA_CONTACT.instagramHandle}</span>
              </a>
              <a
                href={SALMA_CONTACT.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#B74347] text-white text-xs font-extrabold transition-colors btn-tactile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                <span>TikTok</span>
              </a>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="md:col-span-4 space-y-4">
            <h4
              className="text-lg font-black text-[#FADAD3]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ubicación y Horarios
            </h4>
            <div className="space-y-3 text-sm text-[#FFF8F3]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-[#FADAD3] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">{SALMA_CONTACT.location}</p>
                  <p className="text-xs text-[#FFF8F3]/65">
                    Domicilios en toda el área metropolitana y entregas programadas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4.5 h-4.5 text-[#FADAD3] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold">{SALMA_CONTACT.hoursWeekday}</p>
                  <p className="font-semibold">{SALMA_CONTACT.hoursSunday}</p>
                  <p className="text-xs text-[#FADAD3]/80 pt-1">
                    {SALMA_CONTACT.cakeNotice}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4
              className="text-lg font-black text-[#FADAD3]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Menú Rápido
            </h4>
            <ul className="space-y-2 text-sm text-[#FFF8F3]/75 font-medium">
              <li>
                <a href="#cocina-interactiva" className="hover:text-[#FADAD3] transition-colors">
                  Cocina Interactiva (Arma tu Postre)
                </a>
              </li>
              <li>
                <a href="#sabores" className="hover:text-[#FADAD3] transition-colors">
                  Nuestros 6 Sabores de Galletas
                </a>
              </li>
              <li>
                <a href="#cajas" className="hover:text-[#FADAD3] transition-colors">
                  Precios y Cajas de Regalo
                </a>
              </li>
              <li>
                <a href="#antojos" className="hover:text-[#FADAD3] transition-colors">
                  Cuchareables &amp; Tortas Personalizadas
                </a>
              </li>
              <li>
                <a href="#clientes" className="hover:text-[#FADAD3] transition-colors">
                  Reseñas y Galería
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FFF8F3]/55">
          <p>
            © {new Date().getFullYear()} Salma Repostería · Floridablanca / Bucaramanga,
            Santander.
          </p>
          <p className="flex items-center gap-1">
            Horneado con <Heart className="w-3.5 h-3.5 text-[#B74347] fill-[#B74347]" />{' '}
            · Propuesta Web Interactiva
          </p>
        </div>
      </div>

      {/* Persistent Floating WhatsApp Button (Bottom Right) */}
      <a
        href={buildWhatsAppUrl(
          '¡Hola Salma Repostería! 🍪✨ Vi su página web y quiero hacer un pedido.'
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir a Salma Repostería por WhatsApp"
        className="fixed bottom-5 right-5 z-40 group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1EB958] text-white pl-4 pr-4 sm:pr-5 py-3.5 rounded-full shadow-[0_14px_32px_rgba(37,211,102,0.45)] btn-tactile"
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
          <MessageCircle className="relative w-6 h-6 fill-white text-white" />
        </span>
        <span className="hidden sm:inline font-extrabold text-sm tracking-tight">
          Pedir por WhatsApp
        </span>
      </a>
    </footer>
  );
};
