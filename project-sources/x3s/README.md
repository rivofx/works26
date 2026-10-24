# CobraX3S Ecommerce Store

Premium streetwear storefront built with Next.js, React, TypeScript, Tailwind CSS, shadcn-style reusable UI, Framer Motion-ready structure, and Lucide icons.

## Media structure

- `public/products` contains product photos.
- `public/banners/cobrax3s-background.mp4` is the muted looping site background.
- `public/categories` contains category thumbnails.

## Shopify-ready structure

- Product data lives in `src/data/products.ts`.
- Cart abstraction lives in `src/lib/cart.ts`.
- Inventory abstraction lives in `src/lib/inventory.ts`.
- Shopify Storefront API connection placeholder lives in `src/lib/shopify.ts`.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
