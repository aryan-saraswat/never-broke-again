#!/bin/bash

# Kill background processes on Ctrl+C
cleanup() {
  echo ""
  echo "Shutting down..."
  kill $BACKEND_PID 2>/dev/null
  wait $BACKEND_PID 2>/dev/null
  echo "Done."
  exit 0
}
trap cleanup SIGINT SIGTERM

echo "Starting Dev Environment..."

echo "==> Setting up Backend..."
cd backend
[ ! -d node_modules ] && npm install
npx prisma db push
npm run dev &
BACKEND_PID=$!
cd ..

echo "==> Setting up Frontend..."
cd frontend
[ ! -d node_modules ] && npm install
npm run dev
