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
# We set NODE_ENV to production so it triggers the static file serving logic
NODE_ENV=production npx pm2 start dist/server.js --name "job-tracker-backend" --update-env
npx pm2 save

echo "Deployment complete! Your app is now running in the background via pm2."
echo "You can view logs with: npx pm2 logs"
