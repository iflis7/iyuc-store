# Plan 1: Reconnect Lovable Frontend to Medusa Backend

**Goal:** Replace mock fallbacks with real Medusa Store API so products, collections, cart, regions, and (where applicable) checkout flow use the backend.

**Reference:** Old frontend logic lives in `IYUC/frontend` (Next.js + Medusa JS SDK). New frontend: `IYUC/store/frontend` (React/Vite + `src/lib/medusa.ts`).

---

## What the new frontend already has (in `medusa.ts`)

| Area | Status | Notes |
|------|--------|--------|
| **Regions** | Implemented | `listRegions()`, `getRegionByCountry()`. Falls back to mock on error. |
| **Collections** | Implemented | `listCollections()`, `getCollectionByHandle()`. Uses `/store/collections`. |
| **Products** | Implemented | `listProducts()`, `getProductByHandle()` with `collection_id`, `region_id`, `currency_code`. Uses `/store/products`. |
| **Cart** | Implemented | `createCart()`, `getCart()`, `addToCart()`, `updateCartItem()`, `removeCartItem()`. Uses `/store/carts`. |
| **Price formatting** | Implemented | `formatPrice()`, `getProductPrice()`. Assumes amounts in cents. |

**Gaps:** Backend URL and publishable key are hardcoded; no env. When backend is down or CORS fails, frontend silently uses mock data.

---

## What Medusa backend supports (Store API)

Standard Medusa v2 Store API (no custom routes required for basics):

- `GET /store/regions` — list regions (with countries, currency, etc.)
- `GET /store/regions/:id` — single region
- `GET /store/collections` — list collections (query: handle, limit, offset, fields)
- `GET /store/collections/:id` — single collection
- `GET /store/products` — list products (query: collection_id, region_id, limit, offset, fields, currency_code, etc.)
- `GET /store/product-variants/:id` — variant detail (e.g. calculated price)
- `POST /store/carts` — create cart (body: region_id)
- `GET /store/carts/:id` — get cart (query: fields)
- `POST /store/carts/:id/line-items` — add line item (variant_id, quantity)
- `POST /store/carts/:id/line-items/:lineItemId` — update line item (quantity)
- `DELETE /store/carts/:id/line-items/:lineItemId` — remove line item
- `GET /store/shipping-options` — shipping options for cart/region
- `POST /store/shipping-options/:id/calculate` — calculate shipping cost
- `GET /store/payment-providers` — available payment methods
- Customer auth: `sdk.auth.login`, `sdk.auth.register`, `sdk.store.customer.*`
- Orders: create order from cart, then `GET /store/orders/:id`

**Backend config:** Ensure `medusa-config.ts` has correct `storeCors` (include frontend origin, e.g. `http://localhost:5173`). Publishable API key must be created in Admin and used by the frontend.

---

## Reconnection checklist (order of work)

### Phase A: Config and connectivity

1. **Environment variables (frontend)**
   - Add `VITE_MEDUSA_BACKEND_URL` (e.g. `http://localhost:9000`) and `VITE_MEDUSA_PUBLISHABLE_KEY` (e.g. `pk_test`).
   - In `medusa.ts`, replace hardcoded `MEDUSA_BACKEND_URL` and `PUBLISHABLE_KEY` with `import.meta.env.VITE_*`.
   - Ensure backend is reachable from the browser (CORS and network).

2. **Disable or gate mock fallback**
   - Option A: Remove automatic `enableMock()` on first API failure so errors are visible when backend is down.
   - Option B: Add a feature flag (e.g. `VITE_USE_MOCK=true`) to force mock; otherwise always call backend and show error state if it fails.

3. **Verify backend**
   - Seed at least one region (e.g. Canada, currency CAD), one collection (handle e.g. `ixulaf`), and a few products linked to that collection.
   - Create a publishable API key in Admin and attach it to the sales channel.
   - Test `GET /store/regions`, `GET /store/collections`, `GET /store/products?region_id=...` from the frontend (or curl) with header `x-publishable-api-key: pk_xxx`.

### Phase B: Data flow and fields

4. **Products**
   - Ensure `listProducts()` and `getProductByHandle()` pass `region_id` (from cart/context) so Medusa returns `calculated_price` in the correct currency.
   - Cart context already uses `getRegionByCountry("ca")`; pass `region?.id` into product queries where needed (ProductDetail already does this).
   - Confirm response shape: `products[].variants[].calculated_price.calculated_amount` (in cents) and `currency_code`. Adjust `formatPrice` if Medusa returns a different structure.

5. **Collections**
   - Backend must have collections with handles matching the frontend: `ixulaf`, `azekka`, `imnayen`, `tigejda`. Optionally `new` / `pre-order` can stay frontend-only filters (by product tags or metadata) or be real collections in Medusa.
   - If using virtual “New” / “Pre-order”: either create collections in Medusa or keep filtering in frontend by product metadata/tags and keep passing a synthetic `collection_id` only when using mock.

6. **Cart**
   - Cart creation already uses `region_id`. Persist cart ID in `localStorage` (already done). Ensure cookie/credentials: `credentials: "include"` if you add session later.
   - Cart response: ensure frontend reads `cart.items`, `cart.subtotal`, `cart.total`, `cart.region_id`, `cart.currency_code`. Map any differing field names from Medusa response.

7. **Regions and currency**
   - Frontend currently defaults to Canada (`DEFAULT_COUNTRY = "ca"`). Ensure at least one region with country `ca` exists in Medusa and that its currency (e.g. CAD) is used in product prices and cart.

