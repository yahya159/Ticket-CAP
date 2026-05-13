# CAP-SAP Performance Dashboard

Monorepo for a SAP CAP backend and a React frontend used to manage projects, tickets, WRICEF objects, time tracking, evaluations, and related dashboard data.

## Structure

- `cap-backend/`: SAP CAP OData v4 backend with SQLite
- `cap-backend/app/frontend/`: Vite + React + TypeScript UI source
- `cap-backend/app/dist/`: production build output served by CAP

## Quick Start

Run each module from its own folder:

```powershell
cd cap-backend
fnm exec --using=.node-version npm install
fnm exec --using=.node-version npm run watch
```

```powershell
cd cap-backend\app\frontend
npm install
npm run dev
```

For a one-command local run, use the backend helper script:

```powershell
cd cap-backend
npm run dev:all
```

For production-style serving, build the frontend into `cap-backend/app/dist` and then start CAP:

```powershell
cd cap-backend
npm run build
npm start
```

## Notes

- The backend is pinned to Node 20 in `cap-backend/.node-version`.
- OData services are exposed under `/odata/v4`.
- For production checks, run `npm run check` in `cap-backend/app/frontend/` and `npm test` in `cap-backend/`.
