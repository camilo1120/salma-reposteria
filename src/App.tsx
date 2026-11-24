import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ReceiptText } from 'lucide-react';
import {
  CookieFlavor,
  DessertMode,
  OrderItem,
  SALMA_CONTACT,
} from './data/bakeryData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { FlavorsSection } from './components/FlavorsSection';
import { InteractiveKitchen } from './components/InteractiveKitchen';
import { PricingBoxesSection } from './components/PricingBoxesSection';
import { CravingsSection } from './components/CravingsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { ReceiptPanel } from './components/ReceiptPanel';
import { soundFx } from './utils/soundFx';

export default function App() {
  const [orderNumber] = useState(
    () => `SM-${Math.floor(1000 + Math.random() * 8999)}`
  );
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [receiptDrawerOpen, setReceiptDrawerOpen] = useState(false);

  // Shared invoice delivery / client info
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Interactive kitchen control state
  const [kitchenMode, setKitchenMode] = useState<DessertMode>('cookie');
  const [presetFlavor, setPresetFlavor] = useState<CookieFlavor | null>(null);

  // Toast notification state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMsg(message);
    window.clearTimeout((window as unknown as { __salmaToast?: number }).__salmaToast);
    (window as unknown as { __salmaToast?: number }).__salmaToast = window.setTimeout(
      () => setToastMsg(null),
      3200
    );
  }, []);

  const handleAddOrderItem = useCallback(
    (newItem: OrderItem) => {
      setCartItems((prev) => {
        // Merge identical standard items without custom photo/message
        if (
          !newItem.referencePhotoDataUrl &&
          !newItem.cakeMessage &&
          !newItem.bakeGrade &&
          (newItem.category === 'cuchareable' || newItem.subtitle === 'Galleta individual clásica')
        ) {
          const existing = prev.find(
            (i) => i.title === newItem.title && i.subtitle === newItem.subtitle
          );
          if (existing) {
            return prev.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
            );
          }
        }
        return [newItem, ...prev];
      });
      showToast(`"${newItem.title}" agregado a tu factura`);
    },
    [showToast]
  );

  const handleQuickAddCookie = useCallback(
    (flavor: CookieFlavor) => {
      soundFx.playPop(3);
      handleAddOrderItem({
        id: `cookie-${flavor.id}-${Date.now()}`,
        category: 'cookie',
        title: `Galleta ${flavor.name}`,
        subtitle: 'Galleta individual clásica',
        details: [flavor.shortTag],
        unitPrice: flavor.price,
        quantity: 1,
        previewImage: flavor.image,
      });
    },
    [handleAddOrderItem]
  );

  const scrollToKitchen = useCallback((mode?: DessertMode) => {
    if (mode) setKitchenMode(mode);
    const el = document.getElementById('cocina-interactiva');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleCustomizeFlavor = useCallback(
    (flavor: CookieFlavor) => {
      setPresetFlavor(flavor);
      scrollToKitchen('cookie');
    },
    [scrollToKitchen]
  );

  const handleUpdateQty = useCallback((id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(() => {
    const sub = cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    return sub + (sub > 0 && deliveryMode === 'delivery' ? SALMA_CONTACT.deliveryFee : 0);
  }, [cartItems, deliveryMode]);

  return (
    <div className="min-h-screen bg-[#FFF8F3] text-[#3C1B10]">
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenReceipt={() => setReceiptDrawerOpen(true)}
        onJumpToKitchen={scrollToKitchen}
      />

      <main>
        {/* 1. PORTADA (HERO) */}
        <HeroSection onJumpToKitchen={scrollToKitchen} />

        {/* 2. ¿QUIÉNES SOMOS? */}
        <AboutSection />

        {/* 3. NUESTROS 6 SABORES DE GALLETAS */}
        <FlavorsSection
          onQuickAddCookie={handleQuickAddCookie}
          onCustomizeFlavor={handleCustomizeFlavor}
        />

        {/* ★ EXPERIENCIA INTERACTIVA PAPA'S PIZZERIA × TONDO WORKBENCH ★ */}
        <InteractiveKitchen
          activeMode={kitchenMode}
          onModeChange={setKitchenMode}
          presetFlavor={presetFlavor}
          onClearPreset={() => setPresetFlavor(null)}
          orderNumber={orderNumber}
          cartItems={cartItems}
          deliveryMode={deliveryMode}
          customerName={customerName}
          customerNotes={customerNotes}
          onDeliveryModeChange={setDeliveryMode}
          onCustomerNameChange={setCustomerName}
          onCustomerNotesChange={setCustomerNotes}
          onAddOrderItem={handleAddOrderItem}
          onUpdateQty={handleUpdateQty}
          onRemoveOrderItem={handleRemoveItem}
        />

        {/* 4. PRECIOS Y CAJAS DE REGALO */}
        <PricingBoxesSection onAddOrderItem={handleAddOrderItem} />

        {/* 5. MÁS DULCES ANTOJOS (CUCHAREABLES Y TORTAS) */}
        <CravingsSection
          onAddOrderItem={handleAddOrderItem}
          onQuoteCake={() => scrollToKitchen('cake')}
        />

        {/* 7. LO QUE DICEN NUESTROS CLIENTES / GALERÍA */}
        <TestimonialsSection />
      </main>

      {/* 8. PIE DE PÁGINA + WHATSAPP FLOTANTE */}
      <Footer />

      {/* SLIDE-OVER RECEIPT DRAWER (Accessible from Navbar anywhere on page) */}
      <AnimatePresence>
        {receiptDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReceiptDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-[#2B1108]/55 backdrop-blur-xs flex justify-end"
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-[#F7EEE8] shadow-2xl overflow-y-auto p-4 sm:p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ReceiptText className="w-5 h-5 text-[#B74347]" />
                  <h3
                    className="text-xl font-black text-[#451E10]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Tu Factura Salma
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setReceiptDrawerOpen(false)}
                  aria-label="Cerrar factura"
                  className="p-2 rounded-full bg-white text-[#451E10] shadow-xs hover:bg-[#FADAD3]/65 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ReceiptPanel
                orderNumber={orderNumber}
                items={cartItems}
                deliveryMode={deliveryMode}
                customerName={customerName}
                customerNotes={customerNotes}
                onDeliveryModeChange={setDeliveryMode}
                onCustomerNameChange={setCustomerName}
                onCustomerNotesChange={setCustomerNotes}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveItem}
                compact
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SONNER-STYLE NON-INTRUSIVE TOAST FEEDBACK */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50 max-w-sm bg-[#451E10] text-[#FFF8F3] px-4 py-3 rounded-2xl shadow-[0_18px_36px_rgba(43,17,8,0.38)] border border-white/10 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-[#FADAD3] shrink-0" />
            <span className="text-xs sm:text-sm font-bold leading-snug">
              {toastMsg}
            </span>
            <button
              type="button"
              onClick={() => {
                setToastMsg(null);
                setReceiptDrawerOpen(true);
              }}
              className="ml-1 px-2.5 py-1 rounded-lg bg-[#B74347] hover:bg-[#962E32] text-[11px] font-extrabold text-white shrink-0 cursor-pointer"
            >
              Ver factura
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
