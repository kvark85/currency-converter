# Конвертер валют

Лёгкое офлайн-первое PWA-приложение для конвертации валют. Устанавливается
как обычное приложение (desktop/mobile) и продолжает работать без сети на
последних известных курсах.

## Стек

- [Vite 6](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript 5
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox) — манифест, service worker, офлайн-кэш
- [Zustand](https://zustand.docs.pmnd.rs/) + `persist` — клиентский стейт (сумма, выбранные валюты)
- [TanStack Query](https://tanstack.com/query) + persist-client — серверный стейт (курсы валют), переживает офлайн-перезагрузку
- CSS Modules
- Архитектура feature-sliced: `src/app` (инициализация) + `src/features/currency-converter` (вся бизнес-логика фичи)

## Разработка

```bash
npm install
npm run dev
```

## Проверки

```bash
npm run typecheck   # tsc, только проверка типов
npm run lint         # eslint
npm run build         # сборка + генерация service worker
npm run preview       # локальный предпросмотр production-сборки
```

## Установка как приложение

После `npm run build && npm run preview` открой `http://localhost:4173` в
Chrome/Edge — появится иконка установки в адресной строке. После установки
приложение работает офлайн на последних закэшированных курсах валют.

## Источник курсов

[open.er-api.com](https://www.exchangerate-api.com/docs/free) — бесплатный
API без ключа. При недоступности сети используются приблизительные
захардкоженные курсы (см. `src/features/currency-converter/api/ratesApi.ts`).
