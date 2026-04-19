#!/bin/bash

# Exit script if any command fails
set -e

echo "Starting Production Deployment..."

echo "==> Setting up Database & Backend..."
cd backend
npm ci
# Push DB schema if needed
npx prisma db push
npm run build
cd ..

echo "==> Setting up Frontend..."
cd frontend
npm ci
npm run build
cd ..

echo "==> Starting server with PM2..."
cd backend

# Start-or-restart: if the process exists, reload it (zero-downtime); otherwise start fresh
if npx pm2 describe job-tracker-backend > /dev/null 2>&1; then
  echo "Process exists, reloading..."
  NODE_ENV=production npx pm2 reload job-tracker-backend --update-env
else
  echo "Starting for the first time..."
  NODE_ENV=production npx pm2 start dist/server.js --name "job-tracker-backend"
fi

npx pm2 save

echo "Deployment complete!"
echo "View logs with: npx pm2 logs job-tracker-backend"
