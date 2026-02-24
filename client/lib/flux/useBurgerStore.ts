import { useEffect, useState } from "react";
import { burgerStore } from "./Store";

export function useBurgerStore() {
  const [burgers, setBurgers] = useState(burgerStore.getBurgers());

  useEffect(() => {
    const unsubscribe = burgerStore.subscribe(() => {
      setBurgers([...burgerStore.getBurgers()]);
    });
    return unsubscribe;
  }, []);

  return { burgers };
}
