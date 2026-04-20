# Shopping App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal single-page Amazon-like shopping app with a product grid, search bar, and fixed cart sidebar.

**Architecture:** All state lives in `App.jsx` and is passed via props. `useProducts` hook fetches products from json-server via Vite's `/api` proxy. Cart operations are pure `useState` updater functions.

**Tech Stack:** React 18, Vite, json-server, concurrently, plain CSS

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `shop-app/package.json` | Create | deps, npm scripts |
| `shop-app/vite.config.js` | Create | Vite + `/api` proxy |
| `shop-app/index.html` | Create | HTML entry point |
| `shop-app/db.json` | Create | 8 products for json-server |
| `shop-app/src/main.jsx` | Create | React DOM entry |
| `shop-app/src/App.jsx` | Create | all state + cart operations + root render |
| `shop-app/src/App.css` | Create | layout, spacing, positioning only |
| `shop-app/src/hooks/useProducts.js` | Create | fetch `/api/products`, return `{ products, loading }` |
| `shop-app/src/components/SearchBar.jsx` | Create | controlled search input |
| `shop-app/src/components/ProductList.jsx` | Create | maps products → ProductCard |
| `shop-app/src/components/ProductCard.jsx` | Create | card with expandable details + Add to Cart |
| `shop-app/src/components/CartSidebar.jsx` | Create | fixed sidebar, qty controls, total, clear |

---

## Task 1: Scaffold the project

**Files:**
- Create: `shop-app/` (Vite scaffold, then replace/clean)

- [ ] **Step 1: Scaffold Vite React project**

  Run from `C:/Users/lephu/Desktop/WEB DEV FINAL PROJECT`:
  ```bash
  npm create vite@latest shop-app -- --template react
  ```
  Expected: `shop-app/` directory created with Vite React template.

- [ ] **Step 2: Install base dependencies**

  ```bash
  cd shop-app && npm install
  ```
  Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Install dev dependencies**

  ```bash
  npm install --save-dev json-server concurrently
  ```
  Expected: both packages appear in `devDependencies` in `package.json`.

- [ ] **Step 4: Clean up Vite boilerplate**

  Delete files that won't be used:
  ```bash
  rm -rf src/assets src/index.css public/vite.svg
  ```

- [ ] **Step 5: Replace `package.json` scripts**

  Open `shop-app/package.json`. Replace the `"scripts"` block with:
  ```json
  "scripts": {
    "start": "concurrently \"vite\" \"json-server --watch db.json --port 3001\"",
    "build": "vite build",
    "preview": "vite preview"
  }
  ```

- [ ] **Step 6: Create `vite.config.js`**

  Replace the full content of `shop-app/vite.config.js` with:
  ```js
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  })
  ```

- [ ] **Step 7: Update `index.html` title**

  In `shop-app/index.html`, change the `<title>` tag to:
  ```html
  <title>Shop</title>
  ```
  Leave everything else as-is.

- [ ] **Step 8: Commit**

  ```bash
  git init
  git add .
  git commit -m "chore: scaffold Vite React project with json-server"
  ```

---

## Task 2: Create `db.json`

**Files:**
- Create: `shop-app/db.json`

- [ ] **Step 1: Create `db.json` with 8 products**

  Create `shop-app/db.json`:
  ```json
  {
    "products": [
      {
        "id": 1,
        "name": "Wireless Headphones",
        "price": 49.99,
        "image": "https://picsum.photos/seed/headphones/200/200",
        "details": "Bluetooth 5.0, 30-hour battery life, foldable over-ear design."
      },
      {
        "id": 2,
        "name": "Mechanical Keyboard",
        "price": 89.99,
        "image": "https://picsum.photos/seed/keyboard/200/200",
        "details": "Tenkeyless layout, Cherry MX Brown switches, USB-C."
      },
      {
        "id": 3,
        "name": "Laptop Stand",
        "price": 34.99,
        "image": "https://picsum.photos/seed/laptopstand/200/200",
        "details": "Adjustable aluminium stand, fits 11–17 inch laptops."
      },
      {
        "id": 4,
        "name": "Smartwatch",
        "price": 129.99,
        "image": "https://picsum.photos/seed/smartwatch/200/200",
        "details": "Heart rate monitor, GPS, 7-day battery, water resistant."
      },
      {
        "id": 5,
        "name": "HD Webcam",
        "price": 59.99,
        "image": "https://picsum.photos/seed/webcam/200/200",
        "details": "1080p 30fps, built-in noise-cancelling mic, plug and play."
      },
      {
        "id": 6,
        "name": "USB-C Hub",
        "price": 29.99,
        "image": "https://picsum.photos/seed/usbhub/200/200",
        "details": "7-in-1 hub: HDMI, 3× USB-A, SD card, 100W PD passthrough."
      },
      {
        "id": 7,
        "name": "Backpack",
        "price": 44.99,
        "image": "https://picsum.photos/seed/backpack/200/200",
        "details": "30L capacity, padded 15-inch laptop compartment, waterproof base."
      },
      {
        "id": 8,
        "name": "LED Desk Lamp",
        "price": 24.99,
        "image": "https://picsum.photos/seed/desklamp/200/200",
        "details": "5 colour temperatures, 10 brightness levels, USB charging port."
      }
    ]
  }
  ```

