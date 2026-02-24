import React from "react";
import { MessageCircle, Flame, Truck, Store } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { useCartStore } from "@/lib/flux/useCartStore";

const HERO_BG = "https://cdn.builder.io/api/v1/image/assets%2Fadca80ee8fc74b4799929f9b24a54891%2Fa0d7669be6284f8faf969db0f4292eb3?format=webp&width=1600&height=1000";

export function Hero() {
  const { cartCount } = useCartStore();

  return (
    <section className="relative min-h-[90vh] md:min-h-screen pt-24 pb-12 overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-right md:bg-center transition-all duration-700"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      >
        {/* Dark Gradients for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent md:via-background/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        
        {/* Texture layer */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 pointer-events-none"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl space-y-6 text-center md:text-left">
          {/* Banner parts - Ituzaingó tag */}
          <div className="inline-block bg-[#D9A05B]/20 border border-[#D9A05B]/40 text-[#D9A05B] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm animate-fade-in">
            Ratti 295, Ituzaingó • Takeaway & Envío
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] drop-shadow-2xl">
            Smash burgers <br />
            <span className="text-primary drop-shadow-[0_2px_10px_rgba(238,177,53,0.3)]">marcadas a fuego</span>
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl max-w-md mx-auto md:mx-0 font-medium leading-relaxed drop-shadow-md">
            Pedí por WhatsApp. Respuesta rápida. <br className="hidden md:block" />
            Retiro o envío en la zona.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 text-lg shadow-2xl shadow-green-900/40 transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 relative"
            >
              <MessageCircle size={28} fill="currentColor" stroke="none" />
              Pedir por WhatsApp
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-background shadow-xl animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </a>
          </div>
          
          {/* Smash, Envío and Retiro badges */}
          <div className="flex flex-wrap items-center gap-4 pt-6 justify-center md:justify-start">
            <Badge icon={<Flame size={18} />} text="Smash" />
            <Badge icon={<Truck size={18} />} text="Envío" />
            <Badge icon={<Store size={18} />} text="Retiro" />
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
        <div className="w-1 h-12 bg-gradient-to-b from-primary to-transparent rounded-full"></div>
      </div>
    </section>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-xl border border-white/10 text-white font-bold backdrop-blur-md transition-colors hover:bg-black/60 hover:border-primary/50 group">
      <span className="text-primary group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm uppercase tracking-widest">{text}</span>
    </div>
  );
}
