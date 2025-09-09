#!/bin/sh
set -e

echo "Running prisma generate..."
npx prisma generate

echo "Running migrations..."
npx prisma migrate deploy --skip-seed

echo "Seeding database..."
npm run seed

echo "Starting server..."
npm start
