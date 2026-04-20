import { useState, useEffect } from 'react';
import { useProducts } from './hooks/useProducts';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import CartSidebar from './components/CartSidebar';
import NavBar from './components/NavBar';
import './App.css';

export default function App() {
  const { products, loading } = useProducts();
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
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
      <div className="shop-header">
        <h1>leshop.com</h1>
        <NavBar />
      </div>
      <div className="content">
        <div className="main">
          <h3 className="sub-header">what can leshop.com get for you today?</h3>
          <div className="search-sticky">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="no-results">sorry, there are no any products like that currently.</p>
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
    </div>
  );
}
