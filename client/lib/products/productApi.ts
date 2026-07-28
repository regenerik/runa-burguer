import { defaultProducts } from "@shared/defaultProducts";
import type { Product, ProductMutationResponse, ProductsResponse } from "@shared/products";

const TOKEN_KEY = "runa_admin_token";
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;

async function parseApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || data.ok === false) {
    throw new Error(data?.error || "La operacion no se pudo completar.");
  }
  return data as T;
}

async function callGoogleAppsScript<T>(payload: Record<string, unknown>): Promise<T> {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Falta configurar VITE_GOOGLE_SCRIPT_URL.");
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ service: "products", ...payload }),
  });

  return parseApiResponse<T>(response);
}

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function loginAdmin(email: string, password: string) {
  if (GOOGLE_SCRIPT_URL) {
    const data = await callGoogleAppsScript<{ ok: true; token: string }>({
      action: "adminLogin",
      email,
      password,
    });
    setAdminToken(data.token);
    return data.token;
  }

  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseApiResponse<{ ok: true; token: string }>(response);
  setAdminToken(data.token);
  return data.token;
}

export async function fetchPublicProducts(): Promise<Product[]> {
  try {
    if (GOOGLE_SCRIPT_URL) {
      const data = await callGoogleAppsScript<ProductsResponse>({
        action: "listProducts",
      });
      return data.products;
    }

    const response = await fetch("/api/products");
    const data = await parseApiResponse<ProductsResponse>(response);
    return data.products;
  } catch {
    return defaultProducts;
  }
}

export async function fetchAdminProducts(): Promise<Product[]> {
  if (GOOGLE_SCRIPT_URL) {
    const data = await callGoogleAppsScript<ProductsResponse>({
      action: "listProducts",
      includeHidden: true,
      token: getAdminToken(),
    });
    return data.products;
  }

  const response = await fetch("/api/admin/products", {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  const data = await parseApiResponse<ProductsResponse>(response);
  return data.products;
}

export async function saveAdminProduct(product: Product) {
  if (GOOGLE_SCRIPT_URL) {
    return callGoogleAppsScript<ProductMutationResponse>({
      action: "upsertProduct",
      token: getAdminToken(),
      product,
    });
  }

  const response = await fetch("/api/admin/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product }),
  });
  return parseApiResponse<{ ok: true; product: Product; warning?: string }>(response);
}

export async function deleteAdminProduct(id: string) {
  if (GOOGLE_SCRIPT_URL) {
    return callGoogleAppsScript<ProductMutationResponse>({
      action: "deleteProduct",
      token: getAdminToken(),
      id,
    });
  }

  const response = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  return parseApiResponse<{ ok: true; warning?: string }>(response);
}

export type CloudinaryAsset = {
  imageUrl: string;
  publicId: string;
};

export async function uploadProductImage(file: File): Promise<CloudinaryAsset> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  if (!cloudName || !uploadPreset) {
    throw new Error("Falta configurar Cloudinary para subir imagenes.");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.secure_url || !result?.public_id) {
    throw new Error(result?.error?.message || "No se pudo subir la imagen.");
  }

  return { imageUrl: result.secure_url, publicId: result.public_id };
}
