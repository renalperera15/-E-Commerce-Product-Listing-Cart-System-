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
          <h1>Simple Store</h1>
        </Link>
        <div className="header-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="cart-link" onClick={onCartClick}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};
