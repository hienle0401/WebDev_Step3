export default function ProductDetail({ product, onBack, onAddToCart }) {
  return (
    <div className="product-detail">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="product-detail-content">
        <img src={product.image} alt={product.name} />
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-made">Made in: <strong>{product.madeIn}</strong></p>
          <p className="product-detail-description">{product.description}</p>
          <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>

      <div className="product-reviews">
        <h3>Latest Reviews</h3>
        <ul>
          {product.reviews.map((review, i) => (
            <li key={i} className="review-item">
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                <span className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
