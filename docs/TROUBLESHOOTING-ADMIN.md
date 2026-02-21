# Medusa Admin: "An error occurred" on detail pages

When opening a **single** product, Price List, Promotion, or other detail page in Medusa Admin (`http://localhost:9000/app/...`), you see:

- **"An error occurred"**
- **"An unexpected error occurred while rendering this page."**

List views (e.g. Products list) work; only the **detail/edit** view for that entity fails. The **storefront is unaffected** and can still list products and show product detail pages.

---

## Try this first

1. **Open DevTools (F12) → Console** while on the broken Admin page. Note the **exact red error** (e.g. `Cannot read properties of undefined (reading 'id')`). That points to the fix.
2. **Upgrade Medusa** to the latest 2.x — product detail bugs (e.g. [GH #14630](https://github.com/medusajs/medusa/issues/14630)) were fixed in newer releases:
   ```bash
   cd store/backend
   yarn upgrade @medusajs/medusa@^2 @medusajs/framework@^2 @medusajs/admin-sdk@^2 @medusajs/cli@^2
   ```
   Then rebuild/restart (e.g. `docker compose up --build -d`).
3. If the console blames **title/description** or rendering: the seed uses the **ⵣ** (Tifinagh) character in product titles. Some Admin builds choke on that. To confirm, edit one product (from the list) and change its title to plain ASCII (e.g. "IYUC Essential Tee") and open its detail again.

---

## What’s going on

The Admin UI is a React app. That message is from its error boundary: a component threw while rendering the detail page (e.g. reading a property from `undefined` or an unexpected API shape).

---

## What to do

### 1. Get the real error (browser console)

1. Open Medusa Admin and go to the page that breaks (e.g. open a product).
2. Open **Developer Tools** (F12 or right‑click → Inspect).
3. Open the **Console** tab.
4. Reproduce the error and note the **red error message** and stack trace (e.g. `TypeError: Cannot read properties of undefined (reading 'id')`).

That text is what you need to fix or search for (e.g. on Medusa GitHub/Discord).

### 2. Check the API (Network tab)

1. In DevTools, open the **Network** tab.
2. Reload or open the failing detail page again.
3. Find the request that loads that entity (e.g. `GET .../admin/products/prod_xxx` or price lists / promotions).
4. Check:
   - **Status**: 200 vs 4xx/5xx.
   - **Response**: JSON shape; any `null` or missing fields the UI might assume exist (e.g. `product.options`, `collection`, `thumbnail`).

If the API returns 500 or a different shape than the admin expects, fix the backend or data first.

### 3. Upgrade Medusa

Detail-page bugs in the admin have been fixed in newer 2.x releases. Upgrade to the latest 2.x patch and try again:

```bash
cd backend
yarn upgrade @medusajs/medusa@^2 @medusajs/framework@^2 @medusajs/admin-sdk@^2 @medusajs/cli@^2
# or npm
npm update @medusajs/medusa @medusajs/framework @medusajs/admin-sdk @medusajs/cli
```

Then restart the backend (and rebuild if you use Docker).

### 4. Data / special characters

- If the console points to **product title or description**: some admin code may not handle special characters (e.g. **ⵣ**). Try editing the product in the database or via API to use a plain ASCII title and see if the detail page loads.
- If the error mentions **options**, **variants**, or **collection**: ensure the product has the expected relations and required fields (e.g. at least one variant, valid `type_id`, linked to a sales channel if required).

### 5. Docker: 404 on Admin chunks (`product-detail-....js`)

If the console shows **404** for a request like `/app/@fs/server/node_modules/.vite/deps/product-detail-....js` and **"error loading dynamically imported module"**, the Admin is running in **Vite dev mode** inside the container and that chunk isn’t being served correctly. **Fix:** build the Admin in the image and run in production mode so the app is served as static assets:

- **Dockerfile:** after `COPY . .`, add `RUN yarn build`.
- **start.sh:** use `yarn start` instead of `yarn dev`.

Then rebuild: `docker compose up --build -d`. After that, product (and other) detail pages should load without the chunk 404.

### 6. Run backend locally (without Docker)

To rule out Docker or build issues:

```bash
cd backend
yarn install
yarn dev
```

Open `http://localhost:9000/app` and try the same product/price list/promotion. If it still fails, use the console error from step 1 to search [Medusa GitHub issues](https://github.com/medusajs/medusa/issues) or ask in their Discord.

---

## Quick reference

| Symptom | Likely cause | Action |
|--------|----------------|--------|
| List works, detail shows "An error occurred" | UI throws on load (missing/undefined field or wrong shape) | Check browser console + API response (steps 1–2) |
| API returns 500 for `GET /admin/products/:id` | Backend or DB issue | Check backend logs and DB/seed for that product |
| Error mentions `product.id` or `undefined` option | Known admin bug (e.g. product options) | Upgrade Medusa (step 3), search GitHub for the exact message |
| Only happens for one product | Bad or special data for that entity | Try ASCII title / fix relations (step 4) |
