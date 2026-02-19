#!/usr/bin/env bash
# Rebuild and start storefront, wait for HTTP 200, then report.
# Requires frontend/ to be set up first: ./setup-frontend.sh
set -e
cd "$(dirname "$0")"
echo "Building and starting storefront (Next.js 15 starter)..."
docker compose build storefront --no-cache 2>&1
docker compose up -d storefront 2>&1
echo "Waiting for http://localhost:3000 (up to 150s)..."
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || true)
  if [ "$code" = "200" ]; then
    echo "OK: got HTTP 200"
    exit 0
  fi
  [ "$((i % 6))" -eq 0 ] && echo "  still waiting... (${i}5s)"
  sleep 5
done
echo "FAIL: no 200 after 150s. Run: docker compose logs storefront"
exit 1
