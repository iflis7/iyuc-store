#!/usr/bin/env bash
# Quick check: does the storefront return HTTP 200?
# Next.js can take 60-90s to start; pass -w to wait that long before failing.
wait_sec=${1:-0}
if [ "$wait_sec" -gt 0 ]; then
  echo "Waiting ${wait_sec}s for Next.js to start..."
  sleep "$wait_sec"
fi
code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
echo "HTTP $code"
if [ "$code" = "200" ]; then
  echo "OK: storefront is up at http://localhost:3000"
  exit 0
else
  echo "Not 200. If you just started the container, try: $0 90"
  echo "Or run: docker compose logs storefront"
  exit 1
fi
