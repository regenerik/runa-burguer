import React from "react";
import { Header } from "@/components/burger-shop/Header";
import { Footer } from "@/components/burger-shop/Footer";
import { Button } from "@/components/ui/button";
import { Link, useLocation, Navigate } from "react-router-dom";
import { Ticket, ArrowLeft, Share2, Copy } from "lucide-react";
import { toast } from "sonner";

export default function Cupon() {
  const location = useLocation();
  const celular = location.state?.celular as string;

  if (!celular) {
    return <Navigate to="/" replace />;
  }

  const cleanCelular = celular.replace(/\D/g, "");
  const digit3 = cleanCelular[2] || "X";
  const digit4 = cleanCelular[3] || "X";
  const digit10 = cleanCelular[9] || "X";
  const couponCode = `RB${digit3}${digit4}${digit10}DSTO`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
    toast.success("C\u00f3digo copiado al portapapeles");
  };

  const HERO_BG = "https://cdn.builder.io/api/v1/image/assets%2Fadca80ee8fc74b4799929f9b24a54891%2Fa0d7669be6284f8faf969db0f4292eb3?format=webp&width=1600&height=1000";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col relative">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-30 pointer-events-none -z-10"></div>

      <div
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      >
        <div className="absolute inset-0 bg-background/95"></div>
      </div>

      <Header />

      <main className="flex-1 container mx-auto px-4 pt-40 pb-20 relative z-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8 animate-fade-in text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-4">
              <Ticket size={40} className="text-primary animate-bounce" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading text-white tracking-tighter uppercase">
              ¡Gracias por tu {"tiempo".toUpperCase()}!
            </h1>
            <p className="text-muted-foreground text-lg">Presentá este cupón en tu próxima compra</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-orange-500/50 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black/60 border-2 border-primary/30 rounded-3xl p-10 backdrop-blur-xl">
              <div className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 opacity-70">Tu código de descuento</div>
              <div className="text-5xl md:text-6xl font-heading text-white tracking-widest mb-8 selection:bg-primary selection:text-white">
                {couponCode}
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={copyToClipboard}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-6 font-bold flex gap-2"
                >
                  <Copy size={18} />
                  COPIAR
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 font-bold flex gap-2"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Mi cupón de Runa Burger",
                        text: `¡Mirá mi cupón de descuento para Runa Burger: ${couponCode}!`,
                        url: window.location.href,
                      });
                    } else {
                      copyToClipboard();
                    }
                  }}
                >
                  <Share2 size={18} />
                  COMPARTIR
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Link to="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-white transition-colors gap-2">
                <ArrowLeft size={18} />
                VOLVER AL INICIO
              </Button>
            </Link>
          </div>
        </div>
      </main>


    </div>
  );
}
