
// This interface is used to define the types for the props that the LeftSidebar component will receive
interface LeftSidebarProps {
  search: string; // The current search value
  onSearchChange: (value: string) => void; // Function to update search value
  sort: string; // The current sort value
  onSortChange: (value: string) => void; // Function to update sort value
}


// This is the LeftSidebar component. It shows search, features, sorting, and contact info on the left side.
export const LeftSidebar = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
}: LeftSidebarProps) => {
  // The return statement below is the JSX that will be rendered
  return (
    // The aside tag is used for side content
    <aside className="left-sidebar">
      {/* Search Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Search</h3>
        {/* Input for searching products */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)} // When user types, update search
          className="sidebar-search"
        />
      </div>

      {/* Store Features Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Store Features</h3>
        <ul className="features-list">
          {/* Each list item shows a feature with an icon */}
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

      {/* Sort By Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Sort By</h3>
        {/* Dropdown to select sorting option */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)} // When user selects, update sort
          className="sort-select"
        >
          <option value="">All Products</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rating">Best Rating</option>
        </select>
      </div>

      {/* Contact Section */}
      <div className="sidebar-section contact-section">
        <h3 className="sidebar-title">Contact Us</h3>
        <div className="contact-info">
          {/* Phone number */}
          <p>
            <span className="contact-icon">📞</span> +94 761 868
          </p>
          {/* Email address */}
          <p>
            <span className="contact-icon">✉️</span> support@simplestore.com
          </p>
          {/* Location */}
          <p>
            <span className="contact-icon">📍</span> Colombo, Sri Lanka
          </p>
        </div>
      </div>
    </aside>
  );
};
