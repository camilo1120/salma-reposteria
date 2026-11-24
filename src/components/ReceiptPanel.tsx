import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import {
  Download,
  MessageCircle,
  Trash2,
  Plus,
  Minus,
  Truck,
  Store,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  OrderItem,
  SALMA_CONTACT,
  buildWhatsAppUrl,
  formatCOP,
} from '../data/bakeryData';
import { soundFx } from '../utils/soundFx';

export interface LiveDraftSummary {
  title: string;
  subtitle: string;
  details: string[];
  unitPrice: number;
  bakeGrade?: string;
  cakeMessage?: string;
  referencePhotoDataUrl?: string | null;
  referencePhotoName?: string | null;
}

interface ReceiptPanelProps {
  orderNumber: string;
  items: OrderItem[];
  liveDraft?: LiveDraftSummary;
  deliveryMode: 'delivery' | 'pickup';
  customerName: string;
  customerNotes: string;
  onDeliveryModeChange: (mode: 'delivery' | 'pickup') => void;
  onCustomerNameChange: (val: string) => void;
  onCustomerNotesChange: (val: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onAddLiveDraft?: () => void;
  compact?: boolean;
}

export const ReceiptPanel: React.FC<ReceiptPanelProps> = ({
  orderNumber,
  items,
  liveDraft,
  deliveryMode,
  customerName,
  customerNotes,
  onDeliveryModeChange,
  onCustomerNameChange,
  onCustomerNotesChange,
  onUpdateQty,
  onRemoveItem,
  onAddLiveDraft,
  compact = false,
}) => {
  const receiptRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadedToast, setDownloadedToast] = useState(false);

  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const effectiveSubtotal =
    items.length > 0 ? itemsSubtotal : liveDraft ? liveDraft.unitPrice : 0;
  const deliveryCost =
    deliveryMode === 'delivery' && effectiveSubtotal > 0
      ? SALMA_CONTACT.deliveryFee
      : 0;
  const grandTotal = effectiveSubtotal + deliveryCost;

