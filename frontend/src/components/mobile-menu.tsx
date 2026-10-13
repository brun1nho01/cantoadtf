"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden flex items-center z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-3 relative z-[60]"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[50] bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 animate-fade-in">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="text-sm uppercase tracking-widest font-semibold text-white hover:text-white/70 transition-colors"
          >
            Catálogo
          </Link>
          <Link
            href="/b2b-atacado"
            onClick={() => setIsOpen(false)}
            className="text-sm uppercase tracking-widest font-semibold text-white/50 hover:text-white transition-colors"
          >
            B2B / Atacado
          </Link>
          <Link
            href="/simulator"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 text-xs uppercase tracking-widest font-bold rounded-full px-8 h-10 transition-all hover:scale-105 mt-4"
          >
            Abrir Studio 3D
          </Link>
        </div>
      )}
    </div>
  );
}