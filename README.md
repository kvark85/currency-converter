# Currency Converter

A lightweight, offline-first PWA for converting currencies. Installable as
a regular app (desktop/mobile) and keeps working without a network on the
last known rates.

## Stack

- [Vite 6](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript 5
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox) — manifest, service worker, offline cache
- [Zustand](https://zustand.docs.pmnd.rs/) + `persist` — client state (amount, selected currencies)
- [TanStack Query](https://tanstack.com/query) + persist-client — server state (exchange rates), survives an offline reload
- CSS Modules
- Feature-sliced architecture: `src/app` (bootstrapping) + `src/features/currency-converter` (all feature logic)

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run typecheck   # tsc, type-checking only
npm run lint         # eslint
npm run build         # build + generate the service worker
npm run preview       # local preview of the production build
```

## Installing as an app

After `npm run build && npm run preview`, open `http://localhost:4173` in
Chrome/Edge — an install icon appears in the address bar. Once installed,
the app keeps working offline on the last cached exchange rates.

## Rates source

[open.er-api.com](https://www.exchangerate-api.com/docs/free) — a free,
keyless API. When the network is unavailable, approximate hardcoded rates
are used instead (see `src/features/currency-converter/api/ratesApi.ts`).
