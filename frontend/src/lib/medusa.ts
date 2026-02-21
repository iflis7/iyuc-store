// Medusa API client for React SPA
// Uses fetch + react-query pattern instead of Next.js server actions

const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
const PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY ?? "pk_test";

// Only use mock when explicitly set (VITE_USE_MOCK=true). Otherwise all data comes from the backend; API errors propagate.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

import {
  mockListRegions,
  mockGetRegionByCountry,
  mockListCollections,
  mockGetCollectionByHandle,
  mockListProducts,
  mockGetProductByHandle,
  mockCreateCart,
  mockGetCart,
  mockAddToCart,
  mockUpdateCartItem,
  mockRemoveCartItem,
  MOCK_REGION,
} from "@/lib/mock-data";

type FetchOptions = {
  method?: string;
  body?: any;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
};

async function medusaFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, query, headers = {} } = options;

  let url = `${MEDUSA_BACKEND_URL}${path}`;

  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ---- Regions ----

export type Region = {
  id: string;
  name: string;
  currency_code: string;
  countries?: { iso_2: string; name: string }[];
};

export async function listRegions(): Promise<Region[]> {
  if (USE_MOCK) return mockListRegions();
  const data = await medusaFetch<{ regions: Region[] }>("/store/regions");
  return data.regions;
}

export async function getRegionByCountry(
  countryCode: string
): Promise<Region | null> {
  if (USE_MOCK) return mockGetRegionByCountry();
  const regions = await listRegions();
  for (const region of regions) {
    if (region.countries?.some((c) => c.iso_2 === countryCode)) {
      return region;
    }
  }
  return regions[0] || null;
}

// ---- Collections ----

export type Collection = {
  id: string;
  title: string;
  handle: string;
  products?: Product[];
};

export async function listCollections(): Promise<Collection[]> {
  if (USE_MOCK) return mockListCollections();
  const data = await medusaFetch<{ collections: Collection[] }>(
    "/store/collections",
    { query: { limit: "100", offset: "0" } }
  );
  return data.collections;
}

export async function getCollectionByHandle(
  handle: string
): Promise<Collection | null> {
  if (USE_MOCK) return mockGetCollectionByHandle(handle);
  const data = await medusaFetch<{ collections: Collection[] }>(
    "/store/collections",
    { query: { handle, fields: "*products" } }
  );
  return data.collections[0] || null;
}

// ---- Products ----

export type ProductImage = {
  id: string;
  url: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  sku?: string;
  calculated_price?: {
    calculated_amount: number;
    currency_code: string;
  };
  prices?: {
    amount: number;
    currency_code: string;
  }[];
  options?: {
    id: string;
    value: string;
    option_id: string;
  }[];
  inventory_quantity?: number;
};

export type ProductOption = {
  id: string;
  title: string;
  values: { id: string; value: string }[];
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  thumbnail?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  options?: ProductOption[];
  collection?: Collection;
  collection_id?: string;
};

export async function listProducts(params: {
  limit?: number;
  offset?: number;
  collection_id?: string;
  region_id?: string;
  currency_code?: string;
}): Promise<{ products: Product[]; count: number }> {
  if (USE_MOCK) return mockListProducts(params);
  const query: Record<string, string | number | boolean | undefined> = {
    limit: params.limit || 12,
    offset: params.offset || 0,
    fields: "*variants.calculated_price,+variants.inventory_quantity,+thumbnail,*images",
  };
  if (params.collection_id) query.collection_id = params.collection_id;
  if (params.region_id) query.region_id = params.region_id;
  if (params.currency_code) query.currency_code = params.currency_code;
  const data = await medusaFetch<{ products: Product[]; count: number }>("/store/products", { query });
  return data;
}

