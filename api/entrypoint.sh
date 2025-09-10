#!/bin/sh
set -e

echo "Running prisma generate..."
npx prisma generate

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npm run seed

echo "Starting server..."
npm start
