import React from "react";
import { BurgerActions } from "@/lib/flux/Actions";
import { Plus } from "lucide-react";

const EXTRAS = [
  { name: "Tasty Runa - Mayonesa ahumada con pickles.", price: 2500 },
  { name: "Mayochimi Runa - Mayonesa con chimichurri.", price: 2500 },
  { name: "BBQ Jack Runa - Barbacoa con reducción de wisky.", price: 2500 },
  { name: "BIG Runa - Salsa mil islas.", price: 2500 },
  { name: "King Mustang Runa - Mostaza con miel.", price: 2500 },
  { name: "Salsa Alioli Runa - Mayonesa de ajo.", price: 2500 },
];

const BEBIDAS = [
  { name: "Proximamente", price: 0 },
  { name: "Proximamente", price: 0 },
];

export function ExtrasSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Extras */}
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-white border-b border-primary/20 pb-4 inline-block">
              Extras
            </h2>
            <div className="space-y-6">
              {EXTRAS.map((extra) => (
                <div key={extra.name} className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <button
                      onClick={() =>
                        BurgerActions.addBurgerToCart({
                          id: extra.name.toLowerCase().replace(/\s+/g, "-"),
                          name: extra.name,
                          price: extra.price,
                        })
                      }
                      className="p-1 bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground rounded-full transition-all active:scale-90 shrink-0 mt-1"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>

                    <span className="min-w-0 text-white/80 font-medium leading-tight group-hover:text-primary transition-colors">
                      {extra.name}
                    </span>
                  </div>

                  <span className="shrink-0 whitespace-nowrap text-primary font-bold leading-none pt-1">
                    ${extra.price.toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bebidas */}
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-white border-b border-primary/20 pb-4 inline-block">
              Bebidas
            </h2>
            <div className="space-y-6">
              {BEBIDAS.map((bebida) => (
                <div key={bebida.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => BurgerActions.addBurgerToCart({ id: bebida.name.toLowerCase().replace(/\s+/g, '-'), name: bebida.name, price: bebida.price })}
                      className="p-1 bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground rounded-full transition-all active:scale-90"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                    <span className="text-white/80 font-medium group-hover:text-primary transition-colors">
                      {bebida.name}
                    </span>
                  </div>
                  <div className="flex-1 border-b border-dotted border-white/20 mx-4 mt-2"></div>
                  <span className="text-primary font-bold">
                    ${bebida.price.toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