  const todayFormatted = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleDownloadPng = async () => {
    if (!receiptRef.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FFFEFC',
      });
      const link = document.createElement('a');
      link.download = `Factura-Salma-Reposteria-${orderNumber}.png`;
      link.href = dataUrl;
      link.click();
      soundFx.playSuccessChime();
      setDownloadedToast(true);
      setTimeout(() => setDownloadedToast(false), 3000);
    } catch {
      // Fallback gracefully if canvas taint occurs
    } finally {
      setDownloading(false);
    }
  };

  const handleSendWhatsApp = () => {
    const activeItems: Array<{
      title: string;
      subtitle: string;
      qty: number;
      price: number;
      details: string[];
      cakeMessage?: string;
      bakeGrade?: string;
      hasPhoto?: boolean;
    }> =
      items.length > 0
        ? items.map((i) => ({
            title: i.title,
            subtitle: i.subtitle,
            qty: i.quantity,
            price: i.unitPrice * i.quantity,
            details: i.details,
            cakeMessage: i.cakeMessage,
            bakeGrade: i.bakeGrade,
            hasPhoto: Boolean(i.referencePhotoDataUrl),
          }))
        : liveDraft
        ? [
            {
              title: liveDraft.title,
              subtitle: liveDraft.subtitle,
              qty: 1,
              price: liveDraft.unitPrice,
              details: liveDraft.details,
              cakeMessage: liveDraft.cakeMessage,
              bakeGrade: liveDraft.bakeGrade,
              hasPhoto: Boolean(liveDraft.referencePhotoDataUrl),
            },
          ]
        : [];

    const lines: string[] = [
      `🍪 *NUEVO PEDIDO — SALMA REPOSTERÍA*`,
      `🧾 Factura #${orderNumber} (${todayFormatted})`,
    ];

    if (customerName.trim()) {
      lines.push(`👤 Cliente: ${customerName.trim()}`);
    }
    lines.push(
      `🚚 Entrega: ${
        deliveryMode === 'delivery'
          ? 'Domicilio (Bucaramanga / Floridablanca)'
          : 'Recoger en taller'
      }`
    );
    if (customerNotes.trim()) {
      lines.push(`📍 Dirección / Nota: ${customerNotes.trim()}`);
    }

    lines.push('', '*Detalle del pedido:*');

    if (activeItems.length === 0) {
      lines.push('• Quisiera cotizar un pedido personalizado.');
    } else {
      activeItems.forEach((it, idx) => {
        lines.push(
          `${idx + 1}. *${it.qty}× ${it.title}* — ${formatCOP(it.price)}`
        );
        lines.push(`   _${it.subtitle}_`);
        if (it.details.length > 0) {
          lines.push(`   • ${it.details.join(' | ')}`);
        }
        if (it.cakeMessage) {
          lines.push(`   • Dedicatoria: "${it.cakeMessage}"`);
        }
        if (it.bakeGrade) {
          lines.push(`   • Punto de horno: ${it.bakeGrade}`);
        }
        if (it.hasPhoto) {
          lines.push(`   • 📸 *Adjunto foto de referencia del diseño aquí en el chat.*`);
        }
      });
    }

    lines.push('');
    if (deliveryCost > 0) {
      lines.push(`Domicilio: ${formatCOP(deliveryCost)}`);
    }
    lines.push(`💰 *TOTAL ESTIMADO: ${formatCOP(grandTotal)}*`);
    lines.push('', '¡Gracias Salma Repostería! ✨');

    soundFx.playSuccessChime();
    window.open(buildWhatsAppUrl(lines.join('\n')), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      {/* Top Serrated Receipt Edge */}
      <div className="receipt-zig-top w-full" />

      {/* Printable Thermal Receipt Body */}
      <div
        ref={receiptRef}
        className={`receipt-paper px-4 sm:px-5 py-5 text-[#2B1108] ${
          compact ? '' : 'border-x border-[#451E10]/8'
        }`}
      >
        {/* Header with Official SM Logo */}
        <div className="text-center pb-3.5 border-b-2 border-dashed border-[#451E10]/20">
          <img
            src="./images/logo-sm.png"
            alt="Salma Repostería"
            className="h-11 w-auto mx-auto object-contain mb-1.5"
          />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#451E10]">
            Salma Repostería Artesanal
          </p>
          <p className="font-mono text-[10px] text-[#451E10]/60 mt-0.5">
            Floridablanca · Bucaramanga
          </p>
          <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-[#451E10]/70 bg-[#FFF5EE] px-2.5 py-1 rounded-md">
            <span>ORDEN #{orderNumber}</span>
            <span>{todayFormatted}</span>
          </div>
        </div>

        {/* LIVE WORKBENCH PREVIEW (Updates instantaneously as user drops toppings!) */}
        {liveDraft && (
          <div className="py-3.5 border-b border-dashed border-[#451E10]/20">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#B74347]">
                <Sparkles className="w-3 h-3" />
                En tu mesa ahora
              </span>
              <span className="font-mono text-xs font-extrabold text-[#451E10]">
                {formatCOP(liveDraft.unitPrice)}
              </span>
            </div>

            <p className="text-xs font-extrabold text-[#451E10]">
              {liveDraft.title}
            </p>
            <p className="text-[11px] text-[#451E10]/70">{liveDraft.subtitle}</p>

            {liveDraft.details.length > 0 && (
              <ul className="mt-1.5 space-y-0.5 font-mono text-[10px] text-[#451E10]/80">
                {liveDraft.details.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-[#B74347]">+</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            )}

            {liveDraft.cakeMessage && (
              <p className="mt-1.5 text-[10px] font-mono bg-[#FFF1EC] text-[#B74347] px-2 py-1 rounded">
                Mensaje: &ldquo;{liveDraft.cakeMessage}&rdquo;
              </p>
            )}

            {liveDraft.bakeGrade && (
              <p className="mt-1.5 text-[10px] font-mono font-bold text-[#9A5B13] bg-[#FEF3C7] px-2 py-1 rounded">
                🔥 {liveDraft.bakeGrade}
              </p>
            )}

            {/* Embedded Reference Photo Preview on Live Receipt! */}
            {liveDraft.referencePhotoDataUrl && (
              <div className="mt-2 flex items-center gap-2.5 p-1.5 rounded-lg bg-[#FFF5EE] border border-[#B74347]/20">
                <img
                  src={liveDraft.referencePhotoDataUrl}
                  alt="Foto de diseño subida"
                  className="w-11 h-11 rounded-md object-cover border border-white shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-[#B74347] flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Foto de diseño cargada
                  </p>
                  <p className="text-[9px] font-mono text-[#451E10]/65 truncate">
                    {liveDraft.referencePhotoName || 'referencia-diseno.jpg'}
                  </p>
                </div>
              </div>
            )}

            {onAddLiveDraft && (
              <button
                type="button"
                onClick={onAddLiveDraft}
                className="mt-2.5 w-full py-2 px-3 rounded-xl bg-[#451E10] hover:bg-[#2B1108] text-[#FFF8F3] text-xs font-extrabold flex items-center justify-center gap-1.5 btn-tactile cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#FADAD3]" />
                <span>Agregar esta creación a la factura</span>
              </button>
            )}
          </div>
        )}

        {/* CONFIRMED ORDER ITEMS LIST */}
        <div className="py-3.5 border-b-2 border-dashed border-[#451E10]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#451E10]/65">
              Artículos en tu factura ({items.reduce((a, b) => a + b.quantity, 0)})
            </span>
          </div>

          {items.length === 0 ? (
            <p className="text-center font-mono text-[11px] text-[#451E10]/55 py-3">
              {liveDraft
                ? 'Aún no has sumado ítems fijos. Se cotiza tu creación actual arriba.'
                : 'Tu factura está vacía. ¡Agrega galletas o arma tu postre en la cocina!'}
            </p>
          ) : (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pb-2.5 border-b border-dotted border-[#451E10]/15 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#451E10] leading-tight">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#451E10]/65 leading-tight mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#451E10] shrink-0">
                        {formatCOP(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    {item.details.length > 0 && (
                      <p className="font-mono text-[10px] text-[#451E10]/70 mt-1 leading-snug">
                        {item.details.join(' · ')}
                      </p>
                    )}

                    {item.cakeMessage && (
                      <p className="font-mono text-[10px] text-[#B74347] mt-0.5">
                        Texto: &ldquo;{item.cakeMessage}&rdquo;
                      </p>
                    )}

                    {item.referencePhotoDataUrl && (
                      <div className="mt-1.5 flex items-center gap-2 bg-[#FFF5EE] p-1 rounded border border-[#451E10]/10">
                        <img
                          src={item.referencePhotoDataUrl}
                          alt="Referencia adjunta"
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="font-mono text-[9px] text-[#B74347] font-bold">
                          Diseño adjunto ✓
                        </span>
                      </div>
                    )}

                    {/* Quantity Controls */}
                    <div className="mt-1.5 flex items-center justify-between">
                      <div className="inline-flex items-center gap-1 bg-[#FFF5EE] rounded-lg p-0.5 border border-[#451E10]/10">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, -1)}
                          aria-label="Disminuir cantidad"
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-white text-[#451E10] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-[11px] font-bold px-1.5">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, 1)}
                          aria-label="Aumentar cantidad"
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-white text-[#451E10] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Eliminar artículo"
                        className="text-[#451E10]/45 hover:text-[#B74347] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Delivery vs Pickup Toggle */}
        <div className="py-3 border-b border-dashed border-[#451E10]/20 space-y-2.5">
          <div className="grid grid-cols-2 gap-1.5 bg-[#F7EEE8] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onDeliveryModeChange('delivery')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                deliveryMode === 'delivery'
                  ? 'bg-white text-[#451E10] shadow-xs'
                  : 'text-[#451E10]/65 hover:text-[#451E10]'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[#B74347]" />
              <span>Domicilio</span>
            </button>
            <button
              type="button"
              onClick={() => onDeliveryModeChange('pickup')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                deliveryMode === 'pickup'
                  ? 'bg-white text-[#451E10] shadow-xs'
                  : 'text-[#451E10]/65 hover:text-[#451E10]'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#B74347]" />
              <span>Recoger</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <input
              type="text"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Tu nombre (para la factura)"
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFF8F3] border border-[#451E10]/15 text-xs font-medium text-[#451E10] placeholder:text-[#451E10]/40 focus:outline-none focus:border-[#B74347]"
            />
            <input
              type="text"
              value={customerNotes}
              onChange={(e) => onCustomerNotesChange(e.target.value)}
              placeholder={
                deliveryMode === 'delivery'
                  ? 'Barrio / dirección (Ej: Cañaveral, Cabecera)'
                  : 'Día y hora aproximada para recoger'
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFF8F3] border border-[#451E10]/15 text-xs font-medium text-[#451E10] placeholder:text-[#451E10]/40 focus:outline-none focus:border-[#B74347]"
            />
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-3 space-y-1 font-mono text-xs">
          <div className="flex justify-between text-[#451E10]/70">
            <span>Subtotal</span>
            <span>{formatCOP(effectiveSubtotal)}</span>
          </div>
          <div className="flex justify-between text-[#451E10]/70">
            <span>{deliveryMode === 'delivery' ? 'Domicilio aprox.' : 'Recoger en taller'}</span>
            <span>{deliveryCost > 0 ? formatCOP(deliveryCost) : 'Gratis'}</span>
          </div>
          <div className="pt-2 mt-1 border-t border-[#451E10]/20 flex items-baseline justify-between">
            <span className="font-sans text-sm font-black text-[#451E10]">TOTAL</span>
            <motion.span
              key={grandTotal}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              className="text-xl font-black text-[#B74347]"
            >
              {formatCOP(grandTotal)}
            </motion.span>
          </div>
        </div>

        {/* Receipt Barcode Stamp Decoration */}
        <div className="mt-3 pt-2 border-t border-dotted border-[#451E10]/15 text-center">
          <div className="h-4 w-40 mx-auto opacity-30 bg-[repeating-linear-gradient(90deg,#2B1108_0,#2B1108_2px,transparent_2px,transparent_4px,#2B1108_4px,#2B1108_5px,transparent_5px,transparent_8px)]" />
          <p className="font-mono text-[9px] text-[#451E10]/55 mt-1">
            ¡GRACIAS POR ENDULZAR TU DÍA CON SALMA!
          </p>
        </div>
      </div>

      {/* Bottom Serrated Receipt Edge */}
      <div className="receipt-zig-bottom w-full" />

      {/* Action Buttons outside printable area for crisp export */}
      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={handleSendWhatsApp}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#B74347] hover:bg-[#962E32] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_12px_26px_-8px_rgba(183,67,71,0.55)] btn-tactile cursor-pointer"
        >
          <MessageCircle className="w-4.5 h-4.5" />
          <span>Enviar Pedido por WhatsApp</span>
        </button>

        <button
          type="button"
          disabled={downloading}
          onClick={handleDownloadPng}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FFF1EC] text-[#451E10] border border-[#451E10]/15 font-bold text-xs flex items-center justify-center gap-2 shadow-xs btn-tactile cursor-pointer"
        >
          {downloadedToast ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span className="text-[#15803D]">¡Factura descargada en PNG!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-[#B74347]" />
              <span>
                {downloading ? 'Generando imagen...' : 'Descargar Factura (PNG)'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
