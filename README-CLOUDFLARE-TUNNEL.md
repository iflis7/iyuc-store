# Accessing IYUC Store via Cloudflare Tunnel

If you use **Cloudflare Tunnel** (e.g. `cloudflared tunnel --url http://localhost:5173`) to expose the Medusa Admin, login will show **"Failed to fetch"** unless the **Medusa API (port 9000)** is also reachable by your browser.

**If DevTools shows the request going to `http://localhost:9000/auth/...`** – the Admin is still using the default backend URL. Expose the API via a second tunnel, set **`MEDUSA_BACKEND_URL`** (in `backend/.env`) to that tunnel URL, then restart the medusa container.

## Why it fails

- You open the Admin at `https://xxx.trycloudflare.com` (tunnel → port **5173**).
- The Admin runs in your **browser** and calls the Medusa API for auth (`/auth`, `emailpass`, etc.).
- Those requests must go to the **API** (port **9000**). If only 5173 is tunneled, the API is not reachable at that public URL, so every API call fails.

## Fix: expose the API as well

You need **two** public URLs:

1. **Admin** (5173) – already working, e.g. `https://speakers-watershed-deposit-algorithms.trycloudflare.com`
2. **API** (9000) – must be tunneled separately so the Admin can call it

### Step 1: Tunnel port 9000 (API)

In a **second** terminal (with the stack running):

```bash
cloudflared tunnel --url http://localhost:9000
```

Note the **API tunnel URL** (e.g. `https://some-other-name.trycloudflare.com`). Leave this running.

### Step 2: Tell the Admin to use the API tunnel URL

Set the Medusa backend URL so the Admin (in the browser) calls your **API tunnel URL**, not localhost. Medusa reads **`MEDUSA_BACKEND_URL`**.

**Option A – backend/.env (recommended)**

In `backend/.env`, add (replace with your API tunnel URL from Step 1, no trailing slash):

```bash
MEDUSA_BACKEND_URL=https://YOUR-API-TUNNEL-URL.trycloudflare.com
```

Then restart:

```bash
docker compose up -d medusa
```

**Option B – docker-compose**

In `docker-compose.yml`, under the `medusa` service `environment:` section, add:

```yaml
MEDUSA_BACKEND_URL: https://YOUR-API-TUNNEL-URL.trycloudflare.com
```

Restart: `docker compose up -d medusa`.

### Step 3: Allow the API tunnel origin in CORS

Add the **API** tunnel host to CORS (if different from the Admin tunnel). In `docker-compose.yml` for the `medusa` service, add your API tunnel URL to `ADMIN_CORS` and `AUTH_CORS`, e.g.:

```yaml
ADMIN_CORS: ...,https://speakers-watershed-deposit-algorithms.trycloudflare.com,https://YOUR-API-TUNNEL-URL.trycloudflare.com
AUTH_CORS: ...,https://speakers-watershed-deposit-algorithms.trycloudflare.com,https://YOUR-API-TUNNEL-URL.trycloudflare.com
```

Restart again: `docker compose up -d medusa`.

### Step 4: Use the Admin tunnel URL

Open the **Admin** in the browser at your **Admin** tunnel URL (e.g. `https://speakers-watershed-deposit-algorithms.trycloudflare.com/app`). Log in again; the Admin will now call the API tunnel URL and auth should succeed.

## Summary

| What        | Port | Tunnel command                          | Use for                    |
|------------|------|-----------------------------------------|----------------------------|
| Admin UI   | 5173 | `cloudflared tunnel --url http://localhost:5173` | Open in browser            |
| Medusa API | 9000 | `cloudflared tunnel --url http://localhost:9000` | Set as `MEDUSA_BACKEND_URL` |

Both tunnels must stay running while you use the Admin from the internet.
