import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/burger-shop/Header";
import { fetchAdminProducts, getAdminToken, saveAdminProduct, uploadProductImage } from "@/lib/products/productApi";
import { productImage } from "@/lib/products/imageAssets";
import type { Product, ProductOption, ProductType } from "@shared/products";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function emptyProduct(): Product {
  const id = `producto-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  return {
    id,
    type: "main",
    title: "",
    subtitle: "",
    description: "",
    price: 0,
    imageUrl: "",
    imagePublicId: "",
    hasOptions: false,
    optionsTitle: "",
    options: [],
    available: true,
    hidden: false,
    sortOrder: 999,
    createdAt: now,
    updatedAt: now,
  };
}

function optionTemplate(productId: string, index: number): ProductOption {
  return {
    id: `${productId}-opcion-${Date.now().toString(36)}-${index + 1}`,
    name: "",
    subtitle: "",
    price: 0,
    imageUrl: "",
    imagePublicId: "",
    sortOrder: (index + 1) * 10,
  };
}

function Field({ children }: { label?: string; children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function ImageUploadButton({
  label,
  onUploaded,
}: {
  label: string;
  onUploaded: (asset: { imageUrl: string; publicId: string }) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona una imagen valida.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast.error("La imagen supera 12 MB.");
      return;
    }
    setBusy(true);
    try {
      const asset = await uploadProductImage(file);
      onUploaded(asset);
      toast.success("Imagen subida.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <label className="inline-flex cursor-pointer items-center rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white hover:bg-white/10">
      <ImagePlus size={15} className="mr-2" />
      {busy ? "Subiendo..." : label}
      <input type="file" accept="image/*" onChange={handleChange} disabled={busy} className="sr-only" />
    </label>
  );
}

export default function AdminProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [product, setProduct] = useState<Product>(emptyProduct);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin");
      return;
    }
    if (isNew) return;
    fetchAdminProducts()
      .then((products) => {
        const found = products.find((current) => current.id === id);
        if (!found) {
          toast.error("Producto no encontrado.");
          navigate("/admin");
          return;
        }
        setProduct(found);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "No se pudo cargar."))
      .finally(() => setLoading(false));
  }, [id, isNew, navigate]);

  const previewImage = useMemo(() => productImage(product), [product]);

  function patchProduct(patch: Partial<Product>) {
    setProduct((current) => ({ ...current, ...patch }));
  }

  function patchOption(optionId: string, patch: Partial<ProductOption>) {
    setProduct((current) => ({
      ...current,
      options: current.options.map((option) => (option.id === optionId ? { ...option, ...patch } : option)),
    }));
  }

  function removeOption(optionId: string) {
    setProduct((current) => ({
      ...current,
      options: current.options.filter((option) => option.id !== optionId),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const title = product.title.trim();
    if (!title) {
      toast.error("El producto necesita titulo.");
      return;
    }

    const next: Product = {
      ...product,
      id: product.id || slugify(title) || `producto-${Date.now().toString(36)}`,
      title,
      price: Number(product.price || 0),
      hasOptions: Boolean(product.hasOptions),
      options: product.hasOptions
        ? product.options
            .filter((option) => option.name.trim())
            .map((option, index) => ({
              ...option,
              id: option.id || `${slugify(title)}-opcion-${index + 1}`,
              name: option.name.trim(),
              subtitle: option.subtitle || "",
              price: Number(option.price || 0),
              sortOrder: Number(option.sortOrder || (index + 1) * 10),
            }))
        : [],
      updatedAt: new Date().toISOString(),
    };

    setSaving(true);
    try {
      await saveAdminProduct(next);
      toast.success("Producto guardado.");
      navigate("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white">
        <Header />
        <main className="container mx-auto px-4 pt-28">Cargando producto...</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pb-20 pt-28">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button asChild variant="secondary">
            <Link to="/admin">
              <ArrowLeft size={16} className="mr-1" /> Volver
            </Link>
          </Button>
          <h1 className="text-right text-2xl font-black text-white">{isNew ? "Agregar producto" : "Editar producto"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-5 rounded-2xl border border-white/10 bg-card p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Titulo">
                <Label htmlFor="title">Titulo</Label>
                <Input id="title" value={product.title} onChange={(event) => patchProduct({ title: event.target.value })} className="bg-white/5" />
              </Field>
              <Field label="Tipo">
                <Label htmlFor="type">Tipo de producto</Label>
                <select
                  id="type"
                  value={product.type}
                  onChange={(event) => patchProduct({ type: event.target.value as ProductType })}
                  className="h-10 w-full rounded-md border border-input bg-white/5 px-3 text-sm text-white"
                >
                  <option value="main">Plato principal</option>
                  <option value="extra">Extra</option>
                  <option value="drink">Bebida</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Subtitulo">
                <Label htmlFor="subtitle">Subtitulo</Label>
                <Input id="subtitle" value={product.subtitle || ""} onChange={(event) => patchProduct({ subtitle: event.target.value })} className="bg-white/5" />
              </Field>
              <Field label="Precio">
                <Label htmlFor="price">Precio</Label>
                <Input id="price" type="number" value={product.price} onChange={(event) => patchProduct({ price: Number(event.target.value) })} className="bg-white/5" />
              </Field>
            </div>

            <Field label="Descripcion">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea id="description" value={product.description || ""} onChange={(event) => patchProduct({ description: event.target.value })} className="min-h-[110px] bg-white/5" />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white">
                <input type="checkbox" checked={product.available} onChange={(event) => patchProduct({ available: event.target.checked })} />
                Disponible
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white">
                <input type="checkbox" checked={product.hidden} onChange={(event) => patchProduct({ hidden: event.target.checked })} />
                Escondido
              </label>
              <Field label="Orden">
                <Label htmlFor="sortOrder">Orden</Label>
                <Input id="sortOrder" type="number" value={product.sortOrder} onChange={(event) => patchProduct({ sortOrder: Number(event.target.value) })} className="bg-white/5" />
              </Field>
            </div>

            {product.type === "main" && (
              <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Label>Foto principal</Label>
                  <ImageUploadButton
                    label={product.imageUrl ? "Reemplazar foto" : "Subir foto"}
                    onUploaded={(asset) => patchProduct({ imageUrl: asset.imageUrl, imagePublicId: asset.publicId, imageKey: "" })}
                  />
                </div>
                <Input
                  placeholder="URL de imagen"
                  value={product.imageUrl || ""}
                  onChange={(event) => patchProduct({ imageUrl: event.target.value, imageKey: "" })}
                  className="bg-white/5"
                />
              </div>
            )}

            <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <label className="flex items-center gap-2 text-sm font-bold text-white">
                <input
                  type="checkbox"
                  checked={product.hasOptions}
                  onChange={(event) =>
                    patchProduct({
                      hasOptions: event.target.checked,
                      options: event.target.checked && product.options.length === 0 ? [optionTemplate(product.id, 0)] : product.options,
                    })
                  }
                />
                Producto multiple con opciones internas
              </label>

              {product.hasOptions && (
                <div className="space-y-4">
                  <Field label="Titulo de opciones">
                    <Label htmlFor="optionsTitle">Titulo de opciones</Label>
                    <Input
                      id="optionsTitle"
                      placeholder="Elegi cantidad de medallones"
                      value={product.optionsTitle || ""}
                      onChange={(event) => patchProduct({ optionsTitle: event.target.value })}
                      className="bg-white/5"
                    />
                  </Field>
                  <div className="space-y-3">
                    {product.options.map((option, index) => (
                      <div key={option.id} className="rounded-xl border border-white/10 bg-background/50 p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <strong className="text-sm text-white">Opcion {index + 1}</strong>
                          <Button type="button" size="sm" variant="destructive" onClick={() => removeOption(option.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-[1.2fr_1.2fr_0.9fr_0.75fr]">
                          <Field>
                            <Label htmlFor={`${option.id}-name`}>Nombre de opcion</Label>
                            <Input
                              id={`${option.id}-name`}
                              placeholder="Simple, Doble, Triple"
                              value={option.name}
                              onChange={(event) => patchOption(option.id, { name: event.target.value })}
                              className="bg-white/5"
                            />
                          </Field>
                          <Field>
                            <Label htmlFor={`${option.id}-subtitle`}>Subtitulo de opcion</Label>
                            <Input
                              id={`${option.id}-subtitle`}
                              placeholder="Doble - 2 medallones"
                              value={option.subtitle || ""}
                              onChange={(event) => patchOption(option.id, { subtitle: event.target.value })}
                              className="bg-white/5"
                            />
                          </Field>
                          <Field>
                            <Label htmlFor={`${option.id}-price`}>Precio de opcion</Label>
                            <Input
                              id={`${option.id}-price`}
                              type="number"
                              placeholder="13000"
                              value={option.price}
                              onChange={(event) => patchOption(option.id, { price: Number(event.target.value) })}
                              className="bg-white/5"
                            />
                          </Field>
                          <Field>
                            <Label htmlFor={`${option.id}-sort`}>Orden de opcion</Label>
                            <Input
                              id={`${option.id}-sort`}
                              type="number"
                              placeholder="10"
                              value={option.sortOrder}
                              onChange={(event) => patchOption(option.id, { sortOrder: Number(event.target.value) })}
                              className="bg-white/5"
                            />
                          </Field>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          El orden solo define como se muestran las opciones. Ejemplo: 10, 20, 30.
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <ImageUploadButton
                            label={option.imageUrl ? "Reemplazar foto opcion" : "Subir foto opcion"}
                            onUploaded={(asset) => patchOption(option.id, { imageUrl: asset.imageUrl, imagePublicId: asset.publicId, imageKey: "" })}
                          />
                          <Input
                            placeholder="URL de imagen de opcion"
                            value={option.imageUrl || ""}
                            onChange={(event) => patchOption(option.id, { imageUrl: event.target.value, imageKey: "" })}
                            className="min-w-[240px] flex-1 bg-white/5"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="secondary" onClick={() => patchProduct({ options: [...product.options, optionTemplate(product.id, product.options.length)] })}>
                    <Plus size={16} className="mr-1" /> Agregar opcion
                  </Button>
                </div>
              )}
            </div>

            <Button type="submit" disabled={saving} className="w-full py-6 text-lg font-black">
              <Save size={18} className="mr-2" />
              {saving ? "Guardando..." : "Guardar producto"}
            </Button>
          </section>

          <aside className="space-y-4 rounded-2xl border border-white/10 bg-card p-5">
            <h2 className="text-lg font-black text-white">Vista rapida</h2>
            {product.type === "main" && (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-background">
                <img src={previewImage} alt={product.title || "Producto"} className="aspect-square w-full object-cover" />
              </div>
            )}
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">{product.title || "Sin titulo"}</h3>
              <p className="text-primary">${Number(product.price || 0).toLocaleString("es-AR")}</p>
              <p className="text-sm text-muted-foreground">{product.description || "Sin descripcion"}</p>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}
