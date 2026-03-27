import { useCart } from "../context/CartContext";
import { useStock } from "../context/StockContext";
import { useNavigate } from "react-router-dom";

interface CartSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CartSidebar({ isOpen = true, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQty } = useCart();
  const { decreaseStock, increaseStock } = useStock();
  const navigate = useNavigate();

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    navigate("/cart");
    onClose?.();
  };

  const handleUpdateQty = (itemId: number, currentQty: number, newQty: number) => {
    if (newQty < 1) return; // Prevent negative or zero quantity
    
    const diff = newQty - currentQty;
    if (diff > 0) {
      // Increasing quantity
      decreaseStock(itemId, diff);
    } else {
      // Decreasing quantity
      increaseStock(itemId, Math.abs(diff));
    }
    updateQty(itemId, newQty);
  };

  const handleRemoveFromCart = (itemId: number, quantity: number) => {
    // Return stock when removing item
    increaseStock(itemId, quantity);
    removeFromCart(itemId);
  };

  if (!isOpen) return null;

  return (
    <aside className="cart-sidebar">
      <div className="cart-header">
        <h2>Your Cart</h2>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="cart-item-details">
                <h4 className="cart-item-title">{item.title}</h4>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
                <div className="cart-item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => handleUpdateQty(item.id, item.quantity, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleUpdateQty(item.id, item.quantity, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemoveFromCart(item.id, item.quantity)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total">
            <span className="total-label">Total:</span>
            <span className="total-price">${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Payment
          </button>
        </div>
      )}
    </aside>
  );
}
