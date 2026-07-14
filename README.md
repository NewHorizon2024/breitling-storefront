# Breitling Storefront

A modern e-commerce storefront built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, with the product catalog powered by **Algolia**. It features server-side rendering with streaming, a polished and accessible UI, resilient error handling, and a unit test suite.

> **Recruiter quick start:** you only need **Node.js 20.9+** and an **`.env.local`** file with three Algolia keys (see [Environment variables](#environment-variables)), then `npm install && npm run dev`.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Testing](#testing)
- [Project structure](#project-structure)
- [How data is stored](#how-data-is-stored)

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components) |
| UI | React 19, Tailwind CSS v4, lucide-react icons |
| Search / catalog | Algolia (`algoliasearch` v5) |
| Notifications | react-hot-toast |
| Testing | Jest + React Testing Library |
| Language | TypeScript |

## Features

- **Product listing** with server-side search, brand/type/price **filtering** (disjunctive facets in a single batched Algolia request), and pagination.
- **Product detail** pages with image, quantity selector, ratings, and breadcrumbs (+ `BreadcrumbList` JSON‑LD for SEO).
- **Cart** with quantity steppers, a navbar **mini-cart dropdown**, and a **mock checkout** endpoint.
- **Orders** history and order detail, keyboard-navigable.
- **Streaming + skeletons** — instant loading states via `loading.tsx` and `<Suspense>`.
- **Resilient error handling** — route-level `error.tsx` / `global-error.tsx` boundaries, a custom `not-found`, and graceful data-layer degradation.
- **Accessible** — landmarks, labelled controls, a skip link, visible focus, and screen-reader-friendly components.
- **Analytics** — a small typed, pluggable event tracker (console by default; optional HTTP endpoint).
- **Unit tests** — Jest + React Testing Library.

## Prerequisites

- **Node.js `20.9+`** (or `22+`) — required by Next.js 16.
- **npm** (the repo ships a `package-lock.json`).
- An **Algolia** account with an index of products (the app expects records with fields like `name`, `price`, `brand`, `type`, `color`, `image`, `rating`, `free_shipping`).

## Environment variables

The app reads its configuration from a **`.env.local`** file at the project root. This file is **git-ignored** (it holds your keys), so it is **not** included in the repo — **you must create it before running the app.**

An annotated template is provided at [`.env.example`](./.env.example). The quickest way:

```bash
cp .env.example .env.local
# then open .env.local and fill in your Algolia values
```

| Variable | Required | Description |
| --- | :---: | --- |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | ✅ | Your Algolia application ID. |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` | ✅ | Algolia **search-only** API key (never the admin key). |
| `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | ✅ | The Algolia index that holds the products. |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | ➖ | Fallback currency code (default: `CHF`). |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | ➖ | If set, analytics events are also POSTed here; otherwise they log to the console. |

Where to find the Algolia keys: **Algolia dashboard → Settings → API Keys**.

> **Notes**
> - `NEXT_PUBLIC_*` variables are exposed to the browser — only ever use the **search-only** key here.
> - After editing `.env.local`, **restart the dev server** for changes to take effect.
> - Without valid Algolia keys the pages that load products will show a friendly error state (the app won't crash), but the catalog will be empty.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your env file and add your Algolia keys
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)**.

To run a production build locally:

```bash
npm run build
npm run start
```

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server (hot reload) on port 3000. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build (run `build` first). |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the Jest test suite once. |
| `npm run test:watch` | Run Jest in watch mode. |

## Testing

Unit tests use **Jest** + **React Testing Library** (configured via `next/jest`).

```bash
npm test
```

Tests live in [`__tests__/`](./__tests__) and cover utilities (currency formatting, HTML-entity decoding, cart logic) and components (`StarRating`, `Breadcrumbs`, `ProductCard`).

## Project structure

```
app/
  _components/     Reusable UI (ProductCard, Filters, MiniCart, Breadcrumbs, …)
  api/checkout/    Mock checkout route handler (POST)
  products/        Listing + [id] detail (with loading & error states)
  cart/            Cart page
  checkout/        Post-checkout confirmation
  orders/          Order history + [id] detail
  layout.tsx       Root layout (announcement bar, sticky header, providers)
  page.tsx         Home / landing page
  error.tsx        Route error boundary
  global-error.tsx Root error boundary
  not-found.tsx    Custom 404
lib/
  algolia.ts       Cached, batched Algolia data access
  cart.ts          Cart & orders store (localStorage-backed)
  currency.ts      Money formatting
  analytics.ts     Typed, pluggable event tracking
  text.ts          HTML-entity decoding
__tests__/         Jest + RTL tests
```

## How data is stored

This is a front-end demo: the **cart** and **orders** are persisted in the browser's `localStorage` (they're per-browser and not synced to a server). The **checkout** endpoint (`/api/checkout`) is a **mock** — it validates the payload and returns a generated order, but does not process real payments.
