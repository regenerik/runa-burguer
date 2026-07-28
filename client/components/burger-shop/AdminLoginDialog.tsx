import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/lib/products/productApi";

export function AdminLoginDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(email, password);
      setOpen(false);
      navigate("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo iniciar sesion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/80 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white/55 shadow-lg shadow-black/25 backdrop-blur transition hover:border-primary/40 hover:text-primary"
          aria-label="Acceso administrador"
        >
          <Lock size={13} />
          Admin
        </button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-background text-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Administrador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Contrasena</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="bg-white/5"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-bold">
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
