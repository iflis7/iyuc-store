// Mock data for IYUC Store — Amazigh streetwear brand
import type { Product, Collection, Region, Cart, CartItem, ProductVariant, ProductOption } from "@/lib/medusa";

export const MOCK_REGION: Region = {
  id: "reg_mock_ca",
  name: "Canada",
  currency_code: "cad",
  countries: [{ iso_2: "ca", name: "Canada" }],
};

const img = (name: string) => `https://images.unsplash.com/photo-${name}?w=800&h=800&fit=crop&q=80`;

const IMAGES = {
  // Boys / Ixulaf
  boysTee: img("1503944583220-79d8926ad5e2"),
  boysHoodie: img("1556821840-3a63f95609a7"),
  boysShorts: img("1591195853828-11db59a44f6b"),
  // Girls / Azekka
  girlsTee: img("1583743814966-8936f5b7be1a"),
  girlsDress: img("1595777457583-95e059d581b8"),
  girlsJacket: img("1591047139829-d91aecb6caea"),
  // Men / Imnayen
  menTee: img("1521572163474-6864f9cf17ab"),
  menHoodie: img("1578768079052-aa76e52ff62e"),
  menPants: img("1542272604-787c3835535d"),
  menJacket: img("1551028719-00167b16eac5"),
  menSweat: img("1578587018452-892bacefd3f2"),
  // Women / Tigejda
  womenTee: img("1625910513413-5cc2d32e3de5"),
  womenDress: img("1601924921557-45e93e96e52e"),
  womenBag: img("1548036328-c11e0931fe7e"),
  // Accessories
  hat: img("1588850561407-ed78c334e67a"),
  watch: img("1524592094714-0f0654e20314"),
  sunglasses: img("1511499767150-a48a237f0083"),
};

function makeVariant(id: string, title: string, priceAmount: number, optionValues?: { option_id: string; value: string }[]): ProductVariant {
  return {
    id,
    title,
    calculated_price: { calculated_amount: priceAmount, currency_code: "cad" },
    options: optionValues?.map((ov, i) => ({ id: `optval_${id}_${i}`, ...ov })),
    inventory_quantity: 25,
  };
}

function makeSizeOption(productId: string, sizes = ["S", "M", "L", "XL"]): ProductOption {
  return {
    id: `opt_size_${productId}`,
    title: "Size",
    values: sizes.map((s) => ({ id: `sv_${s}_${productId}`, value: s })),
  };
}

function makeColorOption(productId: string, colors: string[]): ProductOption {
  return {
    id: `opt_color_${productId}`,
    title: "Color",
    values: colors.map((c) => ({ id: `cv_${c}_${productId}`, value: c })),
  };
}

function sizeColorVariants(productId: string, basePrice: number, colors: string[], sizes = ["S", "M", "L", "XL"]): ProductVariant[] {
  const variants: ProductVariant[] = [];
  for (const color of colors) {
    for (const size of sizes) {
      variants.push(
        makeVariant(
          `var_${productId}_${color}_${size}`.toLowerCase().replace(/\s/g, "_"),
          `${size} / ${color}`,
          basePrice,
          [
            { option_id: `opt_size_${productId}`, value: size },
            { option_id: `opt_color_${productId}`, value: color },
          ]
        )
      );
    }
  }
  return variants;
}

// Extended Product type with badge info
export type ProductWithBadge = Product & {
  badge?: "new" | "pre-order" | "yennayer";
  preorderDate?: string;
};