- [ ] **Step 2: Verify json-server can read it**

  ```bash
  npx json-server --watch db.json --port 3001
  ```
  Open `http://localhost:3001/products` in a browser.
  Expected: JSON array of 8 products. Stop the server with `Ctrl+C`.

- [ ] **Step 3: Commit**

  ```bash
  git add db.json
  git commit -m "feat: add product data to db.json"
  ```

---

## Task 3: `useProducts` hook

**Files:**
- Create: `shop-app/src/hooks/useProducts.js`

- [ ] **Step 1: Create the hooks directory and file**

  Create `shop-app/src/hooks/useProducts.js`:
  ```js
  import { useState, useEffect } from 'react';

  export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          setLoading(false);
        });
    }, []);

    return { products, loading };
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/hooks/useProducts.js
  git commit -m "feat: add useProducts hook"
  ```

---

## Task 4: `SearchBar` component

**Files:**
- Create: `shop-app/src/components/SearchBar.jsx`

- [ ] **Step 1: Create `SearchBar.jsx`**

  Create `shop-app/src/components/SearchBar.jsx`:
  ```jsx
  export default function SearchBar({ value, onChange }) {
    return (
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    );
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/SearchBar.jsx
  git commit -m "feat: add SearchBar component"
  ```

---

## Task 5: `ProductCard` component

**Files:**
- Create: `shop-app/src/components/ProductCard.jsx`

- [ ] **Step 1: Create `ProductCard.jsx`**

  Create `shop-app/src/components/ProductCard.jsx`:
  ```jsx
  import { useState } from 'react';

  export default function ProductCard({ product, onAddToCart }) {
    const [showDetails, setShowDetails] = useState(false);

    return (
      <div className="product-card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>${product.price.toFixed(2)}</p>
        <button onClick={() => setShowDetails(d => !d)}>
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
        {showDetails && <p className="product-details">{product.details}</p>}
        <button onClick={() => onAddToCart(product)}>Add to Cart</button>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/ProductCard.jsx
  git commit -m "feat: add ProductCard component with expandable details"
  ```

---

## Task 6: `ProductList` component

**Files:**
- Create: `shop-app/src/components/ProductList.jsx`

- [ ] **Step 1: Create `ProductList.jsx`**

  Create `shop-app/src/components/ProductList.jsx`:
  ```jsx
  import ProductCard from './ProductCard';

  export default function ProductList({ products, onAddToCart }) {
    return (
      <div className="product-grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/ProductList.jsx
  git commit -m "feat: add ProductList component"
  ```

---

## Task 7: `CartSidebar` component

**Files:**
- Create: `shop-app/src/components/CartSidebar.jsx`

- [ ] **Step 1: Create `CartSidebar.jsx`**

  Create `shop-app/src/components/CartSidebar.jsx`:
  ```jsx
  export default function CartSidebar({ cart, onIncrement, onDecrement, onClear }) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
      <aside className="cart-sidebar">
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {cart.map(item => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <div className="cart-item-controls">
                    <button onClick={() => onDecrement(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onIncrement(item.id)}>+</button>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="cart-total">Total: ${total.toFixed(2)}</p>
            <button onClick={onClear}>Clear Cart</button>
          </>
        )}
      </aside>
    );
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/CartSidebar.jsx
  git commit -m "feat: add CartSidebar component"
  ```

