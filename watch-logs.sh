#!/usr/bin/env bash
# Stream storefront + medusa logs while you use the UI. Ctrl+C to stop.
# Optional: ./watch-logs.sh 2>&1 | tee logs.txt   (saves copy to logs.txt)
cd "$(dirname "$0")"
echo "Watching storefront and medusa logs (Ctrl+C to stop)..."
exec docker compose logs -f storefront medusa
