import React from "react";
import { Header } from "@/components/burger-shop/Header";
import { Footer } from "@/components/burger-shop/Footer";
import { MessageCircle, MapPin, ClipboardList, Instagram, Utensils } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { Link } from "react-router-dom";

export default function Main() {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Ratti+295,+Ituzaing\u00f3";
  const googleReviewUrl = "https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review";
  const HERO_BG = "https://cdn.builder.io/api/v1/image/assets%2Fadca80ee8fc74b4799929f9b24a54891%2Fa0d7669be6284f8faf969db0f4292eb3?format=webp&width=1600&height=1000";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground flex flex-col">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-30 pointer-events-none -z-10"></div>

      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-right md:bg-center transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      >
        {/* Dark Gradients for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-background/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden z-10">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

        <div className="w-full max-w-md flex flex-col gap-3 items-center">
          {/* Ubicaci\u00f3n snippet */}
         

          <h1 className="text-4xl md:text-5xl font-heading text-white text-center mb-4 tracking-tighter animate-fade-in">
            <span className="text-primary">RUNA</span> TE ESPERA
          </h1>

          <div className="w-full space-y-3 animate-fade-in delay-100">
            {/* Ver Men\u00fa */}
            <Link
              to="/menu"
              className="group flex items-center justify-between w-full px-6 py-4 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-2xl text-white font-bold transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/40 transition-colors">
                  <Utensils size={24} className="text-primary" />
                </div>
                <span className="text-lg">Ver Menú</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity"><path d="m9 18 6-6-6-6"/></svg>
            </Link>

            {/* Pedir por WhatsApp */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full px-6 py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366]/60 rounded-2xl text-white font-bold transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#25D366]/20 rounded-xl group-hover:bg-[#25D366]/40 transition-colors">
                  <MessageCircle size={24} className="text-[#25D366]" fill="currentColor" />
                </div>
                <span className="text-lg">Pedir por WhatsApp</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity text-[#25D366]"><path d="m9 18 6-6-6-6"/></svg>
            </a>

            {/* Ubicaci\u00f3n */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full px-6 py-4 bg-[#D9A05B]/10 hover:bg-[#D9A05B]/20 border border-[#D9A05B]/30 hover:border-[#D9A05B]/60 rounded-2xl text-white font-bold transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#D9A05B]/20 rounded-xl group-hover:bg-[#D9A05B]/40 transition-colors">
                  <MapPin size={24} className="text-[#D9A05B]" />
                </div>
                <span className="text-lg">Ratti 295, Ituzaingó</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity text-[#D9A05B]"><path d="m9 18 6-6-6-6"/></svg>
            </a>

            {/* Encuesta de satisfacci\u00f3n */}
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-white font-bold transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <ClipboardList size={24} className="text-white/70" />
                </div>
                <span className="text-lg">Encuesta de satisfacción</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity"><path d="m9 18 6-6-6-6"/></svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/runa.burger"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-white font-bold transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity">
                  <Instagram size={24} className="text-white" />
                </div>
                <span className="text-lg">runa.burger</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>
        </div>
      </main>

      
    </div>
  );
}
