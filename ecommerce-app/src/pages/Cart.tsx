import { useCart } from "../context/CartContext";

export const Cart = () => {
  const { cart, removeFromCart, updateQty } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map(item => (
        <div key={item.id}>
          <h4>{item.title}</h4>
          <p>${item.price}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={e => updateQty(item.id, +e.target.value)}
          />
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}

      <h3>Total: ${total}</h3>
    </div>
  );
};