export async function getProductByHandle(
  handle: string,
  regionId?: string
): Promise<Product | null> {
  if (USE_MOCK) return mockGetProductByHandle(handle);
  const query: Record<string, string | number | boolean | undefined> = {
    handle,
    fields: "*variants.calculated_price,+variants.inventory_quantity,+thumbnail,*images",
  };
  if (regionId) query.region_id = regionId;
  const data = await medusaFetch<{ products: Product[] }>("/store/products", { query });
  return data.products[0] || null;
}

// ---- Cart ----

export type CartItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  thumbnail?: string;
  variant: ProductVariant;
  product: Product;
  total: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  region_id: string;
  currency_code: string;
};

export async function createCart(regionId: string): Promise<Cart> {
  if (USE_MOCK) return mockCreateCart();
  const data = await medusaFetch<{ cart: Cart }>("/store/carts", {
    method: "POST",
    body: { region_id: regionId },
  });
  return data.cart;
}

export async function getCart(cartId: string): Promise<Cart> {
  if (USE_MOCK) return mockGetCart();
  const data = await medusaFetch<{ cart: Cart }>(`/store/carts/${cartId}`);
  return data.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<Cart> {
  if (USE_MOCK) return mockAddToCart(variantId, quantity);
  const data = await medusaFetch<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items`,
    { method: "POST", body: { variant_id: variantId, quantity } }
  );
  return data.cart;
}

export async function updateCartItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<Cart> {
  if (USE_MOCK) return mockUpdateCartItem(lineItemId, quantity);
  const data = await medusaFetch<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    { method: "POST", body: { quantity } }
  );
  return data.cart;
}

export async function removeCartItem(
  cartId: string,
  lineItemId: string
): Promise<Cart> {
  if (USE_MOCK) return mockRemoveCartItem(lineItemId);
  const data = await medusaFetch<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    { method: "DELETE" }
  );
  return data.cart;
}

// ---- Shipping options ----

export type ShippingOption = {
  id: string;
  name: string;
  price_type: "flat" | "calculated";
  amount?: number;
  calculated_price?: { calculated_amount: number };
};

export async function listShippingOptions(cartId: string): Promise<ShippingOption[]> {
  if (USE_MOCK) return [];
  const data = await medusaFetch<{ shipping_options: ShippingOption[] }>(
    "/store/shipping-options",
    { query: { cart_id: cartId } }
  );
  return data.shipping_options ?? [];
}

export async function calculateShippingOption(
  optionId: string,
  cartId: string
): Promise<{ amount: number }> {
  const data = await medusaFetch<{ shipping_option: { amount: number } }>(
    `/store/shipping-options/${optionId}/calculate`,
    { method: "POST", body: { cart_id: cartId } }
  );
  return { amount: data.shipping_option?.amount ?? 0 };
}

export async function addShippingMethodToCart(
  cartId: string,
  optionId: string
): Promise<Cart> {
  const data = await medusaFetch<{ cart: Cart }>(
    `/store/carts/${cartId}/shipping-methods`,
    { method: "POST", body: { option_id: optionId } }
  );
  return data.cart;
}

// ---- Complete cart (place order) ----

export type Order = {
  id: string;
  display_id: number;
  total: number;
  currency_code: string;
};

export type CompleteCartResult =
  | { type: "order"; order: Order }
  | { type: "cart"; cart: Cart; error?: string };

export async function completeCart(cartId: string): Promise<CompleteCartResult> {
  const data = await medusaFetch<{ type: "order"; order: Order } | { type: "cart"; cart: Cart; error?: string }>(
    `/store/carts/${cartId}/complete`,
    { method: "POST" }
  );
  return data;
}

// ---- Price formatting ----

export function formatPrice(
  amount: number,
  currencyCode: string = "usd"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100);
}

export function getProductPrice(product: Product): string | null {
  const variant = product.variants?.[0];
  if (!variant) return null;

  if (variant.calculated_price) {
    return formatPrice(
      variant.calculated_price.calculated_amount,
      variant.calculated_price.currency_code
    );
  }

  const price = variant.prices?.[0];
  if (price) {
    return formatPrice(price.amount, price.currency_code);
  }

  return null;
}
