import React from 'react';
import { StudioTopping, STUDIO_TOPPINGS } from '../data/bakeryData';

interface ToppingPieceProps {
  kind: StudioTopping['kind'];
  size?: number;
  className?: string;
}

/**
 * Renders a 100% photorealistic transparent PNG topping cutout (for placing onto cookies,
 * cupcakes, cakes, and floating drag ghosts) — zero flat cartoon vectors.
 */
export const ToppingPieceSvg: React.FC<ToppingPieceProps> = ({
  kind,
  size = 44,
  className = '',
}) => {
  const spec = STUDIO_TOPPINGS.find((t) => t.kind === kind);
  if (!spec) return null;

  const width = spec.isWide ? Math.round(size * 1.65) : size;
  const height = spec.isWide ? Math.round(size * 1.45) : size;

  return (
    <img
      src={spec.pieceImage}
      alt={spec.name}
      draggable={false}
      style={{ width, height }}
      className={`object-contain select-none pointer-events-none drop-shadow-[0_4px_6px_rgba(32,14,6,0.42)] ${className}`}
    />
  );
};

/**
 * Renders a photorealistic brimming stainless-steel prep tray fill
 * (directly modeled after Tondo Pizza's overhead metallic food trays!).
 */
export const ToppingTrayFill: React.FC<{ kind: StudioTopping['kind'] }> = ({ kind }) => {
  const spec = STUDIO_TOPPINGS.find((t) => t.kind === kind);
  if (!spec) return null;

  return (
    <div className="relative w-full h-16 rounded-lg overflow-hidden pointer-events-none select-none bg-[#E6DDD7]">
      <img
        src={spec.trayImage}
        alt={spec.name}
        draggable={false}
        className="w-full h-full object-cover scale-105"
      />
      {/* Realistic inset metallic bin rim depth shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 shadow-[inset_0_5px_10px_rgba(25,16,12,0.34),inset_0_-3px_6px_rgba(255,255,255,0.35)] rounded-lg"
      />
    </div>
  );
};
