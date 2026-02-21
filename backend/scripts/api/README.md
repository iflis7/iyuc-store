# Admin API scripts (Docker only)

These scripts call the Medusa Admin API. **Run them inside Docker** so nothing is installed on the host.

From **store root** (`IYUC/store/`):

```bash
# Return reasons
docker compose run --rm medusa yarn push:return-reasons

# Refund reasons
docker compose run --rm medusa yarn push:refund-reasons

# Products (optional; needs scripts/api/data/collection-01-products.json)
docker compose run --rm medusa yarn push:products
# Or with a custom JSON path (path inside container):
docker compose run --rm medusa node scripts/api/push-products.js /server/scripts/api/data/collection-01-products.json
```

**Requirements**

- Backend stack running so the API is up: `docker compose up -d medusa` (or at least postgres + redis + medusa).
- In `backend/.env`: `MEDUSA_ADMIN_API_KEY` (Secret API Key from Admin, or a JWT from login).

**If you get 401 Unauthorized**

- Scripts use **Bearer** for keys that start with `sk_`; otherwise **Basic**.
- Force one in `.env`: `MEDUSA_USE_BEARER=true` or `MEDUSA_USE_BASIC=true`.
- Ensure the key is a valid **Secret API Key** from Medusa Admin (Settings → Developer → Secret API Keys). If your backend only accepts JWT, log in via Admin and use the token (or create a secret key in Admin).
- When running in Docker, the script uses `MEDUSA_BACKEND_URL` from `.env` if set; otherwise `http://medusa:9000`.

Product JSON format: see `data/collection-01-products.example.json`.
