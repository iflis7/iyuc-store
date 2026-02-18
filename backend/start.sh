#!/bin/sh
set -e

echo "Running database migrations..."
yarn medusa db:migrate

echo "Seeding database..."
yarn seed || echo "Seeding failed, continuing..."

echo "Starting Medusa development server..."
yarn dev
