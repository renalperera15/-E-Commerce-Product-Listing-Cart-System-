import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStock } from "../context/StockContext";
import { Header } from "../components/Header";
import { Loader } from "../components/Loader";
import CartSidebar from "../components/CartSidebar";

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const { addToCart } = useCart();
  const { stock, decreaseStock, setInitialStock } = useStock();

  useEffect(() => {
    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        // Initialize stock for this product if not already set
        if (!stock[data.id]) {
          setInitialStock([data]);
          console.log(`📦 Initialized stock for product ${data.id}`);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, stock, setInitialStock]);

  const currentStock = product ? (stock[product.id] ?? 0) : 0;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (quantity < 1 || isOutOfStock) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
      decreaseStock(product.id, 1);
    }
    
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
    setQuantity(1);
  };

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1 || newQty > currentStock) return;
    setQuantity(newQty);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < Math.floor(rating) ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <Header onSearch={() => {}} onCartClick={() => setIsCartOpen(true)} />
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <Header onSearch={() => {}} onCartClick={() => setIsCartOpen(true)} />
        <div className="product-details-container">
          <p className="error-message">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Header onSearch={() => {}} onCartClick={() => setIsCartOpen(true)} />

      <div className="product-details-container">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Products
        </button>

        <div className="product-details-content">
          {/* Product Image */}
          <div className="product-details-image-section">
            <div className="product-details-image">
              <img src={product.image} alt={product.title} />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-details-info">
            {/* Category */}
            <span className="product-category">{product.category}</span>

            {/* Title */}
            <h1 className="product-details-title">{product.title}</h1>

            {/* Rating */}
            <div className="product-details-rating">
              <div className="stars">
                {renderStars(product.rating?.rate || 0)}
              </div>
              <span className="rating-text">
                {product.rating?.rate?.toFixed(1) || "N/A"} out of 5
              </span>
              <span className="review-count">({product.rating?.count || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="product-details-price">
              <span className="price-label">Price:</span>
              <span className="price-value">${product.price.toFixed(2)}</span>
            </div>

            {/* Stock Status */}
            <div className="product-details-stock">
              <span className={`stock-badge ${isOutOfStock ? "out-of-stock" : "in-stock"}`}>
                {isOutOfStock ? `Out of Stock` : `In Stock (${currentStock} available)`}
              </span>
            </div>

            {/* Description */}
            <div className="product-details-description">
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="product-details-quantity">
              <label>Quantity:</label>
              <div className="quantity-selector">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={currentStock}
                  disabled={isOutOfStock}
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= currentStock || isOutOfStock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="product-details-actions">
              <button
                className={`add-to-cart-btn-details ${isOutOfStock ? "out-of-stock" : ""}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              {showAddedMessage && (
                <div className="added-message">
                  ✓ Added {quantity} item(s) to cart!
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="product-details-features">
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <div>
                  <p className="feature-title">Free Shipping</p>
                  <p className="feature-desc">On orders over $50</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">↩️</span>
                <div>
                  <p className="feature-title">Easy Returns</p>
                  <p className="feature-desc">30-day return policy</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <p className="feature-title">Guaranteed Safe</p>
                  <p className="feature-desc">SSL encrypted checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal Overlay */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CartSidebar isOpen={true} onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};