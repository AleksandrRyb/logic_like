#!/usr/bin/env sh
set -e

if ! command -v nc >/dev/null 2>&1; then
	apk add --no-cache netcat-openbsd >/dev/null 2>&1 || true
fi

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
export DATABASE_URL=${DATABASE_URL:-postgres://postgres:postgres@${DB_HOST}:${DB_PORT}/logic_like}

echo "Waiting for database at ${DB_HOST}:${DB_PORT}..."
until nc -z ${DB_HOST} ${DB_PORT}; do
	echo "... still waiting"; sleep 1;
done

echo "Running migrations..."
npm run drizzle:migrate

echo "Running seed..."
npm run seed || true

echo "Starting dev server..."
exec npm run dev
