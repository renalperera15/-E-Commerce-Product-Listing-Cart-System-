import { useState } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onSearch: (value: string) => void;
  onCartClick: () => void;
}

export const Header = ({ onSearch, onCartClick }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "0.5rem" }}
          >
            <rect width="28" height="28" rx="6" fill="currentColor" />
            <path
              d="M8 10.5C8 10.2239 8.22386 10 8.5 10H19.5C19.7761 10 20 10.2239 20 10.5V20C20 21.1046 19.1046 22 18 22H10C8.89543 22 8 21.1046 8 20V10.5Z"
              fill="white"
              opacity="0.3"
            />
            <path d="M14 6V10M10 14H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <h1>Store</h1>
        </Link>
        <div className="header-search">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="cart-link" onClick={onCartClick} title="Shopping Cart">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Cart
        </button>
      </div>
    </header>
  );
};
