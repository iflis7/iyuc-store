#!/usr/bin/env bash
# Reset DB: remove Postgres data volume, then start stack so Medusa runs migrations + seed.
# Run from store root: ./scripts/reset-db.sh

set -e
cd "$(dirname "$0")/.."

echo "Stopping containers and removing volumes (including Postgres data)..."
docker compose down -v

echo "Starting stack (fresh DB → migrate → seed)..."
docker compose up -d

echo "Waiting for Medusa to be ready (migrate + seed can take 1–2 min)..."
for i in {1..60}; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/health 2>/dev/null | grep -q 200; then
    echo "Medusa is up."
    break
  fi
  sleep 2
  [[ $i -eq 60 ]] && { echo "Timeout waiting for Medusa."; exit 1; }
done

echo "Done. Admin: http://localhost:9000/app"
