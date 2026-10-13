"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoveLeft, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSimulatorStore, MeshMaterial, CollarType } from "@/store/useSimulatorStore";
import { useCartStore } from "@/store/useCartStore";
import Viewer3D from "@/components/simulator/Viewer3D";

export interface ArtItem {
  id: string;
  size: string;
  name: string;
}

export default function SimulatorPage() {
  const {
    shirtColor, setShirtColor,
    material, setMaterial,
    collar, setCollar,
    isBakingTexture, setBakingState,
    frontArtworkId, backArtworkId, artworkSize,
    activeSide, setActiveSide, setArtwork
  } = useSimulatorStore();

  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    // Tenta determinar um preço base simples (você pode complexar isso depois)
    const basePrice = 89.90; // Exemplo

    addItem({
      shirtColor,
      material,
      collar,
      frontArtworkId,
      backArtworkId,
      artworkSize,
      quantity: 1,
      price: basePrice
    });
  };

  const [availableArts, setAvailableArts] = useState<ArtItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3333/api/arts')
      .then(res => res.json())
      .then(data => setAvailableArts(data.arts || []))
      .catch(err => console.error("Falha ao buscar artes:", err));
  }, []);

  const handleSelectArt = async (art: ArtItem | null, customColor?: string) => {
    // Determine which artwork to use based on the currently active side
    const currentArtId = activeSide === 'front' ? frontArtworkId : backArtworkId;
    const artToBake = art || availableArts.find(a => a.id === currentArtId);
    if (!artToBake) return;

    if (art) {
      setArtwork(art.id, activeSide, art.size as "A4" | "A3" | "A2");
    }

    setBakingState(true, undefined, activeSide);

    try {
      const response = await fetch('http://localhost:3333/api/bake-texture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artId: artToBake.id,
          colorHex: customColor || shirtColor,
          artworkSize: artToBake.size
        }),
      });

      if (!response.ok) {
        console.error('Falha ao processar textura:', await response.text());
        setBakingState(false, null);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      console.log(`Blob URL Gerada (${activeSide}):`, url);
      setBakingState(false, url, activeSide);

    } catch (error) {
      console.error('Erro de request 3D bake:', error);
      setBakingState(false, null, activeSide);
    }
  };

  const handleColorChange = (c: string) => {
    setShirtColor(c);

    // We should technically bake both front and back if both exist.
    // To keep it simple, we just bake the active side if it has art.
    // The other side will be baked when the user switches to it.
    const currentArtId = activeSide === 'front' ? frontArtworkId : backArtworkId;
    if (currentArtId) {
      handleSelectArt(null, c);
    }
  };

  return (
    <main className="fixed inset-0 min-h-screen bg-[#050505] text-white selection:bg-white/20">
      {/* 3D STUDIO BACKGROUND (Absolute Fullscreen) */}
      <div className="absolute inset-0 z-0 flex flex-1 w-full h-full">
        <Viewer3D />

        {/* OVERLAY DE LOADING BAKE (Non-blocking) */}
        {isBakingTexture && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center bg-black/80 backdrop-blur-md border border-white/10 rounded-full py-2.5 px-5 shadow-2xl animate-fade-in transition-all duration-300 pointer-events-none">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] font-medium text-white/90">Processando...</p>
            </div>
          </div>
        )}
      </div>

      {/* FLOATING NAVBAR */}
      <nav className="absolute top-0 w-full z-50 h-20 flex items-center px-8 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="flex-1">
          <Link href="/" className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            <MoveLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="font-serif text-xl tracking-widest font-bold">
            CantoA
          </div>
          <div className="text-xs tracking-[0.2em] font-light text-white/40 uppercase mt-0.5">Studio 3D</div>
        </div>

        <div className="flex-1 flex justify-end">
          {/* Espaço reservado para ações de header direitas, se houver */}
        </div>
      </nav>

      {/* MOBILE DRAWER TRIGGER */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-30 p-4 bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/10 flex justify-between items-center rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-[#0a0a0a]" onClick={() => setIsDrawerOpen(true)}>
        <div className="flex flex-col">
          <span className="text-sm font-serif text-white">Configurar Peça</span>
          <span className="text-[10px] uppercase text-white/50">{material} &bull; {shirtColor}</span>
        </div>
        <Button className="rounded-full bg-white text-black px-6 text-xs h-10 shadow-lg pointer-events-none">
          Abrir
        </Button>
      </div>

      {/* MOBILE BACKDROP */}
      {isDrawerOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* FLOATING CONFIGURATOR PANEL (Glassmorphism & Drawer) */}
      <aside className={`fixed lg:absolute left-0 lg:left-auto lg:right-6 bottom-0 lg:top-28 lg:bottom-6 w-full lg:w-[420px] h-[85vh] lg:h-auto z-50 lg:z-20 flex flex-col gap-4 lg:gap-6 overflow-y-auto overscroll-contain overflow-x-hidden p-4 lg:p-6 bg-[#0a0a0a]/95 lg:bg-[#0a0a0a]/65 backdrop-blur-3xl border border-t-white/20 lg:border-white/10 rounded-t-3xl lg:rounded-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.8)] lg:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}`}>

        {/* HANDLE PARA MOBILE */}
        <div className="lg:hidden w-full flex justify-center pb-4 pt-1 cursor-pointer" onClick={() => setIsDrawerOpen(false)}>
          <div className="w-12 h-1.5 bg-white/20 hover:bg-white/40 transition-colors rounded-full" />
        </div>

        <div>
          <h2 className="text-xl font-serif text-white/90">Ajustar Malha</h2>
          <p className="text-xs text-white/40 mt-1 mb-8 tracking-wide">Configure a estrutura base da peça.</p>

            <div className="space-y-6 lg:space-y-8">
            {/* CORES */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-xs uppercase font-semibold tracking-[0.2em] text-white/50 block">Coloração</label>
                {(frontArtworkId || backArtworkId) && (
                  <span className="text-xs uppercase tracking-widest text-amber-500/80 font-bold bg-amber-500/10 px-2 py-0.5 rounded-sm">
                    Modo Halftone Dark
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                {['#ffffff', '#1A1A1A', '#0f172a', '#450a0a'].map((c) => {
                  // Se existir arte (Halftone Dark), a cor branca deve ser desativada/bloqueada
                  const isLightColor = c === '#ffffff';
                  const hasArtSelected = frontArtworkId || backArtworkId;
                  const isDisabled = Boolean(hasArtSelected && isLightColor);

                  return (
                    <button
                      key={c}
                      onClick={() => {
                        if (!isDisabled) handleColorChange(c);
                      }}
                      disabled={isDisabled === true}
                      className={`w-12 h-12 lg:w-10 lg:h-10 rounded-full transition-all duration-300 ${shirtColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a] scale-110 shadow-lg' : 'opacity-60'} ${isDisabled ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:opacity-100 hover:scale-105'}`}
                      style={{ backgroundColor: c, border: c === '#1A1A1A' || c === '#0f172a' || c === '#450a0a' ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
                      title={isDisabled ? "Incompatível com Arte Halftone" : c}
                      aria-label={`Selecionar cor ${c}`}
                    >
                      {isDisabled && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-px bg-red-500 rotate-45" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Aviso dinâmico */}
              {(frontArtworkId || backArtworkId) && (
                <p className="text-xs text-amber-500/60 mt-3 font-light leading-relaxed">
                  * Sua arte possui retículas (Halftone) otimizadas para tecidos escuros. Malhas claras foram desabilitadas para garantir a revelação correta da estampa.
                </p>
              )}
            </div>

            {/* TECIDO / MATERIAL */}
            <div>
              <label className="text-xs uppercase font-semibold tracking-[0.2em] text-white/50 mb-4 block">Acabamento Têxtil</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-1 bg-white/5 border border-white/5 rounded-xl">
                {(['algodao', 'pv', 'pp'] as MeshMaterial[]).map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setMaterial(mat)}
                    className={`min-h-[48px] py-2 px-1 text-xs font-medium uppercase tracking-wider rounded-lg transition-all duration-300 ${material === mat ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* GOLA */}
            <div>
              <label className="text-xs uppercase font-semibold tracking-[0.2em] text-white/50 mb-4 block">Construção da Gola</label>
              <div className="flex flex-col gap-2">
                {(['ribana-premium', 'ribana-padrao', 'vies'] as CollarType[]).map((col) => (
                  <button
                    key={col}
                    onClick={() => setCollar(col)}
                    className={`min-h-[48px] py-3 px-5 text-xs font-medium tracking-[0.1em] text-left border rounded-xl transition-all duration-300 ${collar === col ? 'bg-white/10 text-white border-white/30 shadow-inner' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white/80'}`}
                  >
                    {col.replace('-', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

        {/* ÁREA DA ARTE */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-serif text-white/90">Estampagem</h2>
              <p className="text-xs text-white/40 mt-1 tracking-wide">Acervo DTF Exclusivo.</p>
            </div>

            {/* Toggle Frente/Costas */}
            <div className="flex bg-white/10 border border-white/10 p-1 rounded-lg">
              <button
                onClick={() => setActiveSide('front')}
                className={`flex-1 min-h-[44px] lg:min-h-[48px] lg:py-1.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-300 ${activeSide === 'front' ? 'bg-white text-black shadow-sm' : 'text-white/50 hover:text-white'}`}
              >
                Frente
              </button>
              <button
                onClick={() => setActiveSide('back')}
                className={`flex-1 min-h-[44px] lg:min-h-[48px] lg:py-1.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-300 ${activeSide === 'back' ? 'bg-white text-black shadow-sm' : 'text-white/50 hover:text-white'}`}
              >
                Costas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableArts.map((art) => {
              const isSelected = (activeSide === 'front' ? frontArtworkId : backArtworkId) === art.id;
              return (
              <div
                key={art.id}
                className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111]' : 'border-white/10 opacity-70 hover:opacity-100 hover:ring-1 hover:ring-white/30'}`}
                onClick={() => handleSelectArt(art)}
                title={art.name}
              >
                <div className="bg-[#111] aspect-square relative flex items-center justify-center p-3 border border-white/10 rounded-xl group-hover:bg-[#1a1a1a] transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`http://localhost:3333/api/arts/${art.size}/${encodeURIComponent(art.id)}/thumbnail`}
                    alt={art.name}
                    className={`w-full h-full object-contain filter drop-shadow-xl transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                    loading="lazy"
                  />
                </div>
                <div className="absolute top-1 right-1 inset-x-auto text-[10px] lg:text-xs font-bold tracking-widest text-[#111] bg-white/90 px-1.5 py-0.5 rounded-sm backdrop-blur-sm shadow-sm">
                  {art.size}
                </div>
              </div>
            )})}

            {availableArts.length === 0 && (
              <div className="col-span-3 p-8 flex flex-col items-center justify-center text-center border border-white/5 border-dashed rounded-xl bg-white/5">
                <p className="text-xs uppercase tracking-widest text-white/30">Acervo vazio</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 lg:mt-6">
          <Button onClick={handleAddToCart} className="w-full h-16 bg-white text-black hover:bg-white/90 text-sm uppercase tracking-[0.2em] font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3">
            <ShoppingBag className="w-4 h-4" />
            Adicionar à Sacola
          </Button>
        </div>
      </aside>

    </main>
  );
}