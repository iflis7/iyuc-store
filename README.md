# IYUC Store

Ecommerce stack: **backend** (Medusa) first, **frontend** (storefront) later.

## Layout

| Folder      | Purpose |
|------------|---------|
| **backend/**  | Medusa API + Admin (Postgres, Redis, Node). Run via Docker from here. |
| **frontend/** | Storefront (e.g. Next.js). Placeholder for now. |

## Quick start (backend)

From this directory (`IYUC/Store`):

```bash
docker compose up -d
```

- **API:** http://localhost:9000  
- **Admin:** http://localhost:9000/app  

See [README-DOCKER.md](./README-DOCKER.md) for Docker permissions, admin user creation, and stop command.

## Push to GitHub

1. **Install Git** (if needed): `sudo apt install git`
2. **Create a new repo** on GitHub (e.g. `iyuc-store`), **do not** add a README or .gitignore.
3. From this directory run:

```bash
cd /home/iflis/Lab/IYUC/Store
git init
git add .
git commit -m "Initial commit: Medusa backend + Docker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/iyuc-store.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username (e.g. `iflis7`).