### Phase C: Checkout (shipping, payment, order)

8. **Shipping options**
   - Old frontend: `lib/data/fulfillment.ts` — `getShippingOptions(cartId)`, `getShippingOptionPrice(optionId, cartId)`.
   - Add in new frontend: call `GET /store/shipping-options` (with cart id or region) and `POST /store/shipping-options/:id/calculate` to get costs. Use in Checkout page to show real shipping methods and prices.

9. **Payment and place order**
   - Old frontend: payment providers, then complete cart to order.
   - Add in new frontend: either use Medusa’s payment flow (redirect to payment provider or use a manual provider for testing). Complete cart → order via Medusa API so orders appear in Admin and n8n webhook fires.

10. **Customer (optional for first release)**
    - Old frontend: login, register, profile, addresses, order history.
    - Defer or add: customer auth and “Account” page using Medusa store customer endpoints so returning users can see orders and saved address.

---

## Suggested file changes (summary)

| File | Change |
|------|--------|
| `store/frontend/src/lib/medusa.ts` | Use env for `MEDUSA_BACKEND_URL` and `PUBLISHABLE_KEY`; optionally gate mock; ensure `region_id` is sent in product requests. |
| `store/frontend/.env.example` | Add `VITE_MEDUSA_BACKEND_URL`, `VITE_MEDUSA_PUBLISHABLE_KEY`, optional `VITE_USE_MOCK`. |
| `store/frontend/src/lib/cart-context.tsx` | Already uses region; ensure cart id is sent in cart API and that shipping step can read cart. |
| `store/frontend/src/pages/Checkout.tsx` | Replace hardcoded shipping and fake order# with: fetch shipping options from Medusa, select option, then complete cart to order (and show real order id). |
| Backend | Seed regions, collections (Ixulaf, Azekka, Imnayen, Tigejda), products; create publishable key; set `storeCors` for frontend origin. |

---

## Troubleshooting: frontend not using backend content

- **Using http://localhost:3000 (recommended):** Backend URL is `http://localhost:9000`. Ensure backend is running and `STORE_CORS` in `backend/.env` includes `http://localhost:3000` (it does). If the page still shows mock/empty data, check the browser console for CORS or network errors.
- **Using Cloudflare Tunnel:** The frontend is built with `VITE_MEDUSA_BACKEND_URL=http://localhost:9000`. From a browser opening the **tunnel** URL, `localhost` is the user’s machine, so Store API calls fail and the app falls back to mock. To use the backend via tunnel:
  1. Add the **frontend** tunnel URL (from `cloudflared-frontend` logs) to `STORE_CORS` in `backend/.env`.
  2. Set `VITE_MEDUSA_BACKEND_URL` to the **backend** tunnel URL (from `cloudflared-backend` logs) in `docker-compose.yml` (storefront `environment`) and in `frontend/.env`, then rebuild the storefront (`docker compose build storefront` and `docker compose up`).
- **CSS build error:** If you see `@import must precede all other statements`, the Google Fonts `@import` must be the first line in `frontend/src/index.css` (before any `@tailwind`). This is already fixed in the repo.
- **Add to cart returns 500 / "Cannot read properties of undefined (reading 'calculated_amount')":** The add-to-cart workflow in Medusa core expects each variant to have a calculated price for the cart’s region/currency. Ensure (1) the seed has run so products have variant prices for the region’s currency (e.g. CAD for Canada); (2) the cart is created with a region that has those prices (frontend uses `getRegionByCountry('ca')`). If the error persists, try re-running the backend seed (`medusa exec ./src/scripts/seed.ts`), confirm the publishable key’s sales channel includes the default region, and check for Medusa core-flows/pricing module updates.
- **Frontend still shows mock products (e.g. Ixulaf Classic Tee):** The storefront now uses **only backend data** by default Rebuild the storefront so the new code runs: `docker compose build storefront && docker compose up -d`. Hard-refresh the browser (Ctrl+Shift+R). Ensure `frontend/.env` does not set `VITE_USE_MOCK=true`. If the API fails you will see “Could not load collections” or “Could not load products”, the Store API is failing: ensure the backend is running, `STORE_CORS` includes your frontend origin (e.g. `http://localhost:3000`), and `VITE_MEDUSA_PUBLISHABLE_KEY` matches a valid publishable key in Admin. If the backend is unreachable, the home and store pages show an error message instead of mock data.
- **Medusa Admin: “An error occurred” on product/Price List/Promotion detail pages:** See [TROUBLESHOOTING-ADMIN.md](./TROUBLESHOOTING-ADMIN.md). Upgrade the backend Medusa packages to the latest 2.x (`yarn upgrade @medusajs/medusa@^2 @medusajs/framework@^2 @medusajs/admin-sdk@^2` in `backend/`) and rebuild/restart; check the browser console on the failing page for the exact error.

---

## Out of scope for this plan

- Product **categories** (old frontend had `/store/product-categories`): add later if you use categories in Medusa.
- **Tags** / product types: Medusa supports product metadata and tags; frontend can filter by them once backend exposes them in list response.
- **Locales**: Old frontend had locale and `x-medusa-locale`; add if you need multi-language in Medusa.
- **Country switcher**: Old frontend had `[countryCode]` in URL and region switch; new frontend uses fixed `ca`. Add country/region selector later if you need multiple regions in the UI.
