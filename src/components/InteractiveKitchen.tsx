import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Flame,
  Sparkles,
  RotateCcw,
  Trash2,
  Shuffle,
  Volume2,
  VolumeX,
  Upload,
  X,
  Check,
  ChefHat,
  PackageCheck,
  Wand2,
  Plus,
} from 'lucide-react';
import {
  DessertMode,
  STUDIO_DOUGHS,
  STUDIO_FILLINGS,
  STUDIO_FROSTINGS,
  STUDIO_TOPPINGS,
  CAKE_SIZES,
  CUPCAKE_WRAPPERS,
  PlacedTopping,
  OrderItem,
  StudioTopping,
  CookieFlavor,
  formatCOP,
} from '../data/bakeryData';
import { DessertCanvas, CrumbBurst } from './DessertCanvas';
import { ToppingPieceSvg, ToppingTrayFill } from './ToppingGraphics';
import { ReceiptPanel, LiveDraftSummary } from './ReceiptPanel';
import { soundFx } from '../utils/soundFx';

type StationStep = 'build' | 'bake' | 'pack';

interface InteractiveKitchenProps {
  activeMode: DessertMode;
  onModeChange: (mode: DessertMode) => void;
  presetFlavor: CookieFlavor | null;
  onClearPreset: () => void;
  orderNumber: string;
  cartItems: OrderItem[];
  deliveryMode: 'delivery' | 'pickup';
  customerName: string;
  customerNotes: string;
  onDeliveryModeChange: (m: 'delivery' | 'pickup') => void;
  onCustomerNameChange: (v: string) => void;
  onCustomerNotesChange: (v: string) => void;
  onAddOrderItem: (item: OrderItem) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveOrderItem: (id: string) => void;
}

interface DragGhostState {
  topping: StudioTopping;
  clientX: number;
  clientY: number;
  startX: number;
  startY: number;
  hasMoved: boolean;
}