---

## Task 8: Wire up `App.jsx`

**Files:**
- Modify: `shop-app/src/App.jsx` (replace Vite boilerplate entirely)

- [ ] **Step 1: Replace `App.jsx`**

  Replace the entire content of `shop-app/src/App.jsx` with:
  ```jsx
  import { useState } from 'react';
  import { useProducts } from './hooks/useProducts';
  import SearchBar from './components/SearchBar';
  import ProductList from './components/ProductList';
  import CartSidebar from './components/CartSidebar';
  import './App.css';

  export default function App() {
    const { products, loading } = useProducts();
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function addToCart(product) {
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }

    function increment(id) {
      setCart(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    }

    function decrement(id) {
      setCart(prev =>
        prev
          .map(item =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter(item => item.quantity > 0)
      );
    }

    function clearCart() {
      setCart([]);
    }

    return (
      <div className="app">
        <div className="main">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ProductList products={filtered} onAddToCart={addToCart} />
          )}
        </div>
        <CartSidebar
          cart={cart}
          onIncrement={increment}
          onDecrement={decrement}
          onClear={clearCart}
        />
      </div>
    );
  }
  ```

- [ ] **Step 2: Update `main.jsx` to remove StrictMode import of deleted index.css**

  Replace the full content of `shop-app/src/main.jsx` with:
  ```jsx
  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import App from './App.jsx'

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/App.jsx src/main.jsx
  git commit -m "feat: wire up App with state, cart operations, and search filtering"
  ```

---

## Task 9: Add layout CSS

**Files:**
- Modify: `shop-app/src/App.css` (replace Vite boilerplate entirely)

- [ ] **Step 1: Replace `App.css`**

  Replace the entire content of `shop-app/src/App.css` with:
  ```css
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: sans-serif;
  }

  .app {
    display: flex;
    height: 100vh;
  }

  /* Left column */
  .main {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .main input {
    width: 100%;
    padding: 8px;
    font-size: 1rem;
  }

  /* Product grid */
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .product-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid #ccc;
  }

  .product-card img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }

  .product-details {
    font-size: 0.875rem;
    color: #555;
  }

  /* Cart sidebar */
  .cart-sidebar {
    width: 320px;
    height: 100vh;
    position: sticky;
    top: 0;
    overflow-y: auto;
    padding: 16px;
    border-left: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cart-sidebar ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cart-sidebar li {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cart-item-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cart-total {
    font-weight: bold;
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/App.css
  git commit -m "feat: add minimal layout CSS"
  ```

---

## Task 10: Final verification

- [ ] **Step 1: Start the app**

  From `shop-app/`:
  ```bash
  npm start
  ```
  Expected: two processes start — Vite on `http://localhost:5173` and json-server on `http://localhost:3001`.

- [ ] **Step 2: Check product list loads**

  Open `http://localhost:5173`.
  Expected: 8 product cards visible in a grid.

- [ ] **Step 3: Check search**

  Type `key` in the search bar.
  Expected: only "Mechanical Keyboard" is visible.

- [ ] **Step 4: Check Add to Cart**

  Click "Add to Cart" on two different products.
  Expected: both appear in the right sidebar with `quantity: 1`.

- [ ] **Step 5: Check cart controls**

  Click `+` on one item — quantity becomes 2. Click `-` back to 1. Click `-` again — item disappears.
  Expected: total updates correctly after each action.

- [ ] **Step 6: Check expandable details**

  Click "Show details" on any card.
  Expected: details text appears below the price. Button label changes to "Hide details". Clicking again collapses it.

- [ ] **Step 7: Check Clear Cart**

  Add items, then click "Clear Cart".
  Expected: sidebar shows "Your cart is empty."

- [ ] **Step 8: Final commit**

  ```bash
  git add .
  git commit -m "chore: final verification complete"
  ```

---

## Setup Instructions (for reference)

```bash
# From the project root (WEB DEV FINAL PROJECT/)
npm create vite@latest shop-app -- --template react
cd shop-app
npm install
npm install --save-dev json-server concurrently

# Then implement all tasks above, then:
npm start
# App: http://localhost:5173
# API: http://localhost:3001/products
```
