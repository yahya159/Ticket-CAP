# CAP-SAP Performance Dashboard

Monolithic SAP CAP application with a React frontend used to manage projects, tickets, WRICEF objects, time tracking, evaluations, and related dashboard data.

## Structure

- `db/`: CAP domain model and CSV seed data.
- `srv/`: CAP OData v4 service definitions and handlers.
- `app/frontend/`: Vite + React + TypeScript UI source.
- `app/dist/`: production frontend build output served by CAP.
- `test/`: backend integration tests.

## Quick Start

Run commands from this directory:

```powershell
fnm exec --using=.node-version npm install
fnm exec --using=.node-version npm run watch
```

```powershell
cd app\frontend
npm install
npm run dev
```

For a one-command local run, use the backend helper script:

```powershell
npm run dev:all
```

For production-style serving, build the frontend into `app/dist` and then start CAP:

```powershell
npm run build
npm start
```

## Notes

- The backend is pinned to Node 20 in `.node-version`.
- OData services are exposed under `/odata/v4`.
- For production checks, run `npm run check` in `app/frontend/` and `npm test` here.
