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
