#!/bin/bash
# Run from IYUC/store: ./setup-frontend.sh
# Clones Medusa Next.js Starter (Next 15, React 19) into frontend/ and configures env.
set -e
cd "$(dirname "$0")"
if [ -d "frontend/.git" ] && [ -f "frontend/.yarnrc.yml" ]; then
  echo "Frontend already cloned (nextjs-starter-medusa). Pulling latest..."
  (cd frontend && git pull)
elif [ -d "frontend" ]; then
  echo "Replacing frontend with medusajs/nextjs-starter-medusa (missing .yarnrc.yml / wrong template)..."
  rm -rf frontend
  git clone https://github.com/medusajs/nextjs-starter-medusa.git frontend --depth 1
else
  echo "Cloning medusajs/nextjs-starter-medusa into frontend/..."
  git clone https://github.com/medusajs/nextjs-starter-medusa.git frontend --depth 1
fi
# Overlay IYUC Dockerfile and dockerignore (clone doesn't include these)
if [ -d frontend ] && [ -f docker/frontend.Dockerfile ]; then
  cp docker/frontend.Dockerfile frontend/Dockerfile
  cp docker/frontend.dockerignore frontend/.dockerignore
  echo "Applied frontend Dockerfile and .dockerignore"
fi
if [ ! -f frontend/.env.local ] && [ -f frontend/.env.template ]; then
  cp frontend/.env.template frontend/.env.local
  sed -i 's|MEDUSA_BACKEND_URL=.*|MEDUSA_BACKEND_URL=http://localhost:9000|' frontend/.env.local
  sed -i 's|NEXT_PUBLIC_BASE_URL=.*|NEXT_PUBLIC_BASE_URL=http://localhost:3000|' frontend/.env.local
  echo "Created frontend/.env.local (backend: http://localhost:9000, store: http://localhost:3000)"
fi
if command -v yarn >/dev/null 2>&1; then
  echo "Installing frontend dependencies (Yarn)..."
  (cd frontend && yarn install)
else
  echo "Yarn not found on host. Skipping install; deps will be installed when you run: docker compose build storefront"
fi
echo "Done. Run: docker compose up -d  (or cd frontend && yarn dev for local dev if Yarn is installed)"
