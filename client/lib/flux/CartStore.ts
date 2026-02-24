import { AppDispatcher } from "./Dispatcher";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

class CartStore {
  private items: CartItem[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    AppDispatcher.register(this.handleAction.bind(this));
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private handleAction(action: any) {
    switch (action.type) {
      case "ADD_BURGER_TO_CART":
        this.addItem(action.payload);
        this.emitChange();
        break;
      case "CLEAR_CART":
        this.items = [];
        this.emitChange();
        break;
      case "DECREASE_QUANTITY":
        this.decreaseItemQuantity(action.payload);
        this.emitChange();
        break;
      case "REMOVE_ITEM":
        this.removeItemById(action.payload);
        this.emitChange();
        break;
    }
  }

  private addItem(burger: any) {
    const existing = this.items.find((i) => i.id === burger.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ ...burger, quantity: 1 });
    }
  }

  private decreaseItemQuantity(id: string) {
    const existing = this.items.find((i) => i.id === id);
    if (existing) {
      existing.quantity -= 1;
      if (existing.quantity <= 0) {
        this.removeItemById(id);
      }
    }
  }

  private removeItemById(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
  }

  private emitChange() {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const cartStore = new CartStore();
