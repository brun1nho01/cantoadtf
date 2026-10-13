import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveDown } from "lucide-react";

export const metadata = {
  title: "Atacado & Serviços | CantoA",
  description: "Terceirização de estamparia DTF e malhas premium."
};

export default function B2BPage() {
  // Configuração dos 2 Números Diferentes
  const wppDTF = "5511999999991"; // Número para DTF e Peças Prontas
  const wppSilk = "5511999999992"; // Número para Silk e Sublimação

  const msgDTF = encodeURIComponent("Olá! Vim pelo site da CantoA. Gostaria de cotar produção em DTF / Peça Pronta.");
  const msgSilk = encodeURIComponent("Olá! Vim pelo site da CantoA. Gostaria de cotar produção em Silk Industrial / Sublimação.");

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-white/20">

      {/* MINIMALIST HEADER */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference pointer-events-none">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="pointer-events-auto group inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
            <MoveLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            Retornar
          </Link>
          <div className="pointer-events-auto text-[10px] tracking-[0.4em] font-medium text-white/40 uppercase">
            CantoA Confecções
          </div>
        </div>
      </nav>

      {/* EDITORIAL HERO */}
      <section className="relative w-full min-h-[90vh] py-32 flex flex-col items-center justify-center border-b border-white/5">

        {/* Subtle glow behind typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.015] blur-[150px] rounded-full pointer-events-none" />

        <div className="z-10 flex flex-col items-center text-center px-4 animate-slide-up">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-10 font-medium">B2B / Private Label</p>

          <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-serif leading-[0.8] tracking-tighter text-white mb-6">
            ESCALA<br />
            <span className="font-light italic text-white/50 px-8">premium.</span>
          </h1>

          <p className="max-w-xl text-sm md:text-base text-white/40 font-light tracking-wide leading-relaxed mt-10 mb-16">
            Sua grife construída com engenharia têxtil de vanguarda. Sem máquinas, sem chão de fábrica, sem erros.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
            <a href={`https://wa.me/${wppDTF}?text=${msgDTF}`} target="_blank" rel="noopener noreferrer">
              <Button className="w-[300px] h-[60px] rounded-full bg-white text-black hover:bg-gray-200 text-xs uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                Falar com setor DTF
              </Button>
            </a>

            <a href={`https://wa.me/${wppSilk}?text=${msgSilk}`} target="_blank" rel="noopener noreferrer">
              <Button className="w-[300px] h-[60px] rounded-full bg-transparent border-2 border-white/20 text-white hover:border-white hover:bg-white/5 text-xs uppercase tracking-[0.2em] font-bold transition-all hover:scale-105">
                Setor de Silk & Sublimação
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center opacity-30 animate-pulse">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold mb-3">Serviços</span>
          <MoveDown className="w-4 h-4" />
        </div>
      </section>

      {/* SERVICES - BRUTALIST FULL WIDTH ROWS */}
      <section className="relative z-10 bg-[#030303] flex flex-col">

        {/* SERVICE 1: DTF */}
        <div className="group relative w-full min-h-[60vh] border-b border-white/5 flex flex-col lg:flex-row items-center overflow-hidden hover:bg-white/[0.02] transition-colors duration-700">

          <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            <div className="flex-1 w-full max-w-2xl">
              <h2 className="text-5xl lg:text-7xl font-serif tracking-tight text-white mb-8">DTF por Metro</h2>
              <p className="text-white/60 leading-relaxed text-base lg:text-lg font-light">
                Impressão contínua em escala industrial. Entregamos o filme DTF já curado, com fidelidade de cores absoluta e flexibilidade máxima. O material chega pronto para termotransferência na sua confecção, zerando seu custo de maquinário e acelerando o giro de estoque.
              </p>
            </div>
          </div>
        </div>

        {/* SERVICE 2: SILK */}
        <div className="group relative w-full min-h-[60vh] border-b border-white/5 flex flex-col lg:flex-row items-center overflow-hidden hover:bg-white/[0.02] transition-colors duration-700">

          <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            <div className="flex-1 w-full max-w-2xl">
              <h2 className="text-5xl lg:text-7xl font-serif tracking-tight text-white mb-8">Silk Industrial</h2>
              <p className="text-white/60 leading-relaxed text-base lg:text-lg font-light">
                O método tradicional executado com precisão milimétrica. Utilizamos matrizes de alta definição e tintas de durabilidade extrema (base água ou especiais). Focamos na qualidade final da peça, atendendo desde lotes exclusivos a partir de 10 unidades até demandas maiores.
              </p>
            </div>
          </div>
        </div>

        {/* SERVICE 3: PEÇA PRONTA */}
        <div className="group relative w-full min-h-[60vh] flex flex-col lg:flex-row items-center overflow-hidden hover:bg-white/[0.02] transition-colors duration-700">
          <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            <div className="flex-1 w-full max-w-2xl">
              <h2 className="text-5xl lg:text-7xl font-serif tracking-tight text-white mb-8">Peças Prontas</h2>
              <p className="text-white/60 leading-relaxed text-base lg:text-lg font-light">
                Não quer lidar apenas com a estampa? Nós assumimos a produção da blusa completa para a sua marca. Fornecemos camisetas com malha premium já cortadas, costuradas e estampadas sob demanda com a sua arte. Produto embalado e pronto para a venda direta.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* MASSIVE CTA FOOTER */}
      <section className="py-40 border-t border-white/10 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-10 relative z-10">Qual é a sua demanda?</h2>

        <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
          <a
            href={`https://wa.me/${wppDTF}?text=${msgDTF}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-[300px] h-[60px] rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500">
              Cotar DTF
            </Button>
          </a>
          <a
            href={`https://wa.me/${wppSilk}?text=${msgSilk}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-[300px] h-[60px] rounded-full bg-transparent border-2 border-white/20 text-white hover:border-white hover:bg-white hover:text-black text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500">
              Cotar Silk & Sublimação
            </Button>
          </a>
        </div>
      </section>

    </main>
  );
}