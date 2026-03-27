import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api/product";
import { ProductCard } from "../components/ProductCard";
import { Header } from "../components/Header";
import { LeftSidebar } from "../components/LeftSidebar";
import CartSidebar from "../components/CartSidebar";
import { Loader } from "../components/Loader";
import { useDebounce } from "../hooks/useDebounce";
import { useStock } from "../context/StockContext";

export const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { setInitialStock } = useStock();

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setInitialStock(data);
      })
      .catch(() => setError("Error loading products"))
      .finally(() => setLoading(false));
  }, [setInitialStock]);

  const filtered = useMemo(() => {
    let data = [...products];

    if (debouncedSearch) {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (sort === "low") data.sort((a, b) => a.price - b.price);
    if (sort === "high") data.sort((a, b) => b.price - a.price);
    if (sort === "rating") data.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));

    return data;
  }, [products, debouncedSearch, sort]);

  const handleHeaderSearch = (value: string) => {
    setSearch(value);
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="home-layout">
      <Header onSearch={handleHeaderSearch} onCartClick={() => setIsCartOpen(true)} />

      {/* Modern Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="url(#paint0_linear_1_2)"/><path d="M16 34c-1.1 0-2-.9-2-2V16c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H16zm0-2h16V16H16v16zm4-2h8v-2h-8v2zm0-4h8v-2h-8v2zm0-4h8v-2h-8v2z" fill="#fff"/>
            <defs><linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="#0066ff"/><stop offset="1" stopColor="#0052cc"/></linearGradient></defs></svg>
          </div>
          <div>
            <h1 className="hero-title">Discover & Shop Modern Products</h1>
            <p className="hero-tagline">Curated selection. Fast checkout. Beautiful experience.</p>
          </div>
        </div>
      </section>

      <div className="home-container">
        <LeftSidebar
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
        />

        <main className="main-content">
          <div className="products-card-glass">
            <h2 className="products-heading modern">Products</h2>
            {loading ? (
              <Loader />
            ) : (
              <div className="products-grid">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </main>
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