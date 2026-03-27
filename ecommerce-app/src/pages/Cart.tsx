import { useCart } from "../context/CartContext";
import { useStock } from "../context/StockContext";
import { useNavigate } from "react-router-dom";
import { PaymentForm } from "../components/PaymentForm";

export const Cart = () => {
  const { cart, removeFromCart, updateQty } = useCart();
  const { stock, increaseStock, decreaseStock } = useStock();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemoveFromCart = (itemId: number, quantity: number) => {
    increaseStock(itemId, quantity);
    removeFromCart(itemId);
  };

  const handleUpdateQty = (itemId: number, currentQty: number, newQty: number) => {
    // Prevent invalid quantities
    if (newQty < 1) return;
    
    // Get current stock available
    const currentStockAvailable = stock[itemId] ?? 0;
    
    console.log(`📝 handleUpdateQty ENTRY: itemId=${itemId}, currentQty=${currentQty}, newQty=${newQty}, stock=${currentStockAvailable}`);
    
    // If trying to INCREASE quantity
    if (newQty > currentQty) {
      // ⛔ ABSOLUTE BLOCKER - Check stock before anything else
      console.log(`🔍 Checking if can increase. Stock available: ${currentStockAvailable}, Current Qty: ${currentQty}, New Qty: ${newQty}`);
      
      if (currentStockAvailable <= 0) {
        console.error(`❌ BLOCKED AT ENTRY: Cannot increase! Stock is ${currentStockAvailable} for product ${itemId}`);
        return; // DO NOT PROCEED
      }
      
      const quantityIncrease = newQty - currentQty;
      
      // SECOND CHECK: Cannot increase by more than available
      if (currentStockAvailable < quantityIncrease) {
        const canAdd = currentStockAvailable;
        console.error(`❌ BLOCKED: Cannot increase by ${quantityIncrease}. Only ${canAdd} items available`);
        return; // DO NOT PROCEED
      }
      
      // Only if ALL checks pass, then decrease stock and update qty
      console.log(`✅ ALLOWED: Increasing quantity by ${quantityIncrease}. Will decrease stock.`);
      decreaseStock(itemId, quantityIncrease);
      updateQty(itemId, newQty);
      console.log(`✅ Cart updated. New quantity: ${newQty}, Decreased stock by ${quantityIncrease}`);
      return; // DONE
    }
    
    // If trying to DECREASE quantity
    if (newQty < currentQty) {
      const quantityDecrease = currentQty - newQty;
      console.log(`✅ Decreasing quantity by ${quantityDecrease}`);
      increaseStock(itemId, quantityDecrease);
      updateQty(itemId, newQty);
      return; // DONE
    }
    
    // If quantity is the same, do nothing
    console.log("ℹ️ Quantity unchanged, no action taken");
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page-container">
        <div className="empty-cart-page">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button className="back-to-shopping-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-container">
        {/* Cart Items Summary */}
        <div className="cart-page-content">
          <h1>Your Shopping Cart</h1>

          <div className="cart-items-list">
            {cart.map((item) => {
              const currentStockAvailable = stock[item.id] ?? 0;
              const canIncreaseQty = currentStockAvailable > 0;
              
              return (
                <div key={item.id} className="cart-page-item">
                  <div className="cart-page-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="cart-page-item-details">
                    <h3>{item.title}</h3>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>
                      Stock Available: {currentStockAvailable}
                    </p>
                    {!canIncreaseQty && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginBottom: '0.5rem' }}>
                        ⚠️ Out of stock - Cannot add more
                      </p>
                    )}

                    <div className="cart-page-qty-control">
                      <button
                        onClick={() =>
                          handleUpdateQty(item.id, item.quantity, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          if (!canIncreaseQty) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`🚫 BLOCKED at click handler level. Stock: ${currentStockAvailable}`);
                            return;
                          }
                          console.log(`✅ + button clicked. Stock: ${currentStockAvailable}`);
                          handleUpdateQty(item.id, item.quantity, item.quantity + 1);
                        }}
                        disabled={!canIncreaseQty}
                        title={!canIncreaseQty ? `❌ No more stock available (Stock: ${currentStockAvailable})` : "Increase quantity"}
                        style={!canIncreaseQty ? { pointerEvents: 'none', cursor: 'not-allowed' } : {}}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-page-item-total">
                    <p className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="remove-item-btn"
                      onClick={() => handleRemoveFromCart(item.id, item.quantity)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form Section */}
        <div className="payment-form-section">
          <PaymentForm total={total} />
        </div>
      </div>
    </div>
  );
};