"use client";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ShoppingBag, CreditCard } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import CheckoutForm from "@/components/Checkout/CheckoutForm";

export default function CartDrawer() {
  const { items, isOpen, toggleDrawer, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  // Controla se a gaveta tÃ¡ mostrando "A Sacola" ou o "FormulÃ¡rio de Checkout"
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);

  const toggleDrawerHandler = (val?: boolean) => {
    toggleDrawer(val);
    if (val === false) {
      setTimeout(() => setIsCheckoutMode(false), 300); // Reseta a tab apÃ³s a animaÃ§Ã£o de fechar a gaveta
    }
  };

  // Usando um useSyncExternalStore mock para bypass hydration mismatch sem causar re-rendering issues:
  const isServer = typeof window === 'undefined';
  const getSnapshot = () => !isServer;
  const subscribe = () => () => {};

  // Custom hook pattern recommended by React 18 for hydration boundary without setMounted loops
  const mounted = useSyncExternalStore(subscribe, getSnapshot, () => false);

  if (!mounted) return null;

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity"
          onClick={() => toggleDrawerHandler(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] max-w-[100vw] bg-[#0a0a0a]/90 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {isCheckoutMode ? (
          <CheckoutForm onBack={() => setIsCheckoutMode(false)} />
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-white/80" />
                <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-white">Sua Sacola</h2>
              </div>
              <button
                onClick={() => toggleDrawerHandler(false)}
                aria-label="Fechar Sacola"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
              >
                <X className="w-4 h-4 text-white" aria-hidden="true" />
              </button>
            </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
              <ShoppingBag className="w-12 h-12 mb-4" />
              <p className="text-xs uppercase tracking-[0.2em] font-bold mb-2">Sacola Vazia</p>
              <p className="text-xs font-light">Seu acervo aguarda sua seleÃ§Ã£o.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl relative group">
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Remover camisa da sacola"
                  title="Remover camisa"
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>

                {/* Color Mock & Artwork Thumbnail */}
                <div
                  className="w-16 h-20 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group/thumb"
                  style={{ backgroundColor: item.shirtColor, border: item.shirtColor === '#ffffff' ? '1px solid #ddd' : '1px solid rgba(255,255,255,0.1)' }}
                >
                  {(item.frontArtworkId || item.backArtworkId) ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`http://localhost:3333/api/arts/${item.artworkSize}/${encodeURIComponent(item.frontArtworkId || item.backArtworkId || '')}/thumbnail`}
                        alt="Arte Estampada"
                        className="w-full h-full object-contain filter drop-shadow-lg opacity-80 z-10 p-2"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 z-0" />
                    </>
                  ) : (
                    <div className="text-[8px] uppercase tracking-widest text-[#0a0a0a] mix-blend-difference font-bold opacity-30 invert">
                      Malha
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-serif text-white">Camiseta Premium</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">
                      {item.material} / {item.collar.replace('-', ' ')}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-white/30 truncate max-w-[150px]">
                      {item.frontArtworkId || item.backArtworkId ? (item.frontArtworkId || item.backArtworkId)?.replace('.png', '') : 'Lisa'} ({item.artworkSize})
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-white/10 rounded-full border border-white/5">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Diminuir" className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors hidden-outline">
                        <Minus className="w-4 h-4 text-white" aria-hidden="true" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Aumentar" className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors hidden-outline">
                        <Plus className="w-4 h-4 text-white" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="text-sm font-bold tracking-widest text-white">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER CHECKOUT */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-black/50">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">Total</span>
              <span className="text-2xl font-serif text-white">
                R$ {getTotalPrice().toFixed(2).replace('.', ',')}
              </span>
            </div>

            <Button
              onClick={() => setIsCheckoutMode(true)}
              className="w-full h-16 rounded-xl bg-white text-black hover:bg-gray-200 text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.15)] overflow-hidden relative group">
              <CreditCard className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Fazer Checkout</span>

              {/* Shine effect inside button */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-black opacity-10 group-hover:animate-shine" />
            </Button>

            <div className="text-center mt-4 opacity-50 flex items-center justify-center gap-2">
              {/* Fake locked icon / PCI security text */}
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5V3.5C1 2.57174 1.36875 1.6815 2.02513 1.02513C2.6815 0.368749 3.57174 0 4.5 0H5.5C6.42826 0 7.3185 0.368749 7.97487 1.02513C8.63125 1.6815 9 2.57174 9 3.5V5M3.5 8.5V7M1 5H9C9.55228 5 10 5.44772 10 6V11C10 11.5523 9.55228 12 9 12H1C0.447715 12 0 11.5523 0 11V6C0 5.44772 0.447715 5 1 5Z" stroke="currentColor" strokeLinejoin="round"/>
              </svg>
              <span className="text-[8px] uppercase tracking-[0.2em] font-medium">PCI Compliant â€¢ Stripe 256-bit</span>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </>
  );
}
