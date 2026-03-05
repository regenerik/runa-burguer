import React from "react";
import { Header } from "@/components/burger-shop/Header";
import { Hero } from "@/components/burger-shop/Hero";
import { MenuSection } from "@/components/burger-shop/MenuSection";
import { ExtrasSection } from "@/components/burger-shop/ExtrasSection";
import { Footer } from "@/components/burger-shop/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-30 pointer-events-none -z-10"></div>
      <Header />
      <main>
        {/* <Hero /> */}
        <MenuSection />
        <ExtrasSection />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
