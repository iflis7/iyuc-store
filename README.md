# IYUC Store

Ecommerce for **IYUC** — Amazigh streetwear for the world. Backend (Medusa) + frontend (Next.js 15). Brand and marketing: [IYUC/Marketing](../Marketing/README.md).

## Layout

| Folder       | Purpose |
|-------------|---------|
| **backend/**  | Medusa API + Admin (Postgres, Redis, Node). Run via Docker. |
| **frontend/** | Next.js 15 storefront (official Medusa starter). Connects to backend at `http://medusa:9000` in Docker. |

## Quick start

**1. One-time frontend setup** (clones the Next.js 15 starter into `frontend/`):

```bash
cd /home/iflis/Lab/IYUC/store
./setup-frontend.sh
```

**2. Start everything in Docker:**

```bash
docker compose up -d
```

- **Storefront:** http://localhost:3000  
- **API:** http://localhost:9000  
- **Admin:** http://localhost:9000/app  

First start can take 1–2 minutes while Next.js compiles.

**Verify:** `./verify-storefront.sh` (waits for HTTP 200). If you get connection refused, run `docker compose logs storefront` and check for errors.

See [README-DOCKER.md](./README-DOCKER.md) for Docker permissions, admin user creation, and stop command. **Using Cloudflare Tunnel for Admin?** See [README-CLOUDFLARE-TUNNEL.md](./README-CLOUDFLARE-TUNNEL.md) so login works (expose API on 9000 and set `MEDUSA_ADMIN_BACKEND_URL`).

## Push to GitHub

1. **Install Git** (if needed): `sudo apt install git`
2. **Create a new repo** on GitHub (e.g. `iyuc-store`), **do not** add a README or .gitignore.
3. From this directory run:

```bash
cd /home/iflis/Lab/IYUC/store
git init
git add .
git commit -m "Initial commit: Medusa backend + Docker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/iyuc-store.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username (e.g. `iflis7`).