export const InteractiveKitchen: React.FC<InteractiveKitchenProps> = ({
  activeMode,
  onModeChange,
  presetFlavor,
  onClearPreset,
  orderNumber,
  cartItems,
  deliveryMode,
  customerName,
  customerNotes,
  onDeliveryModeChange,
  onCustomerNameChange,
  onCustomerNotesChange,
  onAddOrderItem,
  onUpdateQty,
  onRemoveOrderItem,
}) => {
  const [station, setStation] = useState<StationStep>('build');
  const [soundOn, setSoundOn] = useState(true);

  // Builder state
  const [baseId, setBaseId] = useState<string>(STUDIO_DOUGHS.cookie[0].id);
  const [fillingId, setFillingId] = useState<string>('none');
  const [frostingId, setFrostingId] = useState<string>('rosettes-arequipe');
  const [cupcakeWrapperId, setCupcakeWrapperId] = useState<string>('gingham');
  const [cakeSizeId, setCakeSizeId] = useState<string>('medium');
  const [cakeMessage, setCakeMessage] = useState<string>('');
  const [placedToppings, setPlacedToppings] = useState<PlacedTopping[]>([
    { uid: 'init-1', toppingId: 'choc-chunk', x: 35, y: 36, rotation: -18, scale: 1.05 },
    { uid: 'init-2', toppingId: 'white-chunk', x: 63, y: 58, rotation: 16, scale: 0.96 },
  ]);
  const [crumbBursts, setCrumbBursts] = useState<CrumbBurst[]>([]);

  // Reference Photo Upload State
  const [referencePhotoUrl, setReferencePhotoUrl] = useState<string | null>(null);
  const [referencePhotoName, setReferencePhotoName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Papa's Pizzeria Oven / Finishing Mini-Game State
  const [isOvenRunning, setIsOvenRunning] = useState(false);
  const [bakeProgress, setBakeProgress] = useState(0); // 0..100
  const [bakeResult, setBakeResult] = useState<{
    score: number;
    label: string;
    detail: string;
  } | null>(null);
  const ovenAnimRef = useRef<number | null>(null);
  const ovenDirectionRef = useRef<number>(1);

  // Pointer Drag & Drop State (works smoothly across Mouse & Touch!)
  const dropZoneRef = useRef<HTMLDivElement | null>(null);
  const [dragGhost, setDragGhost] = useState<DragGhostState | null>(null);
  const [isOverDropZone, setIsOverDropZone] = useState(false);

  // Sync sound preference
  useEffect(() => {
    soundFx.enabled = soundOn;
  }, [soundOn]);

  // Reset base selection cleanly when switching mode (Cookie / Cupcake / Cake)
  useEffect(() => {
    const modeBases = STUDIO_DOUGHS[activeMode];
    if (!modeBases.some((b) => b.id === baseId)) {
      setBaseId(modeBases[0].id);
    }
    // Filter placed toppings to ones supported by mode
    setPlacedToppings((prev) =>
      prev.filter((p) => {
        const spec = STUDIO_TOPPINGS.find((t) => t.id === p.toppingId);
        return spec?.modes.includes(activeMode);
      })
    );
    setStation('build');
    setBakeProgress(0);
    setBakeResult(null);
    setIsOvenRunning(false);
  }, [activeMode]);

  // Apply flavor preset when user clicks "Personalizar" on any of the 6 flavors
  useEffect(() => {
    if (!presetFlavor) return;
    onModeChange('cookie');
    setBaseId(presetFlavor.id);
    setFillingId(presetFlavor.defaultFilling);
    setStation('build');
    setBakeProgress(0);
    setBakeResult(null);
    const coords = [
      { x: 35, y: 35 },
      { x: 64, y: 38 },
      { x: 46, y: 65 },
      { x: 62, y: 63 },
    ];
    setPlacedToppings(
      presetFlavor.defaultToppings.map((tid, idx) => ({
        uid: `preset-${Date.now()}-${idx}`,
        toppingId: tid,
        x: coords[idx % coords.length].x,
        y: coords[idx % coords.length].y,
        rotation: (idx * 37 - 24) % 45,
        scale: 0.95 + (idx % 2) * 0.12,
      }))
    );
    onClearPreset();
  }, [presetFlavor, onModeChange, onClearPreset]);

  const activeBase =
    STUDIO_DOUGHS[activeMode].find((b) => b.id === baseId) ||
    STUDIO_DOUGHS[activeMode][0];
  const activeFilling =
    STUDIO_FILLINGS.find((f) => f.id === fillingId) || STUDIO_FILLINGS[0];
  const activeFrosting =
    STUDIO_FROSTINGS.find((f) => f.id === frostingId) || STUDIO_FROSTINGS[0];
  const activeCakeSize =
    CAKE_SIZES.find((s) => s.id === cakeSizeId) || CAKE_SIZES[1];
  const availableToppings = STUDIO_TOPPINGS.filter((t) =>
    t.modes.includes(activeMode)
  );

  // Trigger particle burst at drop point
  const spawnBurst = useCallback((x: number, y: number, color: string) => {
    const id = `burst-${Date.now()}-${Math.random()}`;
    setCrumbBursts((prev) => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setCrumbBursts((prev) => prev.filter((b) => b.id !== id));
    }, 520);
  }, []);

  // Place topping at explicit or balanced random coordinates
  const addToppingAt = useCallback(
    (topping: StudioTopping, xPct?: number, yPct?: number) => {
      // Keep inside circular dessert safe zone (20%..80%)
      let x = xPct;
      let y = yPct;
      if (x === undefined || y === undefined) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.random() * 25;
        x = 50 + Math.cos(angle) * radius;
        y = 50 + Math.sin(angle) * radius;
      } else {
        // Clamp radially to dessert disk so nothing floats outside the cookie/cake
        const dx = x - 50;
        const dy = y - 50;
        const dist = Math.hypot(dx, dy);
        const maxR = 36;
        if (dist > maxR) {
          x = 50 + (dx / dist) * maxR;
          y = 50 + (dy / dist) * maxR;
        }
      }

      const newPiece: PlacedTopping = {
        uid: `top-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        toppingId: topping.id,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        rotation: Math.round((Math.random() - 0.5) * 65),
        scale: 0.92 + Math.random() * 0.22,
      };

      setPlacedToppings((prev) => [...prev, newPiece]);
      spawnBurst(newPiece.x, newPiece.y, topping.color);
      if (topping.kind.startsWith('drizzle')) {
        soundFx.playSwirl();
      } else {
        soundFx.playPop(Math.floor(Math.random() * 5));
      }
    },
    [spawnBurst]
  );

  // Global Pointer Listeners for silky Drag-and-Drop (Mouse + Touch!)
  useEffect(() => {
    if (!dragGhost) return;

    const checkOverDropZone = (clientX: number, clientY: number) => {
      const rect = dropZoneRef.current?.getBoundingClientRect();
      if (!rect) return null;
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;
      return { inside, rect };
    };

    const handlePointerMove = (e: PointerEvent) => {
      const dist = Math.hypot(
        e.clientX - dragGhost.startX,
        e.clientY - dragGhost.startY
      );
      const moved = dragGhost.hasMoved || dist > 8;
      setDragGhost((prev) =>
        prev
          ? {
              ...prev,
              clientX: e.clientX,
              clientY: e.clientY,
              hasMoved: moved,
            }
          : null
      );
      if (moved) {
        const hit = checkOverDropZone(e.clientX, e.clientY);
        setIsOverDropZone(Boolean(hit?.inside));
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const hit = checkOverDropZone(e.clientX, e.clientY);
      if (!dragGhost.hasMoved) {
        // Quick tap/click -> instant scatter placement!
        addToppingAt(dragGhost.topping);
      } else if (hit?.inside && hit.rect) {
        // Dropped inside the bakery box -> compute exact % relative to dessert disk!
        const relX = ((e.clientX - hit.rect.left) / hit.rect.width) * 100;
        const relY = ((e.clientY - hit.rect.top) / hit.rect.height) * 100;
        // Dessert disk occupies inner 78% centered
        const diskX = ((relX - 11) / 78) * 100;
        const diskY = ((relY - 11) / 78) * 100;
        addToppingAt(dragGhost.topping, diskX, diskY);
      }
      setDragGhost(null);
      setIsOverDropZone(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragGhost, addToppingAt]);

  // Papa's Pizzeria Oven Meter Animation Loop!
  useEffect(() => {
    if (!isOvenRunning) {
      if (ovenAnimRef.current) cancelAnimationFrame(ovenAnimRef.current);
      return;
    }

    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setBakeProgress((prev) => {
        const speed = 44; // smooth readable glide
        let next = prev + ovenDirectionRef.current * speed * dt;
        if (next >= 100) {
          next = 100;
          ovenDirectionRef.current = -1;
        } else if (next <= 4) {
          next = 4;
          ovenDirectionRef.current = 1;
        }
        return next;
      });
      ovenAnimRef.current = requestAnimationFrame(tick);
    };

    ovenAnimRef.current = requestAnimationFrame(tick);
    return () => {
      if (ovenAnimRef.current) cancelAnimationFrame(ovenAnimRef.current);
    };
  }, [isOvenRunning]);

  const startOvenMiniGame = () => {
    setStation('bake');
    setBakeProgress(6);
    ovenDirectionRef.current = 1;
    setBakeResult(null);
    setIsOvenRunning(true);
    soundFx.playSwirl();
  };

  const stopOvenAndGrade = () => {
    setIsOvenRunning(false);
    soundFx.playOvenDing();
    const p = bakeProgress;
    let score = 88;
    let label = 'Suave & Cremosa';
    let detail = 'Textura extra blandita estilo New York.';

    if (p >= 56 && p <= 78) {
      score = 100;
      label =
        activeMode === 'cookie'
          ? '¡Centro Fundido Perfecto!'
          : '¡Acabado Maestro Salma!';
      detail =
        activeMode === 'cookie'
          ? 'Borde doradito crujiente y corazón derretido nivel chef.'
          : 'Esponjosidad y decoración dignas de vitrina.';
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#B74347', '#FADAD3', '#451E10', '#E8B852'],
      });
    } else if (p > 78) {
      score = 93;
      label =
        activeMode === 'cookie' ? 'Doradita & Extra Crunch' : 'Tostado Artesanal';
      detail = 'Borde súper crocante con aroma caramelizado.';
    } else if (p < 35) {
      score = 84;
      label = 'Extra Suave';
      detail = 'Muy tierna y húmeda, ideal para comer tibia.';
    }

    setBakeResult({ score, label, detail });
  };

  // Reference Photo Handler (Upload from PC or Mobile gallery)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReferencePhotoUrl(reader.result);
        setReferencePhotoName(file.name);
        soundFx.playPop(4);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRandomChef = () => {
    const bases = STUDIO_DOUGHS[activeMode];
    const randBase = bases[Math.floor(Math.random() * bases.length)];
    const randFilling =
      STUDIO_FILLINGS[Math.floor(Math.random() * STUDIO_FILLINGS.length)];
    setBaseId(randBase.id);
    setFillingId(randFilling.id);
    if (activeMode !== 'cookie') {
      const randFrost =
        STUDIO_FROSTINGS[Math.floor(Math.random() * STUDIO_FROSTINGS.length)];
      setFrostingId(randFrost.id);
    }
    const nextToppings: PlacedTopping[] = [];
    for (let i = 0; i < 5; i++) {
      const t =
        availableToppings[Math.floor(Math.random() * availableToppings.length)];
      const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.4;
      const rad = 14 + Math.random() * 18;
      nextToppings.push({
        uid: `rand-${Date.now()}-${i}`,
        toppingId: t.id,
        x: 50 + Math.cos(angle) * rad,
        y: 50 + Math.sin(angle) * rad,
        rotation: Math.round((Math.random() - 0.5) * 60),
        scale: 0.95 + Math.random() * 0.18,
      });
    }
    setPlacedToppings(nextToppings);
    soundFx.playSuccessChime();
  };

  // Compute live price & structured receipt draft
  const toppingsGrouped = placedToppings.reduce<
    Record<string, { name: string; count: number; unitPrice: number }>
  >((acc, piece) => {
    const spec = STUDIO_TOPPINGS.find((t) => t.id === piece.toppingId);
    if (!spec) return acc;
    if (!acc[spec.id]) {
      acc[spec.id] = { name: spec.name, count: 0, unitPrice: spec.price };
    }
    acc[spec.id].count += 1;
    return acc;
  }, {});

  // Fair bakery pricing: first 2 toppings included in cookie/cupcake, extras priced cleanly
  const uniqueToppingEntries = Object.values(toppingsGrouped);
  const toppingExtraPrice = uniqueToppingEntries.reduce(
    (sum, t) => sum + t.unitPrice,
    0
  );

  const liveUnitPrice =
    (activeMode === 'cake' ? activeCakeSize.price : 0) +
    activeBase.price +
    activeFilling.price +
    (activeMode !== 'cookie' ? activeFrosting.price : 0) +
    toppingExtraPrice;

  const liveDetails: string[] = [];
  if (activeFilling.id !== 'none') {
    liveDetails.push(
      `Relleno: ${activeFilling.name} (+${formatCOP(activeFilling.price)})`
    );
  }
  if (activeMode !== 'cookie') {
    liveDetails.push(
      `Cobertura: ${activeFrosting.name}${
        activeFrosting.price > 0 ? ` (+${formatCOP(activeFrosting.price)})` : ''
      }`
    );
  }
  uniqueToppingEntries.forEach((t) => {
    liveDetails.push(`${t.name} ×${t.count} (+${formatCOP(t.unitPrice)})`);
  });

  const liveDraft: LiveDraftSummary = {
    title:
      activeMode === 'cookie'
        ? `Galleta Personalizada (${activeBase.name})`
        : activeMode === 'cupcake'
        ? `Cupcake Artesanal (${activeBase.name})`
        : `${activeCakeSize.name} (${activeBase.name})`,
    subtitle:
      activeMode === 'cake'
        ? `${activeCakeSize.portions} · Diseño sobre pedido`
        : activeMode === 'cupcake'
        ? `Capacillo ${
            CUPCAKE_WRAPPERS.find((w) => w.id === cupcakeWrapperId)?.name || 'Salma'
          }`
        : 'Masa horneada estilo NY · Centro suave',
    details: liveDetails,
    unitPrice: liveUnitPrice,
    bakeGrade: bakeResult ? `${bakeResult.score}% ${bakeResult.label}` : undefined,
    cakeMessage: activeMode === 'cake' && cakeMessage.trim() ? cakeMessage.trim() : undefined,
    referencePhotoDataUrl: referencePhotoUrl,
    referencePhotoName: referencePhotoName,
  };

  const handleAddCreationToReceipt = () => {
    onAddOrderItem({
      id: `${activeMode}-${Date.now()}`,
      category: activeMode,
      title: liveDraft.title,
      subtitle: liveDraft.subtitle,
      details: [...liveDraft.details],
      unitPrice: liveDraft.unitPrice,
      quantity: 1,
      bakeGrade: liveDraft.bakeGrade,
      cakeMessage: liveDraft.cakeMessage,
      referencePhotoDataUrl: referencePhotoUrl || undefined,
      referencePhotoName: referencePhotoName || undefined,
    });
    soundFx.playReceiptPrint();
    confetti({
      particleCount: 36,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#B74347', '#FADAD3', '#451E10'],
    });
    setStation('pack');
  };

  return (
    <section
      id="cocina-interactiva"
      className="py-14 sm:py-20 relative overflow-hidden border-y border-[#451E10]/12"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255,248,243,0.48) 0%, rgba(246,243,240,0.34) 50%, rgba(255,248,243,0.52) 100%), url('./images/kitchen-counter.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-[1380px] mx-auto px-3 sm:px-6 lg:px-8 relative">
        {/* Top Studio Header + Mode Selector + Papa's Pizzeria Station Stepper */}
        <div className="bg-[#FFFDFB]/92 backdrop-blur-md rounded-[28px] border border-[#451E10]/12 shadow-[0_14px_34px_-14px_rgba(43,17,8,0.18)] p-4 sm:p-5 mb-6">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            {/* Brand + Title */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FADAD3]/80 border border-[#B74347]/20 flex items-center justify-center shrink-0">
                <ChefHat className="w-6 h-6 text-[#B74347]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B74347]">
                    Salma Bakeria Interactiva
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#451E10] text-[#FADAD3] text-[10px] font-extrabold">
                    Estilo Papa&apos;s Pizzeria
                  </span>
                </div>
                <h2
                  className="text-xl sm:text-2xl lg:text-[26px] font-black text-[#451E10] leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Arma tu Galleta, Cupcake o Pastel y genera tu Factura en vivo
                </h2>
              </div>
            </div>

            {/* 3 Dessert Mode Switcher + Sound Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex p-1 rounded-2xl bg-[#F4EAE4] border border-[#451E10]/10">
                {(
                  [
                    { id: 'cookie', emoji: '🍪', label: 'Galleta' },
                    { id: 'cupcake', emoji: '🧁', label: 'Cupcake' },
                    { id: 'cake', emoji: '🎂', label: 'Pastel' },
                  ] as const
                ).map((tab) => {
                  const active = activeMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        soundFx.playPop(2);
                        onModeChange(tab.id);
                      }}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                        active
                          ? 'bg-[#451E10] text-[#FFF8F3] shadow-md'
                          : 'text-[#451E10]/75 hover:text-[#451E10]'
                      }`}
                    >
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setSoundOn((v) => !v)}
                aria-label={soundOn ? 'Silenciar sonidos' : 'Activar sonidos'}
                title={soundOn ? 'Sonidos activos' : 'Sonidos silenciados'}
                className="p-2.5 rounded-xl bg-white border border-[#451E10]/12 text-[#451E10] hover:bg-[#FFF1EC] cursor-pointer btn-tactile"
              >
                {soundOn ? (
                  <Volume2 className="w-4 h-4 text-[#B74347]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#451E10]/45" />
                )}
              </button>
            </div>
          </div>

          {/* Papa's Pizzeria 3-Station Game Bar */}
          <div className="mt-4 pt-3.5 border-t border-[#451E10]/8 grid grid-cols-3 gap-2">
            {(
              [
                {
                  id: 'build' as StationStep,
                  num: '1',
                  shortLabel: 'Armar',
                  label: 'Estación Armar',
                  sub: 'Masa, toppings y foto',
                  icon: Wand2,
                },
                {
                  id: 'bake' as StationStep,
                  num: '2',
                  shortLabel: activeMode === 'cookie' ? 'Horno' : 'Acabado',
                  label: activeMode === 'cookie' ? 'Estación Horno' : 'Estación Acabado',
                  sub: activeMode === 'cookie' ? 'Punto centro fundido' : 'Toque maestro Salma',
                  icon: Flame,
                },
                {
                  id: 'pack' as StationStep,
                  num: '3',
                  shortLabel: 'Empacar',
                  label: 'Empacar & Factura',
                  sub: 'Listo para WhatsApp',
                  icon: PackageCheck,
                },
              ] as const
            ).map((st) => {
              const Icon = st.icon;
              const isCurrent = station === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    if (st.id === 'bake') {
                      startOvenMiniGame();
                    } else {
                      setIsOvenRunning(false);
                      setStation(st.id);
                    }
                  }}
                  className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-3 px-2 sm:px-3 py-2.5 rounded-2xl text-left border transition-all cursor-pointer btn-tactile ${
                    isCurrent
                      ? 'bg-[#B74347] text-white border-[#B74347] shadow-[0_10px_20px_-8px_rgba(183,67,71,0.55)]'
                      : 'bg-white/85 text-[#451E10] border-[#451E10]/10 hover:bg-[#FFF1EC]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${
                      isCurrent
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FADAD3]/80 text-[#451E10]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-sm font-extrabold truncate">
                      <span className="sm:hidden">{st.num}. {st.shortLabel}</span>
                      <span className="hidden sm:inline">{st.num}. {st.label}</span>
                    </p>
                    <p
                      className={`hidden sm:block text-[11px] truncate ${
                        isCurrent ? 'text-white/85' : 'text-[#451E10]/60'
                      }`}
                    >
                      {st.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN 3-COLUMN WORKBENCH (TONDO PIZZA INSPIRED LAYOUT!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ==================== LEFT PANEL: BASE + STAINLESS-STEEL TOPPING TRAYS ==================== */}
          <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            {/* Step A: Base / Size / Filling Card */}
            <div className="bg-[#FFFDFB]/94 backdrop-blur-md rounded-[26px] border border-[#451E10]/12 shadow-md p-4 sm:p-5 space-y-4">
              {/* Cake Size Selector (only in Cake Mode) */}
              {activeMode === 'cake' && (
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#451E10]/65 mb-2">
                    Tamaño del Pastel
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {CAKE_SIZES.map((sz) => (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => {
                          soundFx.playPop(1);
                          setCakeSizeId(sz.id);
                        }}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer btn-tactile ${
                          cakeSizeId === sz.id
                            ? 'bg-[#451E10] text-white border-[#451E10] shadow-sm'
                            : 'bg-white text-[#451E10] border-[#451E10]/12 hover:bg-[#FFF1EC]'
                        }`}
                      >
                        <p className="text-[11px] font-extrabold leading-tight">
                          {sz.name.replace('Torta ', '')}
                        </p>
                        <p
                          className={`text-[10px] font-mono mt-0.5 ${
                            cakeSizeId === sz.id ? 'text-[#FADAD3]' : 'text-[#B74347]'
                          }`}
                        >
                          {formatCOP(sz.price)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dough / Sponge Selector */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#451E10]/65 mb-2">
                  {activeMode === 'cookie'
                    ? '1. Elige la masa de tu galleta'
                    : activeMode === 'cupcake'
                    ? '1. Elige el ponqué'
                    : '1. Elige el bizcocho'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STUDIO_DOUGHS[activeMode].map((dough) => {
                    const selected = baseId === dough.id;
                    return (
                      <button
                        key={dough.id}
                        type="button"
                        onClick={() => {
                          soundFx.playPop(2);
                          setBaseId(dough.id);
                        }}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer btn-tactile ${
                          selected
                            ? 'bg-[#FFF1EC] border-[#B74347] ring-1 ring-[#B74347]'
                            : 'bg-white border-[#451E10]/10 hover:border-[#451E10]/30'
                        }`}
                      >
                        <img
                          src={dough.image}
                          alt={dough.name}
                          className="w-9 h-9 rounded-full shrink-0 object-contain bg-[#FFF8F3] p-0.5 border border-[#451E10]/10 shadow-xs"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-[#451E10] truncate">
                            {dough.name}
                          </p>
                          <p className="text-[10px] text-[#451E10]/60 truncate">
                            {dough.price > 0 ? formatCOP(dough.price) : 'Incluido'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cupcake Wrapper Picker */}
              {activeMode === 'cupcake' && (
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#451E10]/65 mb-2">
                    Capacillo (Papel)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CUPCAKE_WRAPPERS.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => {
                          soundFx.playPop(1);
                          setCupcakeWrapperId(w.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer btn-tactile ${
                          cupcakeWrapperId === w.id
                            ? 'bg-[#451E10] text-white border-[#451E10]'
                            : 'bg-white text-[#451E10] border-[#451E10]/12'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/60"
                          style={{ backgroundColor: w.color }}
                        />
                        <span>{w.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Frosting Picker (Cupcake & Cake) */}
              {activeMode !== 'cookie' && (
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#451E10]/65 mb-2">
                    2. Cobertura / Manga Pastelera
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {STUDIO_FROSTINGS.map((fr) => (
                      <button
                        key={fr.id}
                        type="button"
                        onClick={() => {
                          soundFx.playSwirl();
                          setFrostingId(fr.id);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer btn-tactile ${
                          frostingId === fr.id
                            ? 'bg-[#FFF1EC] border-[#B74347] text-[#451E10]'
                            : 'bg-white border-[#451E10]/10 text-[#451E10]/80 hover:bg-[#FFF8F3]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-[#451E10]/20"
                            style={{ backgroundColor: fr.accentColor || fr.color }}
                          />
                          <span>{fr.name}</span>
                        </span>
                        <span className="font-mono text-[11px] text-[#B74347]">
                          {fr.price > 0 ? `+${formatCOP(fr.price)}` : 'Incluido'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Molten Filling Selector */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#451E10]/65 mb-2">
                  {activeMode === 'cookie' ? '2. Centro fundido' : '3. Relleno interior'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STUDIO_FILLINGS.map((f) => {
                    const selected = fillingId === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          soundFx.playSwirl();
                          setFillingId(f.id);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer btn-tactile ${
                          selected
                            ? 'bg-[#451E10] text-white border-[#451E10]'
                            : 'bg-white text-[#451E10] border-[#451E10]/12 hover:bg-[#FFF1EC]'
                        }`}
                      >
                        {f.name}
                        {f.price > 0 && (
                          <span className="ml-1 opacity-75 font-mono">
                            +${f.price / 1000}k
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step B: STAINLESS-STEEL PREP TRAYS (Drag onto dessert OR Tap!) */}
            <div className="bg-[#FFFDFB]/94 backdrop-blur-md rounded-[26px] border border-[#451E10]/12 shadow-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-black text-[#451E10]">
                    Hazlo tuyo · Bandejas
                  </h3>
                  <p className="text-[11px] text-[#451E10]/65 font-medium">
                    Arrastra al postre o toca para espolvorear
                  </p>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full bg-[#FADAD3]/80 text-[#451E10]">
                  Drag &amp; Tap
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5">
                {availableToppings.map((topping) => {
                  const count = placedToppings.filter(
                    (p) => p.toppingId === topping.id
                  ).length;

                  return (
                    <div
                      key={topping.id}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          addToppingAt(topping);
                        }
                      }}
                      onPointerDown={(e) => {
                        if (e.button !== 0 && e.pointerType === 'mouse') return;
                        e.currentTarget.releasePointerCapture?.(e.pointerId);
                        setDragGhost({
                          topping,
                          clientX: e.clientX,
                          clientY: e.clientY,
                          startX: e.clientX,
                          startY: e.clientY,
                          hasMoved: false,
                        });
                      }}
                      className="steel-tray rounded-2xl p-1.5 cursor-grab active:cursor-grabbing select-none touch-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="steel-tray-well rounded-xl p-1.5 relative">
                        <ToppingTrayFill kind={topping.kind} />
                        <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#451E10] text-white text-[10px] font-black flex items-center justify-center shadow">
                          {count > 0 ? count : <Plus className="w-3 h-3" />}
                        </span>
                      </div>
                      <div className="mt-1.5 px-1 flex items-center justify-between gap-1">
                        <span className="text-[11px] font-extrabold text-[#2B1108] truncate">
                          {topping.name}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-[#962E32] shrink-0">
                          +{formatCOP(topping.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step C: UPLOAD REFERENCE PHOTO OF DESIGN (Loads onto Polaroid + Invoice!) */}
            <div className="bg-[#FFFDFB]/94 backdrop-blur-md rounded-[26px] border border-[#B74347]/25 shadow-md p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-black text-[#451E10] flex items-center gap-1.5">
                    <span>📸 Foto de tu Diseño</span>
                  </h3>
                  <p className="text-[11px] text-[#451E10]/70">
                    Sube una imagen de inspiración y se adjunta directo en tu factura.
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {referencePhotoUrl ? (
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FFF1EC] border border-[#B74347]/25">
                  <img
                    src={referencePhotoUrl}
                    alt="Vista previa diseño"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-[#451E10] truncate">
                      {referencePhotoName}
                    </p>
                    <p className="text-[11px] font-bold text-[#15803D] flex items-center gap-1 mt-0.5">
                      <Check className="w-3.5 h-3.5" /> Cargada en tu factura
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-bold text-[#B74347] hover:underline mt-0.5 cursor-pointer"
                    >
                      Cambiar foto
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReferencePhotoUrl(null);
                      setReferencePhotoName(null);
                    }}
                    aria-label="Quitar foto"
                    className="p-1.5 rounded-full bg-white text-[#451E10]/70 hover:text-[#B74347] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-[#B74347]/40 bg-[#FFF8F3] hover:bg-[#FFF1EC] transition-colors flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer btn-tactile"
                >
                  <div className="w-9 h-9 rounded-full bg-[#FADAD3]/80 text-[#B74347] flex items-center justify-center">
                    <Upload className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-extrabold text-[#451E10]">
                    Subir foto del diseño (Pastel, Cupcake o Galleta)
                  </span>
                  <span className="text-[10px] text-[#451E10]/55">
                    PNG, JPG o foto desde tu celular
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ==================== CENTER STAGE: INTERACTIVE BOX + PAPA'S OVEN MINI-GAME ==================== */}
          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2 lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {/* STATION 1: BUILD & DECORATE */}
              {station === 'build' && (
                <motion.div
                  key="station-build"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  <DessertCanvas
                    mode={activeMode}
                    base={activeBase}
                    filling={activeFilling}
                    frosting={activeFrosting}
                    cupcakeWrapperId={cupcakeWrapperId}
                    cakeSize={activeCakeSize}
                    cakeMessage={cakeMessage}
                    placedToppings={placedToppings}
                    bakeProgress={bakeProgress}
                    isBaked={Boolean(bakeResult)}
                    isDropTargetActive={isOverDropZone}
                    referencePhotoUrl={referencePhotoUrl}
                    crumbBursts={crumbBursts}
                    dropZoneRef={dropZoneRef}
                    onRemoveTopping={(uid) => {
                      soundFx.playPop(-2);
                      setPlacedToppings((prev) => prev.filter((p) => p.uid !== uid));
                    }}
                  />

                  {/* Cake Dedication Input (shown live on top of cake!) */}
                  {activeMode === 'cake' && (
                    <div className="max-w-[430px] mx-auto bg-white/95 rounded-2xl border border-[#451E10]/12 p-3 shadow-sm">
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#B74347] mb-1.5">
                        ✍️ Dedicatoria escrita en crema (en vivo sobre tu torta)
                      </label>
                      <input
                        type="text"
                        maxLength={28}
                        value={cakeMessage}
                        onChange={(e) => setCakeMessage(e.target.value)}
                        placeholder="Ej: Feliz Cumpleaños Mamá"
                        className="w-full px-3 py-2 rounded-xl bg-[#FFF8F3] border border-[#451E10]/15 text-sm font-bold text-[#451E10] focus:outline-none focus:border-[#B74347]"
                      />
                    </div>
                  )}

                  {/* Quick Workbench Action Bar */}
                  <div className="max-w-[430px] mx-auto flex flex-wrap items-center justify-between gap-2 bg-[#FFFDFB]/92 backdrop-blur-md rounded-2xl p-2.5 border border-[#451E10]/10 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setPlacedToppings((prev) => prev.slice(0, -1))
                        }
                        disabled={placedToppings.length === 0}
                        title="Deshacer último topping"
                        className="px-2.5 py-2 rounded-xl bg-white border border-[#451E10]/12 text-xs font-bold text-[#451E10] hover:bg-[#FFF1EC] disabled:opacity-40 flex items-center gap-1 cursor-pointer btn-tactile"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Deshacer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlacedToppings([])}
                        disabled={placedToppings.length === 0}
                        title="Limpiar toppings"
                        className="px-2.5 py-2 rounded-xl bg-white border border-[#451E10]/12 text-xs font-bold text-[#451E10] hover:bg-[#FFF1EC] disabled:opacity-40 flex items-center gap-1 cursor-pointer btn-tactile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleRandomChef}
                        className="px-3 py-2 rounded-xl bg-[#FADAD3]/80 hover:bg-[#FADAD3] text-xs font-extrabold text-[#451E10] flex items-center gap-1 cursor-pointer btn-tactile"
                      >
                        <Shuffle className="w-3.5 h-3.5 text-[#B74347]" />
                        <span>Sorpréndeme</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={startOvenMiniGame}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#B74347] hover:bg-[#962E32] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-md btn-tactile cursor-pointer"
                    >
                      <Flame className="w-4 h-4" />
                      <span>
                        {activeMode === 'cookie'
                          ? 'Hornear Ahora'
                          : 'Toque Maestro'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STATION 2: PAPA'S PIZZERIA OVEN / FINISHING TIMING MINI-GAME */}
              {station === 'bake' && (
                <motion.div
                  key="station-bake"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.24 }}
                  className="max-w-[440px] mx-auto bg-[#2B1108] text-[#FFF8F3] rounded-[30px] p-5 sm:p-6 shadow-[0_28px_56px_-14px_rgba(43,17,8,0.52)] border-4 border-[#451E10] space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FADAD3]">
                        {activeMode === 'cookie'
                          ? 'Estación de Horno · Papa’s Mode'
                          : 'Estación de Acabado Artesanal'}
                      </span>
                      <h3
                        className="text-xl sm:text-2xl font-black text-white"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {activeMode === 'cookie'
                          ? '¡Sácala en el punto perfecto!'
                          : '¡Detén el acabado en la zona dorada!'}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#B74347] font-mono text-xs font-extrabold">
                      185°C
                    </span>
                  </div>

                  {/* Animated Glowing Oven Glass Chamber */}
                  <div className="relative rounded-2xl overflow-hidden bg-[#1D0B05] border-2 border-[#6B3720] p-4">
                    <div
                      className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,148,54,0.42),transparent_72%)] ${
                        isOvenRunning ? 'animate-oven-glow' : ''
                      }`}
                    />
                    <div className="relative scale-[0.88]">
                      <DessertCanvas
                        mode={activeMode}
                        base={activeBase}
                        filling={activeFilling}
                        frosting={activeFrosting}
                        cupcakeWrapperId={cupcakeWrapperId}
                        cakeSize={activeCakeSize}
                        cakeMessage={cakeMessage}
                        placedToppings={placedToppings}
                        bakeProgress={bakeProgress}
                        isBaked={Boolean(bakeResult)}
                        isDropTargetActive={false}
                        referencePhotoUrl={null}
                        crumbBursts={[]}
                        dropZoneRef={dropZoneRef}
                        onRemoveTopping={() => {}}
                      />
                    </div>
                  </div>

                  {/* Papa's Pizzeria Timing Gauge */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#FADAD3]/80">
                      <span>Suave</span>
                      <span className="text-[#F5C55B]">✨ Punto Perfecto ✨</span>
                      <span>Crujiente</span>
                    </div>

                    <div className="relative h-7 rounded-full bg-white/10 border border-white/15 overflow-hidden p-1">
                      {/* Sweet spot golden band (56% - 78%) */}
                      <div
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-[#E59E3A]/60 via-[#F8D06B]/85 to-[#E59E3A]/60 border-x border-[#FFF4C4]"
                        style={{ left: '56%', width: '22%' }}
                      />
                      {/* Moving progress fill */}
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FADAD3] via-[#E59E3A] to-[#B74347]"
                        style={{ width: `${Math.max(5, bakeProgress)}%` }}
                      />
                      {/* Crisp Indicator Needle */}
                      <div
                        className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_12px_#FFFFFF] rounded-full"
                        style={{ left: `calc(${bakeProgress}% - 3px)` }}
                      />
                    </div>
                  </div>

                  {/* Oven Controls / Result */}
                  {isOvenRunning ? (
                    <button
                      type="button"
                      onClick={stopOvenAndGrade}
                      className="w-full py-4 rounded-2xl bg-[#F5C55B] hover:bg-[#FFD675] text-[#2B1108] font-black text-base shadow-[0_12px_28px_rgba(245,197,91,0.35)] flex items-center justify-center gap-2 btn-tactile cursor-pointer"
                    >
                      <Flame className="w-5 h-5" />
                      <span>
                        {activeMode === 'cookie'
                          ? '¡SACAR DEL HORNO AHORA!'
                          : '¡SELLAR ACABADO PERFECTO!'}
                      </span>
                    </button>
                  ) : bakeResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="rounded-2xl bg-white/10 border border-[#F5C55B]/40 p-4 flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-[#F5C55B] text-[#2B1108] flex flex-col items-center justify-center shrink-0 font-black">
                          <span className="text-lg leading-none">
                            {bakeResult.score}%
                          </span>
                          <span className="text-[9px] uppercase">Chef</span>
                        </div>
                        <div>
                          <p className="text-base font-black text-[#F5C55B]">
                            {bakeResult.label}
                          </p>
                          <p className="text-xs text-[#FFF8F3]/80">
                            {bakeResult.detail}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={startOvenMiniGame}
                          className="py-3 px-3 rounded-xl bg-white/12 hover:bg-white/20 text-white text-xs font-extrabold cursor-pointer btn-tactile"
                        >
                          Intentar de nuevo
                        </button>
                        <button
                          type="button"
                          onClick={handleAddCreationToReceipt}
                          className="py-3 px-3 rounded-xl bg-[#B74347] hover:bg-[#962E32] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer btn-tactile"
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>Empacar y Facturar</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </motion.div>
              )}

              {/* STATION 3: PACKED & ADDED TO INVOICE */}
              {station === 'pack' && (
                <motion.div
                  key="station-pack"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="max-w-[440px] mx-auto bg-[#FFFDFB] rounded-[30px] p-6 border-2 border-[#B74347]/25 shadow-xl text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-[#E5F9EC] text-[#15803D] mx-auto flex items-center justify-center">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#B74347]">
                      ¡Agregado a tu factura Salma!
                    </span>
                    <h3
                      className="text-2xl font-black text-[#451E10] mt-1"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      ¡Tu postre quedó increíble!
                    </h3>
                    <p className="text-sm text-[#451E10]/75 mt-1">
                      Ya aparece desglosado en tu factura térmica a la derecha. Puedes
                      enviar tu pedido por WhatsApp, descargar la factura en PNG o crear
                      otro postre.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FFF8F3] p-4 border border-[#451E10]/10 text-left space-y-1.5">
                    <p className="text-xs font-extrabold text-[#451E10]">
                      {liveDraft.title}
                    </p>
                    <p className="text-xs text-[#451E10]/70">{liveDraft.subtitle}</p>
                    {liveDraft.bakeGrade && (
                      <p className="text-xs font-bold text-[#9A5B13]">
                        🔥 {liveDraft.bakeGrade}
                      </p>
                    )}
                    <p className="font-mono text-sm font-black text-[#B74347] pt-1">
                      {formatCOP(liveDraft.unitPrice)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setStation('build');
                        setBakeProgress(0);
                        setBakeResult(null);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#451E10] hover:bg-[#2B1108] text-white text-xs sm:text-sm font-extrabold cursor-pointer btn-tactile"
                    >
                      Seguir Personalizando
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextMode: DessertMode =
                          activeMode === 'cookie'
                            ? 'cupcake'
                            : activeMode === 'cupcake'
                            ? 'cake'
                            : 'cookie';
                        onModeChange(nextMode);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#FADAD3] hover:bg-[#F5C6BC] text-[#451E10] text-xs sm:text-sm font-extrabold cursor-pointer btn-tactile"
                    >
                      Probar otro Postre →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ==================== RIGHT PANEL: LIVE THERMAL RECEIPT ==================== */}
          <div className="lg:col-span-3 order-3 lg:sticky lg:top-24">
            <ReceiptPanel
              orderNumber={orderNumber}
              items={cartItems}
              liveDraft={liveDraft}
              deliveryMode={deliveryMode}
              customerName={customerName}
              customerNotes={customerNotes}
              onDeliveryModeChange={onDeliveryModeChange}
              onCustomerNameChange={onCustomerNameChange}
              onCustomerNotesChange={onCustomerNotesChange}
              onUpdateQty={onUpdateQty}
              onRemoveItem={onRemoveOrderItem}
              onAddLiveDraft={handleAddCreationToReceipt}
            />
          </div>
        </div>
      </div>

      {/* FLOATING DRAG GHOST (Follows cursor / finger smoothly across the entire screen!) */}
      {dragGhost && dragGhost.hasMoved && (
        <div
          className="fixed z-[100] pointer-events-none -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_14px_20px_rgba(43,17,8,0.38)]"
          style={{
            left: dragGhost.clientX,
            top: dragGhost.clientY,
          }}
        >
          <div className="scale-125">
            <ToppingPieceSvg kind={dragGhost.topping.kind} size={46} />
          </div>
        </div>
      )}
    </section>
  );
};
