import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { BurgerActions } from "@/lib/flux/Actions";
import { fetchPublicProducts } from "@/lib/products/productApi";
import { fallbackImg, productImage } from "@/lib/products/imageAssets";
import type { Product, ProductOption } from "@shared/products";

function formatPrice(price: number) {
  return `$${Number(price || 0).toLocaleString("es-AR")}`;
}

function optionCartItem(product: Product, option: ProductOption) {
  return {
    id: `${product.id}:${option.id}`,
    name: `${product.title} - ${option.name}`,
    price: option.price,
  };
}

function optionSubtitle(product: Product, option?: ProductOption) {
  if (!product.hasOptions || !option) return product.subtitle;
  if (option.subtitle) return option.subtitle;
  const normalizedName = option.name.trim().toLowerCase();
  if (normalizedName === "simple") return "Simple - 1 medallon";
  if (normalizedName === "doble") return "Doble - 2 medallones";
  if (normalizedName === "triple") return "Triple - 3 medallones";
  return option.name || product.subtitle;
}

function MenuCard({ product }: { product: Product }) {
  const sortedOptions = useMemo(
    () => [...product.options].sort((a, b) => a.sortOrder - b.sortOrder),
    [product.options],
  );
  const [selectedOptionId, setSelectedOptionId] = useState(sortedOptions[0]?.id || "");
  const selectedOption = sortedOptions.find((option) => option.id === selectedOptionId) || sortedOptions[0];
  const displayPrice = product.hasOptions && selectedOption ? selectedOption.price : product.price;
  const displayImage = product.hasOptions && selectedOption ? productImage(selectedOption) : productImage(product);
  const displaySubtitle = optionSubtitle(product, selectedOption);
  const disabled = !product.available;

  useEffect(() => {
    if (sortedOptions.length && !sortedOptions.some((option) => option.id === selectedOptionId)) {
      setSelectedOptionId(sortedOptions[0].id);
    }
  }, [selectedOptionId, sortedOptions]);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        disabled
          ? "border-white/10 bg-background/70 opacity-65 grayscale"
          : "border-border/50 bg-background hover:border-primary/50"
      }`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={displayImage}
          alt={product.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackImg;
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {disabled && (
          <div className="absolute inset-x-4 top-4 rounded-lg bg-black/75 px-3 py-2 text-center text-xs font-black uppercase tracking-wide text-white">
            No disponible
          </div>
        )}
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-2xl font-bold uppercase leading-tight tracking-tight text-white">
              {product.title}
            </h3>
            {displaySubtitle && (
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {displaySubtitle}
              </p>
            )}
          </div>
          <span className="shrink-0 whitespace-nowrap text-xl font-black leading-none text-primary">
            {formatPrice(displayPrice)}
          </span>
        </div>

        {product.description && (
          <p className="min-h-[48px] text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        {product.hasOptions && sortedOptions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {product.optionsTitle || "Elegir opcion"}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {sortedOptions.map((option) => {
                const active = selectedOption?.id === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`min-h-[58px] rounded-xl border px-3 py-2 text-sm transition-all ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    } disabled:cursor-not-allowed`}
                  >
                    <div className="truncate font-bold">{option.name}</div>
                    <div className="text-[11px] opacity-80">{formatPrice(option.price)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          disabled={disabled}
          onClick={() => {
            if (product.hasOptions && selectedOption) {
              BurgerActions.addBurgerToCart(optionCartItem(product, selectedOption));
              return;
            }
            BurgerActions.addBurgerToCart({ id: product.id, name: product.title, price: product.price });
          }}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 font-bold text-white transition-colors duration-150 hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:text-white/45"
        >
          {disabled ? "No disponible" : "Agregar al pedido"}
        </button>
      </div>
    </article>
  );
}

function SimpleLine({ product }: { product: Product }) {
  const disabled = !product.available;
  const name = product.description ? `${product.title} - ${product.description}` : product.title;

  return (
    <div className={`flex items-start justify-between gap-3 group ${disabled ? "opacity-45 grayscale" : ""}`}>
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <button
          disabled={disabled}
          onClick={() => BurgerActions.addBurgerToCart({ id: product.id, name, price: product.price })}
          className="mt-1 shrink-0 rounded-full bg-primary/20 p-1 text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-90 disabled:cursor-not-allowed disabled:hover:bg-primary/20 disabled:hover:text-primary"
          aria-label={`Agregar ${name}`}
        >
          <Plus size={14} strokeWidth={3} />
        </button>
        <span className="min-w-0 font-medium leading-tight text-white/80 transition-colors group-hover:text-primary">
          {name}
          {disabled && <span className="ml-2 text-xs font-bold uppercase text-white/50">No disponible</span>}
        </span>
      </div>
      <span className="shrink-0 whitespace-nowrap pt-1 font-bold leading-none text-primary">
        {formatPrice(product.price)}
      </span>
    </div>
  );
}

export function NewMenuSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPublicProducts()
      .then((items) => {
        if (active) setProducts(items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(
    () => products.filter((product) => !product.hidden).sort((a, b) => a.sortOrder - b.sortOrder),
    [products],
  );
  const mainProducts = visible.filter((product) => product.type === "main");
  const drinks = visible.filter((product) => product.type === "drink");
  const extras = visible.filter((product) => product.type === "extra");
  const isEmpty = !loading && visible.length === 0;

  return (
    <>
      <section id="menu" className="scroll-mt-6 bg-card/50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center font-heading text-4xl text-white md:text-5xl">
            Nuestro menu
          </h2>
          {loading ? (
            <div className="flex min-h-[58vh] flex-col items-center justify-center text-center">
              <img
                src="/burger-ensamblando.svg"
                alt="Hamburguesa ensamblandose"
                className="h-32 w-32 md:h-40 md:w-40"
                draggable={false}
              />
              <p className="mt-5 text-sm font-bold uppercase tracking-wide text-primary">
                Esto nos toma solo 2 segundos
              </p>
            </div>
          ) : isEmpty ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <h3 className="text-xl font-black text-white">Todavia no hay productos cargados</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Este menu nuevo muestra solamente los productos guardados desde el administrador.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {mainProducts.map((product) => (
                <MenuCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className="space-y-8">
              <h2 className="inline-block border-b border-primary/20 pb-4 font-heading text-3xl text-white">
                Bebidas
              </h2>
              <div className="space-y-6">
                {drinks.map((product) => (
                  <SimpleLine key={product.id} product={product} />
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="inline-block border-b border-primary/20 pb-4 font-heading text-3xl text-white">
                Extras
              </h2>
              <div className="space-y-6">
                {extras.map((product) => (
                  <SimpleLine key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
