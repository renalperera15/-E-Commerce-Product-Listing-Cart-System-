import { useCart } from "../context/CartContext";
import { useStock } from "../context/StockContext";
import { Link } from "react-router-dom";

export const ProductCard = ({ product }: any) => {
  const { addToCart } = useCart();
  const { stock, decreaseStock } = useStock();
  const currentStock = stock[product.id] ?? 0;

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

  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    addToCart(product);
    decreaseStock(product.id, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link">
        <div className="product-image">
          <img src={product.image} alt={product.title} />
        </div>
      </Link>

      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-title-link">
          <h3 className="product-title">{product.title}</h3>
        </Link>

        <p className="product-description">
          {product.description?.substring(0, 80)}
          {product.description?.length > 80 ? "..." : ""}
        </p>

        <div className="product-rating">
          <div className="stars">{renderStars(product.rating?.rate || 0)}</div>
          <span className="rating-value">
            {product.rating?.rate?.toFixed(1) || "N/A"}
          </span>
        </div>

        <div className="product-stock">
          In Stock: <span className="stock-count">{currentStock}</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`add-to-cart-btn ${isOutOfStock ? "out-of-stock" : ""}`}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};