export const MOCK_PRODUCTS: ProductWithBadge[] = [
  // --- Ixulaf (Boys) ---
  {
    id: "prod_ix_tee",
    title: "Ixulaf Classic Tee",
    handle: "ixulaf-classic-tee",
    description: "A soft organic cotton tee for young explorers. Subtle Amazigh-inspired graphic on the chest. Relaxed fit, pre-shrunk for a lasting shape.",
    thumbnail: IMAGES.boysTee,
    images: [{ id: "img1", url: IMAGES.boysTee }],
    collection_id: "col_ixulaf",
    options: [makeSizeOption("prod_ix_tee", ["4Y", "6Y", "8Y", "10Y", "12Y"]), makeColorOption("prod_ix_tee", ["Sand", "Charcoal"])],
    variants: sizeColorVariants("prod_ix_tee", 2900, ["Sand", "Charcoal"], ["4Y", "6Y", "8Y", "10Y", "12Y"]),
    badge: "new",
  },
  {
    id: "prod_ix_hoodie",
    title: "Ixulaf Hoodie",
    handle: "ixulaf-hoodie",
    description: "Cozy heavyweight hoodie with kangaroo pocket. Tonal embroidered ⵣ on the sleeve. Built to last through every adventure.",
    thumbnail: IMAGES.boysHoodie,
    images: [{ id: "img2", url: IMAGES.boysHoodie }],
    collection_id: "col_ixulaf",
    options: [makeSizeOption("prod_ix_hoodie", ["4Y", "6Y", "8Y", "10Y", "12Y"]), makeColorOption("prod_ix_hoodie", ["Indigo", "Cream"])],
    variants: sizeColorVariants("prod_ix_hoodie", 5500, ["Indigo", "Cream"], ["4Y", "6Y", "8Y", "10Y", "12Y"]),
  },
  {
    id: "prod_ix_shorts",
    title: "Ixulaf Active Shorts",
    handle: "ixulaf-active-shorts",
    description: "Lightweight stretch shorts for active days. Quick-dry fabric with a hidden zip pocket.",
    thumbnail: IMAGES.boysShorts,
    images: [{ id: "img3", url: IMAGES.boysShorts }],
    collection_id: "col_ixulaf",
    options: [makeSizeOption("prod_ix_shorts", ["4Y", "6Y", "8Y", "10Y", "12Y"]), makeColorOption("prod_ix_shorts", ["Black", "Olive"])],
    variants: sizeColorVariants("prod_ix_shorts", 3500, ["Black", "Olive"], ["4Y", "6Y", "8Y", "10Y", "12Y"]),
  },

  // --- Azekka (Girls) ---
  {
    id: "prod_az_tee",
    title: "Azekka Graphic Tee",
    handle: "azekka-graphic-tee",
    description: "Oversized graphic tee featuring geometric Amazigh patterns. 100% organic cotton, relaxed drop-shoulder fit.",
    thumbnail: IMAGES.girlsTee,
    images: [{ id: "img4", url: IMAGES.girlsTee }],
    collection_id: "col_azekka",
    options: [makeSizeOption("prod_az_tee", ["4Y", "6Y", "8Y", "10Y", "12Y"]), makeColorOption("prod_az_tee", ["White", "Terracotta"])],
    variants: sizeColorVariants("prod_az_tee", 2900, ["White", "Terracotta"], ["4Y", "6Y", "8Y", "10Y", "12Y"]),
    badge: "new",
  },
  {
    id: "prod_az_dress",
    title: "Azekka Tunic Dress",
    handle: "azekka-tunic-dress",
    description: "A breezy tunic dress with Amazigh-inspired embroidery at the hem. Perfect for warm days or layered over leggings.",
    thumbnail: IMAGES.girlsDress,
    images: [{ id: "img5", url: IMAGES.girlsDress }],
    collection_id: "col_azekka",
    options: [makeSizeOption("prod_az_dress", ["4Y", "6Y", "8Y", "10Y", "12Y"]), makeColorOption("prod_az_dress", ["Sand", "Dusty Rose"])],
    variants: sizeColorVariants("prod_az_dress", 4500, ["Sand", "Dusty Rose"], ["4Y", "6Y", "8Y", "10Y", "12Y"]),
    badge: "pre-order",
    preorderDate: "April 2026",
  },
  {
    id: "prod_az_jacket",
    title: "Azekka Light Jacket",
    handle: "azekka-light-jacket",
    description: "Water-resistant shell jacket with a concealed hood. Clean lines, reflective details for visibility.",
    thumbnail: IMAGES.girlsJacket,
    images: [{ id: "img6", url: IMAGES.girlsJacket }],
    collection_id: "col_azekka",
    options: [makeSizeOption("prod_az_jacket", ["4Y", "6Y", "8Y", "10Y", "12Y"]), makeColorOption("prod_az_jacket", ["Navy", "Sage"])],
    variants: sizeColorVariants("prod_az_jacket", 6900, ["Navy", "Sage"], ["4Y", "6Y", "8Y", "10Y", "12Y"]),
  },

  // --- Imnayen (Men) ---
  {
    id: "prod_im_tee",
    title: "Imnayen Essential Tee",
    handle: "imnayen-essential-tee",
    description: "The everyday essential. Heavyweight 220gsm cotton, relaxed fit, tonal ⵣ embroidery at the chest. Garment-dyed for a lived-in feel.",
    thumbnail: IMAGES.menTee,
    images: [{ id: "img7", url: IMAGES.menTee }],
    collection_id: "col_imnayen",
    options: [makeSizeOption("prod_im_tee"), makeColorOption("prod_im_tee", ["Black", "Sand", "Indigo"])],
    variants: sizeColorVariants("prod_im_tee", 4500, ["Black", "Sand", "Indigo"]),
    badge: "new",
  },
  {
    id: "prod_im_hoodie",
    title: "Imnayen Heritage Hoodie",
    handle: "imnayen-heritage-hoodie",
    description: "Our signature piece. 400gsm French terry, brushed interior, dropped shoulders. Embroidered Amazigh motif on the back panel.",
    thumbnail: IMAGES.menHoodie,
    images: [{ id: "img8", url: IMAGES.menHoodie }],
    collection_id: "col_imnayen",
    options: [makeSizeOption("prod_im_hoodie"), makeColorOption("prod_im_hoodie", ["Charcoal", "Cream", "Olive"])],
    variants: sizeColorVariants("prod_im_hoodie", 9900, ["Charcoal", "Cream", "Olive"]),
  },
  {
    id: "prod_im_pants",
    title: "Imnayen Cargo Pants",
    handle: "imnayen-cargo-pants",
    description: "Relaxed-fit cargo pants in stretch cotton twill. Six-pocket design with woven strap details inspired by Amazigh textile traditions.",
    thumbnail: IMAGES.menPants,
    images: [{ id: "img9", url: IMAGES.menPants }],
    collection_id: "col_imnayen",
    options: [makeSizeOption("prod_im_pants"), makeColorOption("prod_im_pants", ["Khaki", "Black"])],
    variants: sizeColorVariants("prod_im_pants", 8500, ["Khaki", "Black"]),
  },
  {
    id: "prod_im_jacket",
    title: "Imnayen Bomber",
    handle: "imnayen-bomber",
    description: "Modern bomber with a water-resistant shell and satin lining. Ribbed cuffs, embossed ⵣ zipper pull. A statement piece for any season.",
    thumbnail: IMAGES.menJacket,
    images: [{ id: "img10", url: IMAGES.menJacket }],
    collection_id: "col_imnayen",
    options: [makeSizeOption("prod_im_jacket"), makeColorOption("prod_im_jacket", ["Black", "Olive"])],
    variants: sizeColorVariants("prod_im_jacket", 15900, ["Black", "Olive"]),
    badge: "pre-order",
    preorderDate: "March 2026",
  },

  // --- Tigejda (Women) ---
  {
    id: "prod_ti_tee",
    title: "Tigejda Relaxed Tee",
    handle: "tigejda-relaxed-tee",
    description: "Boxy-fit tee in ultra-soft pima cotton. Minimal Amazigh symbol print at the back neckline. Effortlessly elegant.",
    thumbnail: IMAGES.womenTee,
    images: [{ id: "img11", url: IMAGES.womenTee }],
    collection_id: "col_tigejda",
    options: [makeSizeOption("prod_ti_tee"), makeColorOption("prod_ti_tee", ["White", "Sand", "Black"])],
    variants: sizeColorVariants("prod_ti_tee", 4500, ["White", "Sand", "Black"]),
    badge: "new",
  },
  {
    id: "prod_ti_dress",
    title: "Tigejda Wrap Dress",
    handle: "tigejda-wrap-dress",
    description: "A fluid wrap dress in linen-blend fabric. Amazigh-inspired woven belt. Transitions seamlessly from day to evening.",
    thumbnail: IMAGES.womenDress,
    images: [{ id: "img12", url: IMAGES.womenDress }],
    collection_id: "col_tigejda",
    options: [makeSizeOption("prod_ti_dress"), makeColorOption("prod_ti_dress", ["Terracotta", "Cream"])],
    variants: sizeColorVariants("prod_ti_dress", 8900, ["Terracotta", "Cream"]),
  },
  {
    id: "prod_ti_bag",
    title: "Tigejda Canvas Tote",
    handle: "tigejda-canvas-tote",
    description: "Heavy-duty canvas tote with woven Amazigh strap detail. Interior zip pocket, padded base. Carry your world in style.",
    thumbnail: IMAGES.womenBag,
    images: [{ id: "img13", url: IMAGES.womenBag }],
    collection_id: "col_tigejda",
    options: [makeColorOption("prod_ti_bag", ["Natural", "Black"])],
    variants: ["Natural", "Black"].map((c) =>
      makeVariant(`var_tote_${c}`.toLowerCase(), c, 5900, [{ option_id: "opt_color_prod_ti_bag", value: c }])
    ),
  },

  // --- Accessories ---
  {
    id: "prod_acc_hat",
    title: "IYUC Dad Cap",
    handle: "iyuc-dad-cap",
    description: "Relaxed washed-cotton cap with embroidered ⵣ. Adjustable strap, pre-curved brim.",
    thumbnail: IMAGES.hat,
    images: [{ id: "img14", url: IMAGES.hat }],
    collection_id: "col_imnayen",
    options: [makeColorOption("prod_acc_hat", ["Black", "Sand", "Indigo"])],
    variants: ["Black", "Sand", "Indigo"].map((c) =>
      makeVariant(`var_cap_${c}`.toLowerCase(), c, 3500, [{ option_id: "opt_color_prod_acc_hat", value: c }])
    ),
  },
  {
    id: "prod_acc_watch",
    title: "IYUC Minimal Watch",
    handle: "iyuc-minimal-watch",
    description: "Japanese quartz, sapphire crystal, 40mm case. Genuine leather strap with debossed Amazigh pattern. Water resistant to 50m.",
    thumbnail: IMAGES.watch,
    images: [{ id: "img15", url: IMAGES.watch }],
    collection_id: "col_imnayen",
    options: [makeColorOption("prod_acc_watch", ["Silver/Black", "Gold/Sand"])],
    variants: ["Silver/Black", "Gold/Sand"].map((c) =>
      makeVariant(`var_watch_${c}`.toLowerCase().replace("/", "_"), c, 19900, [{ option_id: "opt_color_prod_acc_watch", value: c }])
    ),
    badge: "pre-order",
    preorderDate: "May 2026",
  },
  {
    id: "prod_acc_sunglasses",
    title: "IYUC Retro Sunglasses",
    handle: "iyuc-retro-sunglasses",
    description: "Acetate frame with UV400 polarized lenses. Vintage silhouette, modern proportions. Comes in a handmade felt case.",
    thumbnail: IMAGES.sunglasses,
    images: [{ id: "img16", url: IMAGES.sunglasses }],
    collection_id: "col_tigejda",
    options: [makeColorOption("prod_acc_sunglasses", ["Tortoise", "Black"])],
    variants: ["Tortoise", "Black"].map((c) =>
      makeVariant(`var_sunglasses_${c}`.toLowerCase(), c, 8500, [{ option_id: "opt_color_prod_acc_sunglasses", value: c }])
    ),
  },
];

