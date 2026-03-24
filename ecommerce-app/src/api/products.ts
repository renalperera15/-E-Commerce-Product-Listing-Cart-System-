import { fetchProducts as fetchProductsFromAssets } from "../assets/products";

export const fetchProducts = async () => {
  return await fetchProductsFromAssets();
};
