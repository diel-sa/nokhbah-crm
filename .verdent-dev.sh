#!/bin/bash
set -a
source /workspace/TryCRM/nokhbah-crm/.env
set +a
export PGBIN=/workspace/pgtools/node_modules/@embedded-postgres/linux-arm64/native/bin
$PGBIN/pg_ctl -D /workspace/pgdata -l /workspace/pgdata.log -o "-p 5432 -k /tmp" start 2>/dev/null || true
pkill -f "PORT=2000 eve" 2>/dev/null || true
pkill -f "PORT=3001 bun.*src/main.ts" 2>/dev/null || true
pkill -f "next dev -p 3100" 2>/dev/null || true
sleep 1
cd /workspace/TryCRM/nokhbah-crm/apps/agent && PORT=2000 AGENT_PORT=2000 nohup bun run dev:headless > /tmp/agent.log 2>&1 &
cd /workspace/TryCRM/nokhbah-crm/apps/api && PORT=3001 nohup bun run dev > /tmp/api.log 2>&1 &
cd /workspace/TryCRM/nokhbah-crm/apps/app && nohup bunx next dev -p 3100 -H 0.0.0.0 > /tmp/app.log 2>&1 &
sleep 10
echo "dev services launched"
