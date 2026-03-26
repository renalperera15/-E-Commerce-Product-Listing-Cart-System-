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

      <div className="home-container">
        <LeftSidebar
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
        />

        <main className="main-content">
          <h2 className="products-heading">Products</h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="products-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
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