export const MOCK_COLLECTIONS: Collection[] = [
  { id: "col_ixulaf", title: "Ixulaf", handle: "ixulaf" },
  { id: "col_azekka", title: "Azekka", handle: "azekka" },
  { id: "col_imnayen", title: "Imnayen", handle: "imnayen" },
  { id: "col_tigejda", title: "Tigejda", handle: "tigejda" },
];

// Virtual collections for "New" and "Pre-order"
export function getMockNewProducts(): ProductWithBadge[] {
  return MOCK_PRODUCTS.filter((p) => p.badge === "new");
}

export function getMockPreorderProducts(): ProductWithBadge[] {
  return MOCK_PRODUCTS.filter((p) => p.badge === "pre-order");
}

// --- Mock cart state ---
let mockCartItems: CartItem[] = [];
let mockCartIdCounter = 0;

function calcCart(items: CartItem[]): Cart {
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  return {
    id: "cart_mock",
    items,
    subtotal,
    total: subtotal,
    tax_total: 0,
    shipping_total: 0,
    region_id: MOCK_REGION.id,
    currency_code: "cad",
  };
}

export function mockCreateCart(): Cart {
  mockCartItems = [];
  return calcCart(mockCartItems);
}

export function mockGetCart(): Cart {
  return calcCart(mockCartItems);
}

