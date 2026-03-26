import { createContext, useContext, useState, useCallback } from "react";

type StockContextType = {
  stock: { [productId: number]: number };
  decreaseStock: (productId: number, quantity: number) => void;
  increaseStock: (productId: number, quantity: number) => void;
  setInitialStock: (products: any[]) => void;
};

const StockContext = createContext<StockContextType | null>(null);

export const StockProvider = ({ children }: { children: React.ReactNode }) => {
  const [stock, setStock] = useState<{ [productId: number]: number }>({});

  const setInitialStock = useCallback((products: any[]) => {
    const stockMap: { [productId: number]: number } = {};
    products.forEach(product => {
      stockMap[product.id] = product.stock || 10;
    });
    setStock(stockMap);
  }, []);

  const decreaseStock = useCallback((productId: number, quantity: number) => {
    setStock(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - quantity)
    }));
  }, []);

  const increaseStock = useCallback((productId: number, quantity: number) => {
    setStock(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity
    }));
  }, []);

  return (
    <StockContext.Provider value={{ stock, decreaseStock, increaseStock, setInitialStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext)!;
