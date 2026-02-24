import { useEffect, useState } from "react";
import { cartStore } from "./CartStore";

export function useCartStore() {
  const [items, setItems] = useState(cartStore.getItems());
  const [total, setTotal] = useState(cartStore.getTotal());
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const currentItems = cartStore.getItems();
      setItems([...currentItems]);
      setTotal(cartStore.getTotal());
      setCartCount(currentItems.reduce((sum, i) => sum + i.quantity, 0));
    };

    update(); // initial
    const unsubscribe = cartStore.subscribe(update);
    return unsubscribe;
  }, []);

  return { items, total, cartCount };
}