export function mockAddToCart(variantId: string, quantity: number): Cart {
  const existing = mockCartItems.find((i) => i.variant.id === variantId);
  if (existing) {
    existing.quantity += quantity;
    existing.total = existing.unit_price * existing.quantity;
  } else {
    let foundProduct: ProductWithBadge | undefined;
    let foundVariant: ProductVariant | undefined;
    for (const p of MOCK_PRODUCTS) {
      const v = p.variants?.find((vr) => vr.id === variantId);
      if (v) { foundProduct = p; foundVariant = v; break; }
    }
    if (foundProduct && foundVariant) {
      const unitPrice = foundVariant.calculated_price?.calculated_amount || 0;
      mockCartItems.push({
        id: `li_${++mockCartIdCounter}`,
        title: foundProduct.title,
        quantity,
        unit_price: unitPrice,
        thumbnail: foundProduct.thumbnail,
        variant: foundVariant,
        product: foundProduct,
        total: unitPrice * quantity,
      });
    }
  }
  return calcCart(mockCartItems);
}

export function mockUpdateCartItem(lineItemId: string, quantity: number): Cart {
  const item = mockCartItems.find((i) => i.id === lineItemId);
  if (item) {
    item.quantity = quantity;
    item.total = item.unit_price * quantity;
  }
  return calcCart(mockCartItems);
}

