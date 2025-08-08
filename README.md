## E‑commerce Frontend (React + Redux)

A production‑ready Product Card and Cart experience implemented on top of a Create‑React‑App storefront. It focuses on real‑world concerns: variants, unified multi‑currency, accessibility, responsive layout, and polished UX.

### Live Demo
- Netlify: [ecommerec-frontend.netlify.app](https://ecommerec-frontend.netlify.app/)

### Tech Stack
- React 18, Redux, React Router
- Bootstrap 5 utilities
- react-hot-toast (lightweight notifications)
- Intl.NumberFormat (currency formatting)

### Features
- Responsive Product Card
  - Fixed image aspect‑ratio (prevents CLS) and lazy loading
  - Two‑line title clamp and consistent hover/focus styles
- Variants & Stock
  - Explicit variant selection required; per‑variant price/stock
  - Global “Out of Stock” handling when all variants are unavailable
- Cart & Currency
  - Quantity stepper with live total on the card
  - Currency selector (USD/EUR/GBP with inline flags)
  - Unified cart currency enforced via a guidance modal
  - Cart shows variant label, per‑item totals, aligned quantity controls
- Resilience & UX
  - Skeleton loading, null‑safe rendering, image fallbacks
  - No card‑surface navigation; only header/footer links

### Getting Started
Requirements: Node 16+ (LTS recommended)

```bash
git clone https://github.com/M-Walii/Ecommerce-Demo.git
cd Ecommerce-Demo/ecommerce
npm install
npm start      # start dev server
# build for production
npm run build
```

### Project Structure (key files)
- `src/components/ProductCard.jsx` – Card UI (variants, currency, qty, CTA)
- `src/components/Products.jsx` – List/grid + small demo augmentation to showcase states
- `src/pages/Cart.jsx` – Item list + unified‑currency order summary
- `src/components/CurrencyModal.jsx` – Currency unification modal
- `src/utils/formatPrice.js`, `src/utils/currency.js` – Formatting & conversion

### Deployment
- Netlify (recommended): drag‑and‑drop the `build/` folder or connect the repo. For SPAs, add a redirect rule so client routes resolve correctly:

  ```
  /* /index.html 200
  ```

### Branch
- Default branch: `main`

