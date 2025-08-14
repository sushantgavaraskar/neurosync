Run Postgres + Redis (Docker):

docker run -d --name ns-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=neurosync -p 5432:5432 pgvector/pgvector:pg16
docker run -d --name ns-redis -p 6379:6379 redis:7-alpine

Setup DB and seed:

psql postgresql://postgres:postgres@localhost:5432/neurosync -f backend/scripts/db-setup.sql
node backend/scripts/seed-dev.js

Start API:

cd backend
npm install
npm run dev

Start embedding worker:

node backend/workers/embedding.worker.js


