# Adding products and showing them under New Latest Drops

## How products get on the storefront

- **All Products** (`/store`): lists all products from the Medusa Store API.
- **New Latest Drops** (`/collections/new`): lists products in the **New Arrivals** collection (handle `new`).
- Other collection pages use Medusa collections by handle (e.g. `/collections/ixulaf`).

The backend seed creates a **New Arrivals** collection (handle `new`) and links the first 6 seeded products to it. To show more or different products there, add products in the backend and put them in that collection.

---

## Option 1: Add a product via Medusa Admin (recommended)

1. Open Medusa Admin (e.g. `http://localhost:9000/app`).
2. Go to **Products** → **Products** → **Add Product**.
3. Fill in title, handle, description, images, variants, prices, and assign a sales channel.
4. Save the product.
5. To show it under **New Latest Drops**:
   - Go to **Products** → **Collections**.
   - Open the **New Arrivals** collection (handle `new`).
   - Use **Manage Products** (or equivalent) to add the new product to this collection.

After that, the product appears on the storefront and on `/collections/new` (New Latest Drops).

---

## Option 2: Add products via seed (backend)

Edit `store/backend/src/scripts/seed.ts`: add more entries to the `products` array in `createProductsWorkflow(container).run({ input: { products: [ ... ] } })`, following the same shape (title, handle, description, images, options, variants, sales_channels, etc.).

Then re-run the seed:

```bash
cd store/backend
docker compose run --rm medusa yarn seed
```

**Note:** The seed creates the **New Arrivals** collection once and links the first 6 products to it. New products you add in the seed are not automatically added to New Arrivals. To include them there, either:

- Add a step in the seed that links the new product IDs to the "New Arrivals" collection (e.g. with `batchLinkProductsToCollectionWorkflow`), or
- In Admin, open **New Arrivals** and add the new products manually.

---

## Option 3: Add products via API script (JSON)

1. Add a JSON file under `store/backend/scripts/api/data/` (e.g. `my-products.json`) with the same structure as `collection-01-products.example.json`.
2. Run:

   ```bash
   cd store
   docker compose run --rm medusa node scripts/api/push-products.js /server/scripts/api/data/my-products.json
   ```

3. In Medusa Admin, go to **Products** → **Collections** → **New Arrivals** and add the new products to the collection so they show under New Latest Drops.

---

## Summary

| Goal | Action |
|------|--------|
| Add a new product | Create it in Admin (or seed/script), with images, variants, and a sales channel. |
| Show it under **New Latest Drops** | In Admin: **Products** → **Collections** → **New Arrivals** → add the product to the collection. |
| Create the "New Arrivals" collection | Run the backend seed once; it creates the collection (handle `new`) and links the first 6 seeded products. |

The frontend page **New Latest Drops** (`/collections/new`) uses the Medusa collection with handle `new`; its ID is resolved from the Store API, so no frontend change is needed when you add products to that collection.
