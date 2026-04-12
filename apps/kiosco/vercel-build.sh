#!/bin/sh
set -e

cd ../../packages/database
npx prisma generate
npx prisma migrate deploy
npm run build

cd ../shared-kernel
npm run build

cd ../../apps/kiosco
npm run build
npx ts-node -r tsconfig-paths/register src/entrypoints/cli/seed-admin.ts
