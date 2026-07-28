import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { RequestHandler, Router } from "express";
import { z } from "zod";
import { defaultProducts } from "../../shared/defaultProducts";
import type { ApiErrorResponse, Product, ProductMutationResponse, ProductsResponse, ProductOption } from "../../shared/products";

const optionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  subtitle: z.string().optional().default(""),
  price: z.coerce.number().min(0),
  imageUrl: z.string().optional().default(""),
  imagePublicId: z.string().optional().default(""),
  imageKey: z.string().optional().default(""),
  sortOrder: z.coerce.number().default(0),
});

const productSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["main", "extra", "drink"]),
  title: z.string().min(1),
  subtitle: z.string().optional().default(""),
  description: z.string().optional().default(""),
  price: z.coerce.number().min(0),
  imageUrl: z.string().optional().default(""),
  imagePublicId: z.string().optional().default(""),
  imageKey: z.string().optional().default(""),
  hasOptions: z.coerce.boolean().default(false),
  optionsTitle: z.string().optional().default(""),
  options: z.array(optionSchema).default([]),
  available: z.coerce.boolean().default(true),
  hidden: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
  createdAt: z.string().optional().default(""),
  updatedAt: z.string().optional().default(""),
});

const localProductsPath = path.resolve(process.cwd(), "server", "data", "products.local.json");

type SheetResult =
  | ({ ok: true; service?: string; products?: Product[]; product?: Product; warning?: string })
  | ({ ok: false; error?: string });

function jsonError(error: string, status = 400): [ApiErrorResponse, number] {
  return [{ ok: false, error }, status];
}

function sortProducts(products: Product[]) {
  return [...products].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

function normalizeProduct(input: unknown): Product {
  const product = productSchema.parse(input);
  const now = new Date().toISOString();
  const options: ProductOption[] = product.hasOptions
    ? product.options
        .map((option, index) => ({
          id: option.id || `option-${index + 1}`,
          name: option.name || "",
          subtitle: option.subtitle || "",
          price: Number(option.price || 0),
          imageUrl: option.imageUrl || "",
          imagePublicId: option.imagePublicId || "",
          imageKey: option.imageKey || "",
          sortOrder: Number(option.sortOrder || (index + 1) * 10),
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  return {
    id: product.id,
    type: product.type,
    title: product.title,
    subtitle: product.subtitle || "",
    description: product.description || "",
    price: Number(product.price),
    imageUrl: product.imageUrl || "",
    imagePublicId: product.imagePublicId || "",
    imageKey: product.imageKey || "",
    hasOptions: Boolean(product.hasOptions),
    optionsTitle: product.optionsTitle || "",
    options,
    available: Boolean(product.available),
    hidden: Boolean(product.hidden),
    sortOrder: Number(product.sortOrder || 0),
    createdAt: product.createdAt || now,
    updatedAt: now,
  };
}

async function readLocalProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(localProductsPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultProducts;
    return sortProducts(parsed.map(normalizeProduct));
  } catch {
    return defaultProducts;
  }
}

async function writeLocalProducts(products: Product[]) {
  await fs.mkdir(path.dirname(localProductsPath), { recursive: true });
  await fs.writeFile(localProductsPath, JSON.stringify(sortProducts(products), null, 2), "utf8");
}

async function callGoogleProducts(payload: Record<string, unknown>): Promise<SheetResult | null> {
  const url = process.env.GOOGLE_SCRIPT_URL || process.env.VITE_GOOGLE_SCRIPT_URL;
  if (!url) return null;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      service: "products",
      token: process.env.GOOGLE_SCRIPT_ADMIN_TOKEN || process.env.GOOGLE_SCRIPT_SECRET || "",
      ...payload,
    }),
  });

  const data = (await response.json().catch(() => null)) as SheetResult | null;
  if (!response.ok || !data) {
    throw new Error("Google Apps Script no respondio correctamente.");
  }
  return data;
}

async function listProducts(includeHidden: boolean): Promise<ProductsResponse> {
  try {
    const sheet = await callGoogleProducts({ action: "listProducts", includeHidden });
    if (sheet?.ok && Array.isArray(sheet.products)) {
      return {
        ok: true,
        products: sortProducts(sheet.products.map(normalizeProduct)).filter((product) => includeHidden || !product.hidden),
        source: "google-sheets",
      };
    }
    if (sheet?.ok === false) throw new Error(sheet.error || "No se pudieron leer los productos.");
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
  }

  const local = await readLocalProducts();
  const hasLocal = await fs.stat(localProductsPath).then(() => true).catch(() => false);
  return {
    ok: true,
    products: sortProducts(local).filter((product) => includeHidden || !product.hidden),
    source: hasLocal ? "local" : "seed",
  };
}

