import { AppDispatcher } from "./Dispatcher";

type Burger = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isPopular?: boolean;
};

const BURGERS: Burger[] = [
  {
    id: "kenaz",
    name: "Kenaz",
    description: "Doble smash, doble cheddar, cebolla caramelizada, salsa Runa.",
    price: 8900,
    image: "https://images.pexels.com/photos/20722029/pexels-photo-20722029.jpeg",
    isPopular: false,
  },
  {
    id: "fehu",
    name: "Fehu",
    description: "Doble smash, doble cheddar, bacon crocante, pepinillos.",
    price: 9400,
    image: "https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg",
    isPopular: true,
  },
  {
    id: "odin",
    name: "Odin",
    description: "Doble smash, cheddar, rúcula, tomate, cebolla morada, aioli.",
    price: 9200,
    image: "https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg",
    isPopular: false,
  },
  {
    id: "uruz",
    name: "Uruz",
    description: "Triple medallón smash, doble cheddar, pepinillos, salsa burger clásica, pan brioche.",
    price: 11500,
    image: "https://images.pexels.com/photos/16962427/pexels-photo-16962427.jpeg",
    isPopular: true,
  },
  {
    id: "doble-cheese",
    name: "Doble Cheese",
    description: "Doble smash, doble cheddar. Simple y contundente.",
    price: 7900,
    image: "https://images.pexels.com/photos/32177657/pexels-photo-32177657.jpeg",
    isPopular: false,
  },
  {
    id: "simple-cheese",
    name: "Simple Cheese",
    description: "Medallón smash, cheddar. La dosis perfecta.",
    price: 5900,
    image: "https://images.pexels.com/photos/20722034/pexels-photo-20722034.jpeg",
    isPopular: false,
  },
];

class BurgerStore {
  private burgers: Burger[] = BURGERS;
  private listeners: (() => void)[] = [];

  constructor() {
    AppDispatcher.register(this.handleAction.bind(this));
  }

  getBurgers() {
    return this.burgers;
  }

  private handleAction(action: any) {
    switch (action.type) {
      case "ADD_BURGER":
        this.burgers.push(action.payload);
        this.emitChange();
        break;
      // More actions as needed
    }
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

export const burgerStore = new BurgerStore();
