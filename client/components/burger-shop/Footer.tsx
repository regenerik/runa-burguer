import React from "react";
import { Instagram, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { useCartStore } from "@/lib/flux/useCartStore";

export function Footer() {
  const { cartCount } = useCartStore();

  return (
    <footer className="py-12 bg-card/80 border-t border-border/50">
      <div className="container mx-auto px-4 flex flex-col items-center gap-8">
        <a
          href="https://instagram.com/runa.burger"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-bold transition-all"
        >
          <Instagram size={20} />
          runa.burger
        </a>

        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} RUNA Burger. Todos los derechos reservados.
        </p>
      </div>

      {/* Floating Action Button */}
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white h-14 px-6 rounded-full font-bold flex items-center justify-center gap-2 shadow-2xl shadow-green-900/40 transition-all active:scale-95 md:hidden"
      >
        <span className="whitespace-nowrap">Pedir</span>
        <MessageCircle size={22} fill="currentColor" />

        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-background shadow-lg animate-in zoom-in duration-300">
            {cartCount}
          </span>
        )}
      </a>

      {/* Desktop Floating Pedir (matches design bottom right button) */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba59] text-white pl-6 pr-2 py-2 rounded-full font-bold flex items-center gap-3 shadow-2xl shadow-green-900/40 transition-transform hover:scale-110 group relative"
        >
          <span className="text-lg">Pedir</span>
          {cartCount > 0 && (
            <span className="absolute -top-3 -left-3 bg-primary text-primary-foreground text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center border-4 border-background shadow-xl animate-in zoom-in duration-300">
              {cartCount}
            </span>
          )}
          <div className="bg-white/20 p-2 rounded-full">
            <MessageCircle size={20} fill="white" stroke="none" />
          </div>
          <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </div>
        </a>
      </div>
    </footer>
  );
}
