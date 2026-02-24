import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ShoppingCart, Minus, Plus, HelpCircle, X, MessageCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cartStore } from "@/lib/flux/CartStore";
import { BurgerActions } from "@/lib/flux/Actions";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { useCartStore } from "@/lib/flux/useCartStore";

export function Header() {
  const { cartCount, items, total } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 400);
      return () => clearTimeout(timer);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDynamicWhatsAppLink = () => getWhatsAppLink();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fadca80ee8fc74b4799929f9b24a54891%2F9ad1d36bc1b44bb1a4e0fc50994bc3c1?format=webp&width=400"
              alt="RUNA Logo"
              className="h-8 md:h-9 w-auto object-contain"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#menu" className="text-sm font-medium hover:text-primary transition-colors">
              Menú
            </a>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 group"
              >
                Cómo pedir
                <HelpCircle size={14} className="opacity-50 group-hover:opacity-100" />
              </button>
              {showTooltip && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl p-3 z-50 animate-fade-in">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Agrega al carrito todo lo que quieras comer y después dale a cualquier botón de pedir.
                  </p>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-card border-t border-l border-border rotate-45"></div>
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className={cn(
                "p-2 text-white/80 hover:text-primary transition-colors relative",
                isCartOpen && "text-primary",
                animateCart && "animate-shake"
              )}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-primary/20">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className={cn(
                "mt-3 p-4 bg-card border border-border rounded-2xl shadow-2xl z-50 animate-fade-in",
                /* MÓVIL: Se vuelve un panel flotante centrado */
                "fixed left-4 right-4 top-20 w-auto",
                /* DESKTOP: Vuelve a ser un dropdown anclado al botón */
                "md:absolute md:top-full md:right-0 md:left-auto md:w-80 md:origin-top-right"
              )}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg">Tu pedido</h4>
                  <button onClick={() => setIsCartOpen(false)} className="text-muted-foreground hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                {cartCount === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <ShoppingCart size={32} className="mx-auto opacity-20" />
                    <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 group">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-white">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">${item.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                            <button
                              onClick={() => BurgerActions.decreaseQuantity(item.id)}
                              className="p-1 hover:bg-white/10 rounded transition-colors text-primary"
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => BurgerActions.addBurgerToCart(item)}
                              className="p-1 hover:bg-white/10 rounded transition-colors text-primary"
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-primary">${(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 mt-2">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                        <span className="text-xl font-black text-primary">${total.toLocaleString()}</span>
                      </div>
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        Finalizar pedido
                        <MessageCircle size={18} fill="white" stroke="none" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 relative"
          >
            WhatsApp
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-background shadow-lg animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}
