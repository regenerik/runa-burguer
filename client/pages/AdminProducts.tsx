import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Edit, Eye, EyeOff, LogOut, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/burger-shop/Header";
import {
  clearAdminToken,
  deleteAdminProduct,
  fetchAdminProducts,
  getAdminToken,
  loginAdmin,
  saveAdminProduct,
} from "@/lib/products/productApi";
import type { Product } from "@shared/products";

function formatPrice(price: number) {
  return `$${Number(price || 0).toLocaleString("es-AR")}`;
}

function typeLabel(type: Product["type"]) {
  if (type === "drink") return "Bebida";
  if (type === "extra") return "Extra";
  return "Principal";
}

function typeTone(type: Product["type"]) {
  if (type === "drink") {
    return {
      row: "border-sky-300/15 bg-sky-400/[0.055]",
      badge: "border-sky-300/30 text-sky-200 bg-sky-300/10",
    };
  }
  if (type === "extra") {
    return {
      row: "border-emerald-300/15 bg-emerald-400/[0.055]",
      badge: "border-emerald-300/30 text-emerald-200 bg-emerald-300/10",
    };
  }
  return {
    row: "border-primary/20 bg-primary/[0.07]",
    badge: "border-primary/35 text-primary bg-primary/10",
  };
}

function matchesSearch(product: Product, query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return true;
  const haystack = [
    product.title,
    product.subtitle,
    product.description,
    typeLabel(product.type),
    String(product.price),
    ...product.options.map((option) => option.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(value);
}

function cloneProduct(product: Product, title: string): Product {
  const id = `${product.id}-copia-${Date.now().toString(36)}`;
  return {
    ...product,
    id,
    title,
    hidden: true,
    sortOrder: product.sortOrder + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: product.options.map((option, index) => ({
      ...option,
      id: `${id}-opcion-${index + 1}`,
    })),
  };
}

function AdminLoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(email, password);
      onLogin();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo iniciar sesion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-32 w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-card p-6">
      <h1 className="text-2xl font-black text-white">Admin Runa</h1>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="bg-white/5" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contrasena</Label>
        <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="bg-white/5" />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}

function ProductRow({ product, onChanged }: { product: Product; onChanged: () => Promise<void> }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const tone = typeTone(product.type);

  async function mutate(next: Product, message: string) {
    setBusy(true);
    try {
      await saveAdminProduct(next);
      toast.success(message);
      await onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Eliminar "${product.title}"? Esta accion no se puede deshacer.`)) return;
    setBusy(true);
    try {
      await deleteAdminProduct(product.id);
      toast.success("Producto eliminado.");
      await onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDuplicate() {
    const title = window.prompt("Titulo para la copia", `${product.title} copia`);
    if (!title?.trim()) return;
    await mutate(cloneProduct(product, title.trim()), "Producto duplicado y escondido.");
  }

  return (
    <div className={`grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_auto] ${tone.row} ${!product.available ? "opacity-55 grayscale" : ""}`}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-lg font-black text-white">{product.title}</h3>
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase ${tone.badge}`}>
            {typeLabel(product.type)}
          </span>
          {!product.available && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase text-white/60">No disponible</span>}
          {product.hidden && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase text-white/60">Escondido</span>}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatPrice(product.price)} {product.hasOptions ? `- ${product.options.length} opciones` : ""}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" disabled={busy} onClick={() => navigate(`/admin/products/${product.id}`)}>
          <Edit size={15} className="mr-1" /> Editar
        </Button>
        <Button size="sm" variant="secondary" disabled={busy} onClick={handleDuplicate}>
          <Copy size={15} className="mr-1" /> Duplicar
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={busy}
          onClick={() => mutate({ ...product, available: !product.available }, product.available ? "Producto indisponible." : "Producto disponible.")}
        >
          {product.available ? "Indisponibilizar" : "Disponibilizar"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={busy}
          onClick={() => mutate({ ...product, hidden: !product.hidden }, product.hidden ? "Producto visible." : "Producto escondido.")}
        >
          {product.hidden ? <Eye size={15} className="mr-1" /> : <EyeOff size={15} className="mr-1" />}
          {product.hidden ? "Mostrar" : "Esconder"}
        </Button>
        <Button size="sm" variant="destructive" disabled={busy} onClick={handleDelete}>
          <Trash2 size={15} className="mr-1" /> Eliminar
        </Button>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logged, setLogged] = useState(Boolean(getAdminToken()));
  const [search, setSearch] = useState("");

  async function loadProducts(mode: "initial" | "refresh" = "initial") {
    if (mode === "initial") setLoading(true);
    else setRefreshing(true);
    try {
      setProducts(await fetchAdminProducts());
    } catch (error) {
      if (String(error).includes("Sesion")) {
        clearAdminToken();
        setLogged(false);
      }
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los productos.");
    } finally {
      if (mode === "initial") setLoading(false);
      else setRefreshing(false);
    }
  }

  useEffect(() => {
    if (logged) loadProducts();
  }, [logged]);

  const filteredProducts = useMemo(
    () => products.filter((product) => matchesSearch(product, search)),
    [products, search],
  );
  const visible = useMemo(() => filteredProducts.filter((product) => !product.hidden), [filteredProducts]);
  const hidden = useMemo(() => filteredProducts.filter((product) => product.hidden), [filteredProducts]);

  if (!logged) {
    return (
      <div className="min-h-screen bg-background text-white">
        <AdminLoginForm onLogin={() => setLogged(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto space-y-8 px-4 pb-20 pt-28">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-white">Productos</h1>
            <p className="text-sm text-muted-foreground">Editor de productos del menu publico.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link to="/menu">Ver menu</Link>
            </Button>
            <Button onClick={() => navigate("/admin/products/new")}>
              <Plus size={16} className="mr-1" /> Agregar producto
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                clearAdminToken();
                setLogged(false);
              }}
            >
              <LogOut size={16} className="mr-1" /> Salir
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, tipo, precio u opcion..."
              className="bg-white/5 pl-10"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
            <span className="rounded-full border border-primary/25 bg-primary/[0.07] px-2 py-1 text-primary">Principal</span>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/[0.055] px-2 py-1 text-emerald-200">Extra</span>
            <span className="rounded-full border border-sky-300/20 bg-sky-400/[0.055] px-2 py-1 text-sky-200">Bebida</span>
            {refreshing && <span className="text-white/50">Actualizando...</span>}
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white">Cargando productos...</div>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="text-xl font-black text-white">Productos visibles</h2>
              {visible.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted-foreground">
                  No hay productos visibles que coincidan con la busqueda.
                </div>
              ) : (
                visible.map((product) => (
                  <ProductRow key={product.id} product={product} onChanged={() => loadProducts("refresh")} />
                ))
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-black text-white">Productos escondidos</h2>
              {hidden.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted-foreground">
                  {search ? "No hay productos escondidos que coincidan con la busqueda." : "No hay productos escondidos."}
                </div>
              ) : (
                hidden.map((product) => <ProductRow key={product.id} product={product} onChanged={() => loadProducts("refresh")} />)
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
