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
                  <button onClick={() => onDecrement(item.id)}>
                    {item.quantity === 1 ? '🗑️' : '-'}
                  </button>
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
