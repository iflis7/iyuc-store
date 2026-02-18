# IYUC Store – Medusa on Docker

Everything runs in Docker: PostgreSQL, Redis, and the Medusa backend (API + Admin).

## One-time: run Docker without sudo

Docker was installed via **Snap** and doesn’t create a `docker` group by default. Do this once:

**1. Create the group and add your user**

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
```

**2. Let your user use the Docker socket (needed with Snap)**

Either **log out and back in** (so the new group is active), or apply this and use Docker in the same terminal without logging out:

```bash
sudo setfacl -m user:$USER:rw /var/run/docker.sock
```

Optional: if you didn’t log out, run `newgrp docker` in terminals where you want to use `docker` without sudo.

After this, `docker` and `docker compose` won’t ask for permissions.

## Layout

- **backend/** – Medusa (API + Admin). Started by this compose.
- **frontend/** – Storefront (to be added). Will use backend at `http://localhost:9000`.

## Start the stack

From this directory (`IYUC/Store`, parent of `backend/`):

```bash
docker compose up --build -d
```

To run from `backend/`: `docker compose -f ../docker-compose.yml up -d`

- **API:** http://localhost:9000  
- **Admin UI:** http://localhost:9000/app  

First startup runs DB migrations and optional seed. Check logs:

```bash
yarn docker:logs
# or
docker compose logs -f medusa
```

## Create an admin user

From `IYUC/Store` (override entrypoint so only the user command runs):

```bash
docker compose run --rm --entrypoint "" medusa yarn medusa user -e admin@example.com -p 'yourpassword'
```

Then open http://localhost:9000/app and sign in.

## Troubleshooting

**"An error occurred" / "An unexpected error occurred while rendering" on a page (e.g. Price Lists)**  
- **Container logs show no backend error** – requests to `/admin/price-lists` return 200/304. The failure is in the **browser**: the Admin React app throws when rendering that route.  
- To see the real cause: open the page → **F12** → **Console** tab → copy the red error (and stack trace).  
- You can use **Orders**, **Products**, **Customers**, **Draft Orders**, **Settings** etc. and avoid the Price Lists menu.  
- Fixing it usually requires the exact console error (e.g. missing field, null reference) or upgrading `@medusajs/medusa` and related packages.

## Stop

```bash
yarn docker:down
# or
docker compose down
```

Data is kept in the `iyuc_store_postgres_data` volume.
