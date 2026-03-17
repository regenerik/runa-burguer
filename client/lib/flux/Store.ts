import { AppDispatcher } from "./Dispatcher";

import arosDeCebollaImg from "../../imgs/Aros de cebolla.jpeg";
import baconImg from "../../imgs/Bacon.jpeg";
import baconDobleImg from "../../imgs/Bacon doble.jpeg";
import baconTripleImg from "../../imgs/Bacon triple.jpeg";
import berkaImg from "../../imgs/Berka.jpeg";
import bocaditosEspinacaImg from "../../imgs/Bocaditos de espinaca.jpeg";
import bocaditosPolloImg from "../../imgs/Bocaditos de pollo.jpeg";
import cheeseBurgerImg from "../../imgs/Cheese burger.jpeg";
import cheeseBurguerDobleImg from "../../imgs/Cheese burger doble.jpg";
import cheeseBurgerTripleImg from "../../imgs/Cheese burger triple.jpeg";
import crispyImg from "../../imgs/Crispy.jpeg";
import geboImg from "../../imgs/Gebo.jpeg";
import kenazImg from "../../imgs/Kenaz.jpeg";
import manazImg from "../../imgs/Manaz.jpeg";
import papasRunaImg from "../../imgs/Papas Runa.jpeg";
import picadaGeboImg from "../../imgs/Picada Gebo.jpeg";
import raidoImg from "../../imgs/Raido.jpeg";
import sowiloImg from "../../imgs/Sowilo.jpeg";
import tiwazImg from "../../imgs/Tiwaz.jpeg";
import wunjoImg from "../../imgs/Wunjo.jpeg";

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
    id: "runa-cheese-burger",
    name: "Runa cheese burger",
    description: "Pan brioche, medallón, doble cheddar milkaut , papas fritas .",
    price: 7999,
    image: cheeseBurgerImg,
    isPopular: false,
  },
  {
    id: "runa-cheese-burger-doble",
    name: "Runa cheese burger doble",
    description: "Pan brioche, doble medallón, doble cheddar milkaut, papas fritas.",
    price: 10499,
    image: cheeseBurguerDobleImg,
    isPopular: false,
  },
  {
    id: "runa-cheese-burger-triple",
    name: "Runa cheese burger triple",
    description: "Pan brioche, triple medallón, doble cheddar milkaut, papas fritas.",
    price: 12999,
    image: cheeseBurgerTripleImg,
    isPopular: false,
  },
  {
    id: "runa-bacon",
    name: "Runa Bacon",
    description: "Pan brioche, medallón, doble cheddar milkaut, bacon, papas fritas.",
    price: 12300,
    image: baconImg,
    isPopular: false,
  },
  {
    id: "runa-doble-bacon",
    name: "Runa doble Bacon",
    description: "Pan brioche, doble medallón, doble cheddar milkaut, bacon, papas fritas.",
    price: 14800,
    image: baconDobleImg,
    isPopular: false,
  },
  {
    id: "runa-triple-bacon",
    name: "Runa triple Bacon",
    description: "Pan brioche, triple medallón, doble cheddar milkaut, bacon, papas fritas.",
    price: 17300,
    image: baconTripleImg,
    isPopular: false,
  },
  {
    id: "runa-tiwaz",
    name: "Runa Tiwaz",
    description: "Pan brioche, doble medallón, provoleta, cebolla y morrón salteado, cebolla crispy, bacon, salsa bbq.",
    price: 15299,
    image: tiwazImg,
    isPopular: false,
  },
  {
    id: "runa-gebo",
    name: "Runa Gebo",
    description: "Pan brioche, medallón, doble cheddar milkaut, cebolla crispy, pepinillos, salsa mil islas, papas fritas.",
    price: 15299,
    image: geboImg,
    isPopular: false,
  },
  {
    id: "runa-kenaz",
    name: "Runa Kenaz",
    description: "Pan brioche, doble medallón, queso provolone milkaut, morrón asado, aros de cebolla, salsa bbq, papas fritas.",
    price: 16199,
    image: kenazImg,
    isPopular: false,
  },
  {
    id: "runa-raido",
    name: "Runa Raido",
    description: "Pan brioche, medallón, queso tybo, queso azul, cebolla caramelizada, rúcula, papas fritas.",
    price: 13499,
    image: raidoImg,
    isPopular: false,
  },
  {
    id: "runa-wunjo",
    name: "Runa Wunjo",
    description: "Pan brioche, medallón, doble cheaddar milkaut, lechuga, tomates cherry confitados, salsa alioli, papas fritas.",
    price: 14490,
    image: wunjoImg,
    isPopular: false,
  },
  {
    id: "runa-sowilo",
    name: "Runa Sowilo",
    description: "Pan brioche, doble medallón, doble cheddar milkaut, cebolla caramelizada, cebolla crispy, huevo a la plancha, bacon, honey mustard, papas fritas.",
    price: 17099,
    image: sowiloImg,
    isPopular: false,
  },
  {
    id: "runa-berka",
    name: "Runa Berka",
    description: "Pan brioche, medallón, doble cheddar milkaut, cebolla caramelizada, bastones de muzza, salsa bbq, papas fritas.",
    price: 16199,
    image: berkaImg,
    isPopular: false,
  },
  {
    id: "runa-manaz",
    name: "Runa Manaz",
    description: "Pan brioche, medallón con cebolla morada, provolone, lechuga, tomates cherry confitados, huevo a la plancha, papas fritas.",
    price: 15299,
    image: manazImg,
    isPopular: false,
  },
  {
    id: "runa-pollo-crispy",
    name: "Runa Pollo Crispy",
    description: "Pan brioche, medallón pollo crispy, lechuga, tomates cherry confitados, salsa mil islas, papas fritas.",
    price: 14399,
    image: crispyImg,
    isPopular: false,
  },
  {
    id: "picada-gebo-runa",
    name: "Picada Gebo Runa",
    description: "6x bastones de mozzarella, 6x aros de cebolla, 6x bocaditos de espinaca y queso, 6x.",
    price: 18000,
    image: picadaGeboImg,
    isPopular: false,
  },
  {
    id: "aros-de-cebolla-runa",
    name: "Aros de cebolla Runa",
    description: "Crujientes aros de cebolla.",
    price: 5500,
    image: arosDeCebollaImg,
    isPopular: false,
  },
  {
    id: "papas-runa",
    name: "Papas Runa",
    description: "Papas fritas en una cremosa salsa de queso cheddar, con cebolla de verdeo y panceta.",
    price: 6000,
    image: papasRunaImg,
    isPopular: false,
  },
  {
    id: "bocaditos-de-pollo-runa",
    name: "Bocaditos de pollo Runa",
    description: "Crujientes bocaditos de pollo rebozados.",
    price: 5500,
    image: bocaditosPolloImg,
    isPopular: false,
  },
  {
    id: "bocaditos-de-espinaca-runa",
    name: "Bocaditos de espinaca Runa",
    description: "Crujientes bocaditos de espinaca y queso.",
    price: 6000,
    image: bocaditosEspinacaImg,
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