export function mockRemoveCartItem(lineItemId: string): Cart {
  mockCartItems = mockCartItems.filter((i) => i.id !== lineItemId);
  return calcCart(mockCartItems);
}

// --- Mock API functions ---
export async function mockListRegions(): Promise<Region[]> {
  return [MOCK_REGION];
}

export async function mockGetRegionByCountry(): Promise<Region | null> {
  return MOCK_REGION;
}

export async function mockListCollections(): Promise<Collection[]> {
  return MOCK_COLLECTIONS;
}

export async function mockGetCollectionByHandle(handle: string): Promise<Collection | null> {
  // Virtual collections
  if (handle === "new") return { id: "col_new", title: "New Arrivals", handle: "new" };
  if (handle === "pre-order") return { id: "col_preorder", title: "Pre-order", handle: "pre-order" };
  return MOCK_COLLECTIONS.find((c) => c.handle === handle) || null;
}

export async function mockListProducts(params: {
  limit?: number;
  offset?: number;
  collection_id?: string;
}): Promise<{ products: ProductWithBadge[]; count: number }> {
  let products = [...MOCK_PRODUCTS];
  if (params.collection_id) {
    if (params.collection_id === "col_new") {
      products = getMockNewProducts();
    } else if (params.collection_id === "col_preorder") {
      products = getMockPreorderProducts();
    } else {
      products = products.filter((p) => p.collection_id === params.collection_id);
    }
  }
  const offset = params.offset || 0;
  const limit = params.limit || 12;
  const sliced = products.slice(offset, offset + limit);
  return { products: sliced, count: products.length };
}

export async function mockGetProductByHandle(handle: string): Promise<ProductWithBadge | null> {
  return MOCK_PRODUCTS.find((p) => p.handle === handle) || null;
}
