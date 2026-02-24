import { AppDispatcher } from "./Dispatcher";

export const BurgerActions = {
  addBurgerToCart(burger: any) {
    AppDispatcher.dispatch({
      type: "ADD_BURGER_TO_CART",
      payload: burger,
    });
  },
  
  clearCart() {
    AppDispatcher.dispatch({
      type: "CLEAR_CART",
    });
  },

  decreaseQuantity(id: string) {
    AppDispatcher.dispatch({
      type: "DECREASE_QUANTITY",
      payload: id,
    });
  },

  removeItem(id: string) {
    AppDispatcher.dispatch({
      type: "REMOVE_ITEM",
      payload: id,
    });
  }
};
