import React from "react";
import { useBurgerStore } from "@/lib/flux/useBurgerStore";
import { Badge } from "@/components/ui/badge";
import { BurgerActions } from "@/lib/flux/Actions";

export function MenuSection() {
  const { burgers } = useBurgerStore();

  return (
    <section id="menu" className="py-24 bg-card/50 scroll-mt-6">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-heading text-center text-white mb-16">
          Nuestro menú
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {burgers.map((burger) => (
            <div key={burger.id} className="group bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={burger.image}
                  alt={burger.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {burger.isPopular && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded uppercase">
                    Más pedida
                  </div>
                )}
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
                    {burger.name}
                  </h3>
                  <span className="text-primary font-black text-xl">
                    ${burger.price.toLocaleString('es-AR')}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed min-h-[48px]">
                  {burger.description}
                </p>
                
                <button
                  onClick={() => BurgerActions.addBurgerToCart(burger)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors border border-white/10 group-hover:border-primary/30 active:scale-95 transform duration-150"
                >
                  Agregar al pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
