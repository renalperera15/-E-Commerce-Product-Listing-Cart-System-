interface LeftSidebarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export const LeftSidebar = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
}: LeftSidebarProps) => {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Search</h3>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="sidebar-search"
        />
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Store Features</h3>
        <ul className="features-list">
          <li>
            <span className="icon">🚚</span>
            <span>Free Delivery</span>
          </li>
          <li>
            <span className="icon">🔒</span>
            <span>Secure Payment</span>
          </li>
          <li>
            <span className="icon">↩️</span>
            <span>Easy Returns</span>
          </li>
          <li>
            <span className="icon">⭐</span>
            <span>Top Rated Products</span>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Sort By</h3>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="">All Products</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rating">Best Rating</option>
        </select>
      </div>

      <div className="sidebar-section contact-section">
        <h3 className="sidebar-title">Contact Us</h3>
        <div className="contact-info">
          <p>
            <span className="contact-icon">📞</span> +94 761 868
          </p>
          <p>
            <span className="contact-icon">✉️</span> support@simplestore.com
          </p>
          <p>
            <span className="contact-icon">📍</span> Colombo, Sri Lanka
          </p>
        </div>
      </div>
    </aside>
  );
};
