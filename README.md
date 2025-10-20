# 🎮 GameStore - Modern E-Commerce Platform

A sleek, high-performance web application for browsing and purchasing video games, inspired by modern digital storefronts.

This project is a feature-rich demonstration of a modern e-commerce storefront, built from the ground up with a focus on polished user experience, clean architecture, and exceptional performance.

---

## 📸 Screenshots

| Screen                       |                                                                     Description | File                           |
| ---------------------------- | ------------------------------------------------------------------------------: | :----------------------------- |
| Home (Epic Games Style Hero) | Immersive hero banner with auto-rotating featured games and trailer background. | `./screenshots/home.jpg.png`   |
| Product Detail Page          |                   Trailer, image gallery, system requirements and purchase CTA. | `./screenshots/detail.jpg`     |
| Browse & Filter              |                              Catalog grid with filters, sorting and pagination. | `./screenshots/browse.jpg`     |
| Login / Auth                 |                                   Branded login flow with social/guest options. | `./screenshots/login.png`      |
| Lighthouse / Performance     |                             Lighthouse report showing optimizations and scores. | `./screenshots/lighthouse.png` |

> Put the `screenshots/` folder at the project root and commit these files so the images render on GitHub.

---

## ✨ Core Features (tabular)

| Feature                 | Description                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------- |
| Dynamic Hero Section    | Auto-rotating hero inspired by Epic Games with trending games and trailer background. |
| Advanced Search         | Fuzzy search (Fuse.js) with "/" shortcut and type-ahead results.                      |
| Game Catalog            | Browse, filter, and sort a large library of games with product cards and badges.      |
| Product Details         | Rich pages with trailer, gallery, system requirements and reviews.                    |
| Cart & Checkout (Mock)  | Persistent cart, mini-preview, and a mocked checkout flow via MSW or Stripe test.     |
| Mock API                | MSW provides a realistic mock backend for development and tests.                      |
| Responsive & Accessible | Mobile-first design, keyboard accessibility, ARIA attributes, and focus management.   |
| PWA-ready (optional)    | Service worker + caching for improved offline UX (if enabled).                        |

---

## 🚀 Tech Stack (tabular)

| Category     | Technology                           |
| ------------ | ------------------------------------ |
| Framework    | React 18 + TypeScript                |
| Bundler      | Vite                                 |
| Styling      | Tailwind CSS                         |
| Routing      | React Router v6                      |
| Server State | TanStack Query (React Query)         |
| Client State | Zustand                              |
| Animations   | Framer Motion                        |
| Fuzzy Search | Fuse.js                              |
| API Mocking  | Mock Service Worker (MSW)            |
| UI           | Headless UI / shadcn (optional)      |
| Testing      | Jest, React Testing Library, Cypress |

---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/PriyanshuPilkhwal/Gamming-E-comerce.git
cd Gamming-E-comerce
```

### Install dependencies

```bash
npm install
# or
# yarn
# pnpm install
```

### Generate the MSW Service Worker

This step is required for the mock API to function locally and for tests.

```bash
npx msw init public/ --save
```

### Environment (optional)

Create a `.env` file at project root for environment overrides (example):

```env
VITE_API_BASE_URL=/api
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
```

> The project uses MSW by default; you do not need a real backend for the dev demo.

### Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the Vite-provided URL).

---

## 📦 NPM Scripts (table)

| Script                        | What it does                             |
| ----------------------------- | ---------------------------------------- |
| `npm run dev`                 | Start local dev server (Vite)            |
| `npm run build`               | Build production assets                  |
| `npm run preview`             | Preview production build locally         |
| `npm run test`                | Run unit tests (Jest + RTL)              |
| `npm run cypress`             | Open Cypress test runner                 |
| `npx msw init public/ --save` | Generate MSW service-worker in `public/` |

---

## 📈 Performance Testing

To replicate high Lighthouse scores locally:

```bash
npm run build
npm run preview
# open the preview URL in your browser and run Lighthouse in DevTools
```

Tips to improve scores included in the repo:

* Image optimization (webp, responsive `srcset`).
* Code-splitting and route-based lazy loading.
* Prefetch product pages on hover.
* Reduce third-party scripts in the header.
* Use `getStaticProps` / SSG (Next.js) or pre-rendering when applicable.

---

## 🧪 Testing

* Unit & component tests with **Jest** + **React Testing Library**. Key logic (cart, price calculations, filtering) is covered.
* E2E tests with **Cypress** for core flows (search → add to cart → checkout → order confirmation).
* MSW is used in tests to stub API responses for deterministic results.

Run:

```bash
npm run test
npm run cypress
```

---

## 🧭 Project Architecture (overview table)

| Layer            | Purpose                                                     |
| ---------------- | ----------------------------------------------------------- |
| `src/pages`      | Route entry points (React Router or Next.js pages)          |
| `src/features`   | Feature folders (product, cart, auth, checkout)             |
| `src/components` | Shared presentational components (Header, Footer, GameCard) |
| `src/hooks`      | Reusable hooks (useCart, useAuth, useSearch)                |
| `src/services`   | API clients, payment adapter, msw handlers                  |
| `src/store`      | Zustand stores for client state (cart, auth)                |
| `src/styles`     | Tailwind configuration and global styles                    |

---

## ⚠️ Known Limitations

* Payment is simulated (Stripe test keys or mocked). Do not use real API keys in the repo.
* The mock dataset is limited — seed data is included to highlight UI and filtering behavior.
* Some advanced features (recommendation engine, real-time stock) are demo-only and not production-ready.

---

## 📬 Contact

Maintainer: Priyanshu Pilkhwal

GitHub: [https://github.com/PriyanshuPilkhwal/Gamming-E-comerce](https://github.com/PriyanshuPilkhwal/Gamming-E-comerce)

---