import React, { useMemo, useState } from "react";
import { useBurgerStore } from "@/lib/flux/useBurgerStore";
import { BurgerActions } from "@/lib/flux/Actions";
import fallbackImg from "@/imgs/Cheese burger.jpeg";

type Burger = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isPopular?: boolean;
};

type GroupKey = "cheese" | "bacon";
type MedallonCount = 1 | 2 | 3;

const GROUP_CONFIG: Record<
  GroupKey,
  {
    title: string;
    ids: [string, string, string];
  }
> = {
  cheese: {
    title: "Runa cheese burger",
    ids: [
      "runa-cheese-burger",
      "runa-cheese-burger-doble",
      "runa-cheese-burger-triple",
    ],
  },
  bacon: {
    title: "Runa Bacon",
    ids: ["runa-bacon", "runa-doble-bacon", "runa-triple-bacon"],
  },
};

const MEDALLON_LABEL: Record<MedallonCount, string> = {
  1: "Simple",
  2: "Doble",
  3: "Triple",
};

type MenuItem =
  | { kind: "normal"; burger: Burger }
  | { kind: "group"; groupKey: GroupKey };

export function MenuSection() {
  const { burgers } = useBurgerStore();

  const [selectedMedallones, setSelectedMedallones] = useState<
    Record<GroupKey, MedallonCount>
  >({
    cheese: 1,
    bacon: 1,
  });

  const burgersById = useMemo(() => {
    const map = new Map<string, Burger>();
    burgers.forEach((burger) => map.set(burger.id, burger));
    return map;
  }, [burgers]);

  const getGroupedBurger = (
    groupKey: GroupKey,
    medallones: MedallonCount
  ): Burger | undefined => {
    const burgerId = GROUP_CONFIG[groupKey].ids[medallones - 1];
    return burgersById.get(burgerId);
  };

  const menuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [];
    let insertedCheese = false;
    let insertedBacon = false;

    for (const burger of burgers) {
      if (GROUP_CONFIG.cheese.ids.includes(burger.id)) {
        if (!insertedCheese) {
          items.push({ kind: "group", groupKey: "cheese" });
          insertedCheese = true;
        }
        continue;
      }

      if (GROUP_CONFIG.bacon.ids.includes(burger.id)) {
        if (!insertedBacon) {
          items.push({ kind: "group", groupKey: "bacon" });
          insertedBacon = true;
        }
        continue;
      }

      items.push({ kind: "normal", burger });
    }

    return items;
  }, [burgers]);

  const renderCard = ({
    keyValue,
    burger,
    title,
    selectionLabel,
    extraContent,
  }: {
    keyValue: string;
    burger: Burger;
    title?: string;
    selectionLabel?: string;
    extraContent?: React.ReactNode;
  }) => (
    <div
      key={keyValue}
      className="group bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={burger.image}
          alt={title || burger.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackImg;
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {burger.isPopular && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded uppercase">
            Más pedida
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight leading-tight">
              {title || burger.name}
            </h3>

            {selectionLabel && (
              <p className="mt-1 text-xs text-primary font-semibold uppercase tracking-wide">
                {selectionLabel}
              </p>
            )}
          </div>

          <span className="shrink-0 whitespace-nowrap text-primary font-black text-xl leading-none">
            ${burger.price.toLocaleString("es-AR")}
          </span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed min-h-[48px]">
          {burger.description}
        </p>

        {extraContent}

        <button
          onClick={() => BurgerActions.addBurgerToCart(burger)}
          className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors border border-white/10 group-hover:border-primary/30 active:scale-95 transform duration-150"
        >
          Agregar al pedido
        </button>
      </div>
    </div>
  );

  return (
    <section id="menu" className="py-24 bg-card/50 scroll-mt-6">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-heading text-center text-white mb-16">
          Nuestro menú
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuItems.map((item) => {
            if (item.kind === "normal") {
              return renderCard({
                keyValue: item.burger.id,
                burger: item.burger,
              });
            }

            const selectedCount = selectedMedallones[item.groupKey];
            const currentBurger = getGroupedBurger(item.groupKey, selectedCount);

            if (!currentBurger) return null;

            return renderCard({
              keyValue: `group-${item.groupKey}`,
              burger: currentBurger,
              title: GROUP_CONFIG[item.groupKey].title,
              selectionLabel: `${MEDALLON_LABEL[selectedCount]} · ${selectedCount} medallón${
                selectedCount > 1 ? "es" : ""
              }`,
              extraContent: (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Elegí cantidad de medallones
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {([1, 2, 3] as MedallonCount[]).map((count) => {
                      const optionBurger = getGroupedBurger(item.groupKey, count);
                      const isActive = selectedCount === count;

                      return (
                        <button
                          key={`${item.groupKey}-${count}`}
                          type="button"
                          onClick={() =>
                            setSelectedMedallones((prev) => ({
                              ...prev,
                              [item.groupKey]: count,
                            }))
                          }
                          className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <div className="font-bold">{MEDALLON_LABEL[count]}</div>
                          <div className="text-[11px] opacity-80">
                            ${optionBurger?.price.toLocaleString("es-AR")}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ),
            });
          })}
        </div>
      </div>
    </section>
  );
}