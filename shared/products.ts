export type ProductType = "main" | "extra" | "drink";

export type ProductOption = {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  imageUrl?: string;
  imagePublicId?: string;
  imageKey?: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  type: ProductType;
  title: string;
  subtitle?: string;
  description?: string;
  price: number;
  imageUrl?: string;
  imagePublicId?: string;
  imageKey?: string;
  hasOptions: boolean;
  optionsTitle?: string;
  options: ProductOption[];
  available: boolean;
  hidden: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductsResponse = {
  ok: true;
  products: Product[];
  source: "google-sheets" | "local" | "seed";
};

export type ProductMutationResponse = {
  ok: true;
  product?: Product;
  products?: Product[];
  warning?: string;
};

export type ApiErrorResponse = {
  ok: false;
  error: string;
};
