import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/burger-shop/Header";
import { Footer } from "@/components/burger-shop/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

type FormPayload = {
  nombre: string;
  celular: string;
  preg1: string;
  preg2: string;
  preg3: string;
  libre: string;
};

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string;

type SheetResponseOk = { ok: true };
type SheetResponseFail = { ok: false; reason: string; error?: string };
type SheetResponse = SheetResponseOk | SheetResponseFail;

type EnvioResultado =
  | { status: "success" }
  | { status: "duplicate"; message: string }
  | { status: "error"; message: string };

type SheetResponseAny = {
  ok: boolean;
  reason?: string;
  error?: string;
};

export async function enviarAPlanilla(payload: FormPayload): Promise<EnvioResultado> {
  if (!GOOGLE_SCRIPT_URL) {
    console.error("VITE_GOOGLE_SCRIPT_URL is not defined");
    return { status: "error", message: "Configuración incompleta (falta URL)." };
  }

  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => null)) as SheetResponseAny | null;

  if (!res.ok || !data) {
    return { status: "error", message: "Error enviando a Google Sheets." };
  }

  if (data.ok === true) {
    return { status: "success" };
  }

  // acá no hay discusión: reason puede o no existir, pero si existe la leemos
  if (data.reason === "duplicate") {
    return {
      status: "duplicate",
      message: "Ese celular ya cargó el formulario. No te hagas el vivo.",
    };
  }

  return {
    status: "error",
    message: data.error || "Error guardando en la planilla.",
  };
}

export default function Form() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormPayload>({
    nombre: "",
    celular: "",
    preg1: "5",
    preg2: "5",
    preg3: "5",
    libre: "",
  });

  const HERO_BG = "https://cdn.builder.io/api/v1/image/assets%2Fadca80ee8fc74b4799929f9b24a54891%2Fa0d7669be6284f8faf969db0f4292eb3?format=webp&width=1600&height=1000";

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!formData.nombre || !formData.celular) {
    toast.error("Por favor completa tu nombre y celular");
    return;
  }

  if (formData.celular.replace(/\D/g, "").length < 10) {
    toast.error("El número de celular debe tener al menos 10 dígitos");
    return;
  }

  setLoading(true);
  try {
    const result = await enviarAPlanilla(formData);

    if (result.status === "duplicate") {
      toast.error(result.message);
      return; // corta y NO va al cupón
    }

    if (result.status === "error") {
      toast.error(result.message);
      return; // corta y NO va al cupón
    }

    // success -> recién acá navegás
    navigate("/cupon", { state: { celular: formData.celular } });

  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Hubo un error al enviar el formulario");
  } finally {
    setLoading(false);
  }
}

  const RatingField = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: string; 
    onChange: (val: string) => void 
  }) => (
    <div className="space-y-3">
      <Label className="text-white text-sm font-bold uppercase tracking-wide">{label}</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex justify-between items-center gap-2 bg-white/5 p-4 rounded-xl border border-white/10"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="flex flex-col items-center gap-2">
            <RadioGroupItem value={num.toString()} id={`${label}-${num}`} className="border-primary" />
            <Label htmlFor={`${label}-${num}`} className="text-xs text-muted-foreground">{num}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col relative">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-30 pointer-events-none -z-10"></div>

      <div
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      >
        <div className="absolute inset-0 bg-background/90"></div>
      </div>

      <Header />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 relative z-10 flex flex-col items-center">
        <div className="w-full max-w-lg space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-heading text-white tracking-tighter uppercase">
              Tu {"opinión".toUpperCase()} vale
            </h1>
            <p className="text-muted-foreground">Ayudanos a mejorar y obtené un beneficio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-white text-xs font-bold uppercase tracking-wider">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl py-6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular" className="text-white text-xs font-bold uppercase tracking-wider">Celular</Label>
                <Input
                  id="celular"
                  placeholder="Ej: 11 1234 5678"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl py-6"
                />
              </div>
            </div>

            <RatingField
              label="¿Te gustó la experiencia?"
              value={formData.preg1}
              onChange={(val) => setFormData({ ...formData, preg1: val })}
            />

            <RatingField
              label="¿Te pareció bien el tamaño de la comida?"
              value={formData.preg2}
              onChange={(val) => setFormData({ ...formData, preg2: val })}
            />

            <RatingField
              label="¿Recomendarias Runa Burger a tus amigos?"
              value={formData.preg3}
              onChange={(val) => setFormData({ ...formData, preg3: val })}
            />

            <div className="space-y-2">
              <Label htmlFor="libre" className="text-white text-xs font-bold uppercase tracking-wider">Dejanos tu comentario</Label>
              <Textarea
                id="libre"
                placeholder="Contanos algo más..."
                value={formData.libre}
                onChange={(e) => setFormData({ ...formData, libre: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-7 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xl rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-primary/20"
            >
              {loading ? "Enviando..." : "ENVIAR Y OBTENER CUPÓN"}
            </Button>
          </form>
        </div>
      </main>


    </div>
  );
}
