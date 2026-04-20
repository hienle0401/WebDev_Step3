# Shopping App Design Spec
Date: 2026-04-12

## Overview

A minimal single-page Amazon-like shopping app built with React + Vite on the frontend and json-server as the backend. University final project. No styling library, no routing, no external state manager.

---

## Project Structure

```
shop-app/
├── db.json                  # json-server data (8–10 products)
├── package.json             # scripts for both vite dev + json-server
├── vite.config.js           # proxy /api → json-server on :3001
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx              # all state: cart[], searchQuery
    ├── App.css              # layout only (flexbox, spacing)
    ├── components/
    │   ├── SearchBar.jsx    # controlled input, calls onSearch
    │   ├── ProductList.jsx  # maps products → ProductCard
    │   ├── ProductCard.jsx  # name, image, price, expandable details, Add to Cart
    │   └── CartSidebar.jsx  # fixed sidebar, cart items, +/-, total, clear
    └── hooks/
        └── useProducts.js   # fetch from /api/products, returns { products, loading }
```

---

## Tech Stack

| Concern | Tool |
|---|---|
| Frontend | React 18 + Vite |
| Backend | json-server (port 3001) |
| Dev runner | concurrently (single `npm start`) |
| API proxy | Vite proxy `/api` → `localhost:3001` |
| Styling | Plain CSS (layout/spacing only) |
| State | useState in App.jsx (prop drilling) |

---

## Data Model

### `db.json`

```json
{
  "products": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "price": 49.99,
      "image": "https://picsum.photos/seed/headphones/200/200",
      "details": "Bluetooth 5.0, 30hr battery, foldable design."
    }
  ]
}
```

8 products total. Fields: `id`, `name`, `price`, `image` (picsum.photos URL), `details` (short string).

---

## State

All state lives in `App.jsx` and is passed down as props.

| State | Type | Initial |
|---|---|---|
| `cart` | `[{ id, name, price, image, quantity }]` | `[]` |
| `searchQuery` | `string` | `""` |

### Cart operations (defined in App.jsx, passed as props)

- `addToCart(product)` — if product already in cart, increment quantity; otherwise append with `quantity: 1`
- `increment(id)` — increase quantity by 1
- `decrement(id)` — decrease quantity by 1; remove item if quantity reaches 0
- `clearCart()` — reset cart to `[]`

---

## Components

### `App.jsx`
- Fetches nothing directly; uses `useProducts` hook
- Holds `cart` and `searchQuery` state
- Renders: `SearchBar`, `ProductList`, `CartSidebar`
- Filters products by `searchQuery` (case-insensitive name match) before passing to `ProductList`

### `useProducts.js` (custom hook)
- Single `useEffect` on mount, fetches `/api/products`
- Returns `{ products, loading }`
- No caching, no retry

### `SearchBar.jsx`
- Controlled `<input>` component
- Props: `value`, `onChange`

### `ProductList.jsx`
- Props: `products`
- Maps each product to a `<ProductCard>`

### `ProductCard.jsx`
- Props: `product`, `onAddToCart`
- Displays: image, name, price, "Add to Cart" button
- Local `showDetails` boolean state controls visibility of `details` text
- "Show details" / "Hide details" toggle button

### `CartSidebar.jsx`
- Props: `cart`, `onIncrement`, `onDecrement`, `onClear`
- Fixed right sidebar, `width: 320px`, `height: 100vh`, `position: sticky`, `top: 0`
- Each cart item shows: name, `[-] qty [+]`, line total (`price × quantity`)
- Footer shows grand total (sum of all line totals)
- "Clear Cart" button
- Empty state: "Your cart is empty."

---

## Layout

```
+---------------------------+----------+
|  SearchBar (full width)   |          |
+---------------------------+  Cart    |
|                           | Sidebar  |
|  ProductList (CSS grid)   | (fixed,  |
|  [Card][Card][Card]       |  right)  |
|  [Card][Card][Card]       |          |
+---------------------------+----------+
```

- `App` root: `display: flex`, `height: 100vh`
- Left column: `flex: 1`, `overflow-y: auto`, contains SearchBar + ProductList
- Right sidebar: `width: 320px`, `position: sticky`, `top: 0`, `height: 100vh`, `overflow-y: auto`
- ProductList: CSS grid, `repeat(auto-fill, minmax(200px, 1fr))`

---

## API

- json-server serves `db.json` on port 3001
- Vite proxies `/api` → `http://localhost:3001`
- Only one endpoint used: `GET /api/products`

---

## npm Scripts

```json
{
  "start": "concurrently \"vite\" \"json-server --watch db.json --port 3001\"",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## Constraints

- No UI library (MUI, Tailwind, Bootstrap, etc.)
- No routing (React Router, etc.)
- No external state manager (Redux, Zustand, etc.)
- CSS covers layout, spacing, and positioning only — no decorative design work
- No error retry, no caching, no pagination
- No authentication
