import { createContext, useContext, useState, useCallback, useEffect } from "react";

type StockContextType = {
  stock: { [productId: number]: number };
  decreaseStock: (productId: number, quantity: number) => void;
  increaseStock: (productId: number, quantity: number) => void;
  setInitialStock: (products: any[]) => void;
};

const StockContext = createContext<StockContextType | null>(null);

export const StockProvider = ({ children }: { children: React.ReactNode }) => {
  const [stock, setStock] = useState<{ [productId: number]: number }>(() => {
    // Load stock from localStorage on initialization
    const stored = localStorage.getItem("productStock");
    return stored ? JSON.parse(stored) : {};
  });

  // Save stock to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("productStock", JSON.stringify(stock));
    console.log("💾 Stock saved to localStorage:", stock);
  }, [stock]);

  const setInitialStock = useCallback((products: any[]) => {
    const stockMap: { [productId: number]: number } = {};
    products.forEach(product => {
      // Only initialize stock for products that DON'T already have persisted stock
      // If stock was already set/modified, keep that. Otherwise, use API default or 10.
      stockMap[product.id] = product.stock || 10;
    });
    setStock(prev => {
      // Only set stock for products that we don't have data for yet
      const updated = { ...prev };
      Object.keys(stockMap).forEach(id => {
        const productId = parseInt(id);
        // If this product doesn't have stock data yet, initialize it
        if (!(productId in updated)) {
          updated[productId] = stockMap[productId];
        }
        // If it already has stock data, DON'T overwrite (keep the persisted/modified value)
      });
      return updated;
    });
  }, []);

  const decreaseStock = useCallback((productId: number, quantity: number) => {
    setStock(prev => {
      const newStock = {
        ...prev,
        [productId]: Math.max(0, (prev[productId] || 0) - quantity)
      };
      console.log(`📉 Stock decreased for product ${productId}. New stock: ${newStock[productId]}`);
      return newStock;
    });
  }, []);

  const increaseStock = useCallback((productId: number, quantity: number) => {
    setStock(prev => {
      const newStock = {
        ...prev,
        [productId]: (prev[productId] || 0) + quantity
      };
      console.log(`📈 Stock increased for product ${productId}. New stock: ${newStock[productId]}`);
      return newStock;
    });
  }, []);

  return (
    <StockContext.Provider value={{ stock, decreaseStock, increaseStock, setInitialStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext)!;
