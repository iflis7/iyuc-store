# IYUC Store – Scripts

## Reset DB (remigrate + seed)

From **store root**, to wipe the database and run migrations + seed from scratch (fixes Admin “Product Types” / seed issues):

```bash
./scripts/reset-db.sh
```

This runs `docker compose down -v` (removes Postgres volume), then `docker compose up -d`. Medusa’s `start.sh` runs `db:migrate` and `seed` on startup.

---

## API scripts (Docker only)

**Nothing is installed on the host.** All scripts run inside the Medusa container and call the Medusa backend at `http://medusa:9000`.

**Important:** Start the backend first. If you run a push script when Medusa isn’t running, you’ll get `getaddrinfo EAI_AGAIN medusa` or connection errors.

```bash
# 1. Start the stack (or at least Medusa)
docker compose up -d

# 2. Wait for Medusa to be ready (e.g. open http://localhost:9000/health), then run:
docker compose run --rm medusa yarn push:return-reasons
docker compose run --rm medusa yarn push:refund-reasons
docker compose run --rm medusa yarn push:products
```

Env: set `MEDUSA_ADMIN_API_KEY` in `backend/.env` (Secret API Key from Medusa Admin).  
Full details: **`backend/scripts/api/README.md`**.
