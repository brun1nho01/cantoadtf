import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight, Layers } from "lucide-react";
import { MobileMenu } from "@/components/mobile-menu";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white/20 relative overflow-x-hidden">

      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle vignette/gradient map */}
        <div className="hidden lg:block absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.02] blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
      </div>

      {/* HEADER / NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/60 backdrop-blur-2xl transition-all">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">

          <div className="flex-1 flex flex-col justify-center animate-fade-in">
            {/* Minimalist Logo */}
            <div className="font-serif text-2xl tracking-[0.2em] font-bold text-white">
              CantoA
            </div>
            <div className="text-[10px] md:text-xs tracking-[0.4em] font-medium text-white/50 uppercase mt-0.5">
              Confecção Premium
            </div>
          </div>

          <div className="flex-1 hidden md:flex items-center justify-center gap-12 animate-fade-in delay-200">
            <Link href="/" className="text-xs uppercase tracking-widest font-semibold text-white hover:text-white/70 transition-colors">
              Catálogo
            </Link>
            <Link href="/b2b-atacado" className="text-xs uppercase tracking-widest font-semibold text-white/50 hover:text-white transition-colors">
              B2B / Atacado
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-end animate-fade-in delay-200 gap-4">
            <div className="hidden md:block">
              <Link href="/simulator" className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 text-xs uppercase tracking-widest font-bold rounded-full px-8 h-10 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)] pointer-events-auto">
                Abrir Studio 3D
              </Link>
            </div>
            {/* Nav do menu em telas Mobile */}
            <div className="md:hidden flex items-center">
               <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-32 pb-20 min-h-[95vh] flex flex-col items-center justify-center">
        <div className="container mx-auto px-6 relative flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* Hero Typography */}
          <div className="flex-1 relative z-20 animate-slide-up flex flex-col items-start pt-10 lg:pt-0">
            <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-serif tracking-tighter leading-[0.9] mb-8 text-white">
              Qualidade<br />
              <span className="text-white/40 italic">absoluta.</span>
            </h1>

            <p className="text-sm md:text-base text-white/50 max-w-md mb-12 leading-relaxed font-light tracking-wide">
              Não vendemos apenas camisetas. Entregamos uma fusão perfeita entre malhas ultra-premium e tecnologia de impressão DTF exata. Sem furos, sem desbotamentos.
            </p>

            <Link href="/simulator" className="inline-flex items-center justify-center h-[60px] px-10 rounded-full bg-white text-black hover:bg-gray-200 text-xs uppercase tracking-[0.2em] font-bold group transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] pointer-events-auto">
              Acessar Simulador
              <MoveRight className="ml-4 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>

          {/* Cinematic Visual Anchor (Placeholder for 3D/Video) */}
          <div className="flex-1 w-full relative z-10 animate-fade-in delay-200 flex justify-center lg:justify-end">
            <div className="relative w-full aspect-square max-w-[600px]">
              {/* Glass container acting as a frame for the product */}
              <div className="absolute inset-0 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[3rem] transform rotate-3 scale-95 transition-transform duration-700 hover:rotate-0 hover:scale-100">

                {/* Visual content area */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                  <div className="w-full h-full border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-center gap-4 bg-black/20">
                    <Layers className="w-10 h-10 text-white/20" />
                    <div className="text-xs font-mono text-white/30 tracking-widest uppercase">
                      [ Área do Canvas 3D / Render ]
                    </div>
                  </div>
                </div>

                {/* Decorative Specs overlay */}
                <div className="absolute bottom-10 left-10 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                  <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Tecnologia</div>
                  <div className="text-sm font-serif text-white">DTF + UV Fusion</div>
                </div>
              </div>

              {/* Massive ambient glow behind the framing */}
              <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[100px] pointer-events-none rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* BRUTALIST SECTIONS (B2C Features) */}
      <section className="relative z-20 bg-[#050505] flex flex-col border-t border-white/5">

        {/* ROW 1 */}
        <div className="group relative w-full min-h-[60vh] border-b border-white/5 flex flex-col lg:flex-row items-center overflow-hidden hover:bg-white/[0.02] transition-colors duration-700">

          <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            <div className="flex-1 w-full max-w-2xl">
              <h2 className="text-5xl lg:text-7xl font-serif tracking-tight text-white mb-8">
                Durabilidade<br />
                <span className="italic font-light text-white/50">absoluta.</span>
              </h2>
              <p className="text-white/60 leading-relaxed text-base lg:text-lg font-light">
                Nossas tintas DTF são curadas de forma cirúrgica na malha, garantindo que a estampa nunca trinque ou desbote, mesmo após dezenas de lavagens extremas. Entregamos um toque emborrachado sutil e imponente.
              </p>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="group relative w-full min-h-[60vh] border-b border-white/5 flex flex-col lg:flex-row items-center overflow-hidden hover:bg-white/[0.02] transition-colors duration-700">

          <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            <div className="flex-1 w-full max-w-2xl">
              <h2 className="text-5xl lg:text-7xl font-serif tracking-tight text-white mb-8">
                Simulação<br />
                <span className="italic font-light text-white/50">exata.</span>
              </h2>
              <p className="text-white/60 leading-relaxed text-base lg:text-lg font-light">
                Esqueça mockups que mentem. Usamos constraints matemáticos e WebGL para entregar a proporção milimétrica da arte em relação à malha real no nosso Studio 3D exclusivo antes da sua compra.
              </p>
            </div>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="group relative w-full min-h-[60vh] flex flex-col lg:flex-row items-center overflow-hidden hover:bg-white/[0.02] transition-colors duration-700">

          <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            <div className="flex-1 w-full max-w-2xl">
              <h2 className="text-5xl lg:text-7xl font-serif tracking-tight text-white mb-8">
                Malha<br />
                <span className="italic font-light text-white/50">premium.</span>
              </h2>
              <p className="text-white/60 leading-relaxed text-base lg:text-lg font-light">
                A espinha dorsal da nossa estética. Opções em Algodão, PV e PP com encolhimento zero. Acabamentos finos em Ribana Larga e Viés para um caimento pesado e impecável no corpo.
              </p>
            </div>
          </div>
        </div>

      </section>

    </main>
  );
}