async function upsertProduct(product: Product): Promise<ProductMutationResponse> {
  try {
    const sheet = await callGoogleProducts({ action: "upsertProduct", product });
    if (sheet?.ok && sheet.product) return { ok: true, product: sheet.product, warning: sheet.warning };
    if (sheet?.ok === false) throw new Error(sheet.error || "No se pudo guardar el producto.");
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
  }

  const products = await readLocalProducts();
  const index = products.findIndex((current) => current.id === product.id);
  if (index >= 0) products[index] = product;
  else products.push(product);
  await writeLocalProducts(products);
  return { ok: true, product };
}

async function deleteProduct(id: string): Promise<ProductMutationResponse> {
  try {
    const sheet = await callGoogleProducts({ action: "deleteProduct", id });
    if (sheet?.ok && sheet.service === "products") return { ok: true, warning: sheet.warning };
    if (sheet?.ok === false) throw new Error(sheet.error || "No se pudo eliminar el producto.");
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
  }

  const products = (await readLocalProducts()).filter((product) => product.id !== id);
  await writeLocalProducts(products);
  return { ok: true };
}

function constantSafeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function signSession(payload: Record<string, unknown>) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.GOOGLE_SCRIPT_ADMIN_TOKEN || "dev-runa-admin-secret";
  const body = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function readSession(token = "") {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  try {
    const raw = Buffer.from(body, "base64url").toString("utf8");
    const expected = signSession(JSON.parse(raw)).split(".")[1];
    if (!constantSafeEqual(signature, expected)) return null;
    const payload = JSON.parse(raw) as { exp?: number; email?: string };
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

const requireAdmin: RequestHandler = (req, res, next) => {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const session = readSession(token);
  if (!session) {
    const [body, status] = jsonError("Sesion administrativa invalida.", 401);
    res.status(status).json(body);
    return;
  }
  next();
};

export const productsRouter = Router();

productsRouter.get("/products", async (req, res) => {
  try {
    res.json(await listProducts(false));
  } catch (error) {
    const [body, status] = jsonError(error instanceof Error ? error.message : "No se pudieron cargar los productos.", 502);
    res.status(status).json(body);
  }
});

productsRouter.post("/admin/login", (req, res) => {
  const email = String(req.body?.email || "");
  const password = String(req.body?.password || "");
  const expectedEmail = process.env.ADMIN_EMAIL || "admin@runaburger.com";
  const expectedPassword = process.env.ADMIN_PASSWORD || "";
  const expectedHash = process.env.ADMIN_PASSWORD_SHA256 || "";
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

  const emailOk = constantSafeEqual(email.toLowerCase(), expectedEmail.toLowerCase());
  const passwordOk = expectedPassword
    ? constantSafeEqual(password, expectedPassword)
    : Boolean(expectedHash && constantSafeEqual(passwordHash, expectedHash));

  if (!emailOk || !passwordOk) {
    const [body, status] = jsonError("Email o contrasena incorrectos.", 401);
    res.status(status).json(body);
    return;
  }

  const token = signSession({ email, exp: Date.now() + 1000 * 60 * 60 * 12 });
  res.json({ ok: true, token });
});

productsRouter.get("/admin/products", requireAdmin, async (_req, res) => {
  try {
    res.json(await listProducts(true));
  } catch (error) {
    const [body, status] = jsonError(error instanceof Error ? error.message : "No se pudieron cargar los productos.", 502);
    res.status(status).json(body);
  }
});

productsRouter.post("/admin/products", requireAdmin, async (req, res) => {
  try {
    const product = normalizeProduct(req.body?.product);
    res.json(await upsertProduct(product));
  } catch (error) {
    const [body, status] = jsonError(error instanceof Error ? error.message : "No se pudo guardar el producto.");
    res.status(status).json(body);
  }
});

productsRouter.delete("/admin/products/:id", requireAdmin, async (req, res) => {
  try {
    res.json(await deleteProduct(req.params.id));
  } catch (error) {
    const [body, status] = jsonError(error instanceof Error ? error.message : "No se pudo eliminar el producto.");
    res.status(status).json(body);
  }
});
