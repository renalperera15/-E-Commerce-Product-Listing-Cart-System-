export const fetchProducts = async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  
  // Add mock stock data since the API doesn't provide it
  return data.map((product: any) => ({
    ...product,
    stock: Math.floor(Math.random() * 15) + 1 // Random stock between 1-15
  }));
};