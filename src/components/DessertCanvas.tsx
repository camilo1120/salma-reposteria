import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DessertMode,
  PlacedTopping,
  StudioBase,
  StudioFilling,
  StudioFrosting,
  STUDIO_TOPPINGS,
  CakeSizeOption,
  CUPCAKE_WRAPPERS,
} from '../data/bakeryData';
import { ToppingPieceSvg } from './ToppingGraphics';

export interface CrumbBurst {
  id: string;
  x: number;
  y: number;
  color: string;
}

interface DessertCanvasProps {
  mode: DessertMode;
  base: StudioBase;
  filling: StudioFilling;
  frosting: StudioFrosting;
  cupcakeWrapperId: string;
  cakeSize: CakeSizeOption;
  cakeMessage: string;
  placedToppings: PlacedTopping[];
  bakeProgress: number; // 0..100
  isBaked: boolean;
  isDropTargetActive: boolean;
  referencePhotoUrl: string | null;
  crumbBursts: CrumbBurst[];
  dropZoneRef: React.RefObject<HTMLDivElement | null>;
  onRemoveTopping: (uid: string) => void;
}

export const DessertCanvas: React.FC<DessertCanvasProps> = ({
  mode,
  base,
  filling,
  frosting,
  cupcakeWrapperId,
  cakeSize,
  cakeMessage,
  placedToppings,
  bakeProgress,
  isBaked,
  isDropTargetActive,
  referencePhotoUrl,
  crumbBursts,
  dropZoneRef,
  onRemoveTopping,
}) => {
  const wrapper =
    CUPCAKE_WRAPPERS.find((w) => w.id === cupcakeWrapperId) || CUPCAKE_WRAPPERS[0];

  // Pick the 100% photorealistic overhead base photograph!
  const mainPhotoSrc =
    mode === 'cookie'
      ? base.image
      : mode === 'cupcake'
      ? frosting.cupcakeImage
      : frosting.cakeImage;

  // Dynamic caramelization / golden oven warmth based on bakeProgress (0..100)
  const bakeBrowning = Math.min(1, bakeProgress / 100);
  const ovenFilter =
    bakeProgress > 0
      ? `brightness(${1 - bakeBrowning * 0.12}) saturate(${1 + bakeBrowning * 0.18}) contrast(${1 + bakeBrowning * 0.08})`
      : 'none';

  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none">
      {/* Pinned Polaroid Reference Photo (positioned on top-right edge so it NEVER covers the SM header!) */}
      <AnimatePresence>
        {referencePhotoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 5 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="hidden sm:block absolute -top-5 -right-5 z-30 bg-white p-1.5 pb-3.5 rounded-xl shadow-[0_14px_28px_rgba(43,17,8,0.28)] border border-[#451E10]/10 w-24"
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-[#FADAD3]/90 -rotate-2 rounded-xs" />
            <img
              src={referencePhotoUrl}
              alt="Referencia de diseño"
              className="w-full h-20 object-cover rounded-md"
            />
            <p className="text-[9px] font-extrabold text-center text-[#451E10] mt-1 tracking-tight">
              Tu Diseño ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open Salma Bakery Box Shell (inspired by Tondo Pizza's open box + Salma's real box!) */}
      <div
        className={`bakery-box-shell rounded-[28px] p-3.5 sm:p-5 transition-all duration-200 ${
          isDropTargetActive
            ? 'ring-4 ring-[#B74347]/70 scale-[1.015]'
            : 'ring-1 ring-[#451E10]/10'
        }`}
      >
        {/* Box Header with Official SM Seal */}
        <div className="flex items-center justify-between gap-2 px-1 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="./images/logo-sm.png"
              alt="Salma Repostería"
              className="h-6 w-auto object-contain shrink-0"
            />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#451E10]/65 truncate">
              {mode === 'cookie'
                ? 'Caja Artesanal · Galleta NY'
                : mode === 'cupcake'
                ? 'Taller de Cupcakes Salma'
                : `Base Dorada · ${cakeSize.name}`}
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FFF1EC] text-[#B74347] whitespace-nowrap shrink-0">
            {placedToppings.length} toppings
          </span>
        </div>

        {/* Pink Checkered Bakery Wax Paper Dropzone */}
        <div
          ref={dropZoneRef}
          className={`relative aspect-square w-full rounded-[22px] bg-gingham-pink bakery-box-inner overflow-hidden flex items-center justify-center transition-colors ${
            isDropTargetActive ? 'outline-2 outline-dashed outline-[#B74347]' : ''
          }`}
        >
          {/* Subtle parchment inner fold vignette for realism */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_54%,rgba(69,30,16,0.12)_100%)]"
          />

          {/* Drop hint overlay when dragging */}
          <AnimatePresence>
            {isDropTargetActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-3 rounded-2xl border-2 border-dashed border-[#B74347]/75 bg-[#B74347]/8 z-30 flex items-end justify-center pb-3"
              >
                <span className="px-3 py-1 rounded-full bg-[#B74347] text-white text-[11px] font-extrabold shadow-md">
                  ¡Suelta aquí el ingrediente!
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Warm Oven Steam wisps when baked */}
          {isBaked && (
            <div className="pointer-events-none absolute inset-x-0 top-5 z-20 flex justify-center gap-9">
              {[0, 0.55, 1.1].map((delay, i) => (
                <svg
                  key={i}
                  width="24"
                  height="42"
                  viewBox="0 0 24 42"
                  className="animate-steam text-white/85"
                  style={{ animationDelay: `${delay}s` }}
                >
                  <path
                    d="M12 40 C4 30, 20 20, 12 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              ))}
            </div>
          )}

          {/* MAIN PHOTOREALISTIC DESSERT STAGE */}
          <motion.div
            key={`${mode}-${base.id}-${frosting.id}-${cakeSize.id}`}
            initial={{ scale: 0.92, opacity: 0.72 }}
            animate={{
              scale: mode === 'cake' ? cakeSize.diameterScale : 1,
              opacity: 1,
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="relative w-[82%] h-[82%] flex items-center justify-center"
            style={{ filter: ovenFilter }}
          >
            {/* Optional Cupcake Liner Halo Ring matching selected capacillo */}
            {mode === 'cupcake' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[3%] rounded-full opacity-90 shadow-[0_14px_26px_rgba(43,17,8,0.28)]"
                style={{
                  background: `repeating-conic-gradient(${wrapper.color} 0deg 10deg, ${wrapper.stripe} 10deg 20deg)`,
                }}
              />
            )}

            {/* 100% REAL STUDIO PHOTOGRAPH CUTOUT (Cookie / Cupcake / Cake) */}
            <img
              src={mainPhotoSrc}
              alt={`${base.name} Salma Repostería`}
              draggable={false}
              className={`relative z-10 object-contain select-none pointer-events-none ${
                mode === 'cupcake'
                  ? 'w-[92%] h-[92%] drop-shadow-[0_10px_16px_rgba(43,17,8,0.34)]'
                  : 'w-full h-full drop-shadow-[0_20px_24px_rgba(43,17,8,0.36)]'
              }`}
            />

            {/* REAL PHOTOGRAPHIC MOLTEN CENTER FILLING OVERLAY (when filling selected!) */}
            <AnimatePresence>
              {filling.id !== 'none' && filling.image && mode !== 'cake' && (
                <motion.div
                  key={filling.id}
                  initial={{ scale: 0.55, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.94 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                  className="pointer-events-none absolute z-15 w-[34%] h-[34%] flex items-center justify-center"
                >
                  <img
                    src={filling.image}
                    alt={filling.name}
                    draggable={false}
                    className="w-full h-full object-contain rounded-full drop-shadow-[0_6px_10px_rgba(32,12,4,0.42)]"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* LIVE PIPED CAKE INSCRIPTION TEXT RIGHT ON TOP OF THE REAL CAKE PHOTO */}
            {mode === 'cake' && cakeMessage.trim() && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-10 text-center">
                <span
                  className={`font-bold italic leading-tight select-none ${
                    frosting.id === 'ganache-drip'
                      ? 'text-[#FFF5DF] drop-shadow-[0_2px_4px_rgba(20,8,2,0.7)]'
                      : 'text-[#B74347] drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]'
                  }`}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: cakeMessage.length > 18 ? '1.05rem' : '1.35rem',
                  }}
                >
                  {cakeMessage.slice(0, 28)}
                </span>
              </div>
            )}

            {/* PLACED REAL PHOTOGRAPHIC TOPPINGS LAYER (EXACT X/Y DROP COORDINATES!) */}
            <div className="absolute inset-0 z-25 pointer-events-none">
              <AnimatePresence>
                {placedToppings.map((item) => {
                  const spec = STUDIO_TOPPINGS.find((t) => t.id === item.toppingId);
                  if (!spec) return null;
                  return (
                    <motion.button
                      key={item.uid}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTopping(item.uid);
                      }}
                      title={`Quitar ${spec.name}`}
                      initial={{ scale: 1.5, opacity: 0, y: -16 }}
                      animate={{
                        scale: item.scale,
                        opacity: 1,
                        y: 0,
                        rotate: item.rotation,
                      }}
                      exit={{ scale: 0.45, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 440, damping: 22 }}
                      className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform focus:outline-none"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                      }}
                    >
                      <ToppingPieceSvg kind={spec.kind} size={46} />
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* CRUMB / SPARKLE BURST PARTICLES */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-visible">
              <AnimatePresence>
                {crumbBursts.map((burst) => (
                  <div
                    key={burst.id}
                    className="absolute"
                    style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
                  >
                    {[0, 60, 120, 180, 240, 300].map((deg) => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <motion.span
                          key={deg}
                          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                          animate={{
                            x: Math.cos(rad) * 26,
                            y: Math.sin(rad) * 26,
                            scale: 0.2,
                            opacity: 0,
                          }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                          className="absolute w-2 h-2 rounded-full"
                          style={{ backgroundColor: burst.color }}
                        />
                      );
                    })}
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Subtle bottom interactive hint */}
          <div className="pointer-events-none absolute bottom-2.5 inset-x-0 z-30 flex justify-center px-3">
            <span className="px-3 py-1 rounded-full bg-[#FFFDFB]/90 backdrop-blur-sm border border-[#451E10]/10 text-[10px] sm:text-[11px] font-bold text-[#451E10]/80 shadow-xs text-center">
              Arrastra ingredientes aquí o tócalos · Clic en un topping para quitarlo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
