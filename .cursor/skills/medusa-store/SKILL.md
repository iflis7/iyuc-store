---
name: medusa-store
description: Manages the IYUC Medusa store (products, return reasons, refund reasons, sales channel, shipping). Use when the user asks to change store data, push products, sync return/refund reasons, or interact with the Medusa backend for IYUC.
---

# Managing IYUC Medusa Store

**Everything runs in Docker. Do not install Node or run scripts on the host.**

## When to use this skill

- User asks to add/update **products**, **return reasons**, **refund reasons**, **sales channels**, or **shipping**.
- User wants to **push** or **sync** data to the store without running the full seed.
- User mentions **Medusa Admin API**, **IYUC store backend**, or **agent access** to the store.

## Store layout

- **Backend:** `store/backend/` (Medusa v2). Env: `store/backend/.env`.
- **API scripts:** `store/backend/scripts/api/` – run **only via Docker** (see below).
- **Seed:** `store/backend/src/scripts/seed.ts` – full seed. Run via Docker only.

## Run API scripts (Docker only)

From **store root** (`IYUC/store/`). Ensure backend is up: `docker compose up -d medusa`.

```bash
# Return reasons (wrong size, damaged, etc.)
docker compose run --rm medusa yarn push:return-reasons

# Refund reasons
docker compose run --rm medusa yarn push:refund-reasons

# Products from JSON (optional)
docker compose run --rm medusa yarn push:products
```

- Scripts read `backend/.env` for `MEDUSA_ADMIN_API_KEY`. Backend URL defaults to `http://medusa:9000` inside Docker.
- If 401: create a Secret API Key in Medusa Admin (Settings → Developer) and set `MEDUSA_ADMIN_API_KEY` in `backend/.env`.

## Full or first-time setup (Docker)

From store root:

```bash
docker compose run --rm medusa yarn seed
```

Creates regions, tax, fulfillment, locations, sales channel, return/refund reasons, product types, tags, and Collection 01 products.

## Quick reference

| Goal | Action (from store root) |
|------|--------------------------|
| Add/update return reasons | `docker compose run --rm medusa yarn push:return-reasons` |
| Add/update refund reasons | `docker compose run --rm medusa yarn push:refund-reasons` |
| Push products from JSON | `docker compose run --rm medusa yarn push:products` |
| Full DB setup | `docker compose run --rm medusa yarn seed` |
| Start backend | `docker compose up -d medusa` |

Product JSON: `backend/scripts/api/data/collection-01-products.json` (see `data/collection-01-products.example.json`). See `backend/scripts/api/README.md` for details.
