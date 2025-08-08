## E‑commerce Frontend 

Live demo: [https://ecommerec-frontend.netlify.app/](https://ecommerec-frontend.netlify.app/)
Repository: https://github.com/M-Walii/Ecommerce-Demo (this mirror hosts the updated Product Card work)

### Overview
This repo contains a React (CRA) storefront enhanced with a production‑ready Product Card and cart flow. It implements variant‑aware pricing/stock, unified multi‑currency handling, responsive layout, and accessible controls, integrated into the existing project structure.

### Highlights
- Responsive Product Card (fixed aspect‑ratio media, 2‑line name clamp, consistent hover/focus)
- Explicit variant selection; per‑variant price and stock; global “Out of Stock” state
- Quantity stepper (plus/minus) with live total; single professional add‑to‑cart toast
- Currency selector (USD/EUR/GBP with inline flags) and unified cart currency enforced via modal
- Cart item list shows variant labels and per‑item totals; order summary uses the same currency
- Skeleton loading; graceful fallbacks (missing image/long names); no card-surface navigation

### Tech
React 18, Redux, React Router, Bootstrap 5, react-hot-toast, Intl.NumberFormat.

### Getting Started
Requirements: Node 16+ (LTS recommended)

```bash
npm install
npm start      # dev (client + API per scripts)
npm run build  # production build
```


### Files of Interest
- `src/components/ProductCard.jsx` – Card UI, variants, currency, quantity, CTA
- `src/components/Products.jsx` – List/grid, demo data augmentation for variant scenarios
- `src/pages/Cart.jsx` – Item list with variant labels, unified-currency summary
- `src/components/CurrencyModal.jsx` – Unified-currency guidance modal
- `src/utils/formatPrice.js`, `src/utils/currency.js` – Formatting and conversion

### Branch
Default branch: `main`

### Assessment Note (2–3 sentences)
- Layout: Responsive card grid with fixed aspect‑ratio images (prevents CLS), stacked content (name, price, variant, CTA), explicit variant gating, and unified cart currency via modal for consistency.
- Responsiveness: Grid adapts across breakpoints; touch‑friendly plus/minus quantity; long titles clamp to two lines; images lazy‑load; accessible disabled/OOS states and consistent hover/focus.

### Deployment
- Netlify (recommended): drag‑and‑drop the `build/` folder (or connect repo). Ensure SPA fallback is enabled.

## Run Locally (this repo)

Clone and start

```bash
git clone https://github.com/M-Walii/Ecommerce-Demo.git
cd Ecommerce-Demo/ecommerce
npm install
npm start
```

Build

```bash
npm run build
```
