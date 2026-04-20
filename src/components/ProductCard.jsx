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
