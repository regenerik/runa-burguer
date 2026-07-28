import React from "react";
import { Header } from "@/components/burger-shop/Header";
import { NewMenuSection } from "@/components/burger-shop/NewMenuSection";

export default function NewMenu() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-30 pointer-events-none -z-10"></div>
      <Header />
      <main>
        <NewMenuSection />
      </main>
    </div>
  );
}
