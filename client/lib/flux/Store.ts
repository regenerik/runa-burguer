  import { AppDispatcher } from "./Dispatcher";

  import arosDeCebollaImg from "../../imgs/Aros de cebolla.jpeg";
  import baconImg from "../../imgs/Bacon.jpeg";
  import baconDobleImg from "../../imgs/bacon doble.jpeg";
  import baconTripleImg from "../../imgs/bacon triple.jpeg";
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
  import bastonesDeMuzzaImg from "../../imgs/Bastones de muzza.jpeg";

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
      description: "Pan brioche, medallón 120g, doble cheddar. Acompañada de papas sazonadas.",
      price: 9499,
      image: cheeseBurgerImg,
      isPopular: false,
    },
    {
      id: "runa-cheese-burger-doble",
      name: "Runa cheese burger doble",
      description: "Pan brioche, doble medallón 120g, triple cheddar. Acompañada de papas sazonadas.",
      price: 11999,
      image: cheeseBurguerDobleImg,
      isPopular: false,
    },
    {
      id: "runa-cheese-burger-triple",
      name: "Runa cheese burger triple",
      description: "Pan brioche, triple medallón 120g, cuadruple cheddar. Acompañada de papas sazonadas.",
      price: 14499,
      image: cheeseBurgerTripleImg,
      isPopular: false,
    },
    {
      id: "runa-bacon",
      name: "Runa Bacon",
      description: "Pan brioche, medallón 120g, doble cheddar, bacon crujiente. Acompañada de papas sazonadas.",
      price: 11500,
      image: baconImg,
      isPopular: false,
    },
    {
      id: "runa-doble-bacon",
      name: "Runa doble Bacon",
      description: "Pan brioche, doble medallón 120g, triple cheddar, bacon crujiente. Acompañada de papas sazonadas.",
      price: 14000,
      image: baconDobleImg,
      isPopular: false,
    },
    {
      id: "runa-triple-bacon",
      name: "Runa triple Bacon",
      description: "Pan brioche, triple medallón 120g, cuadruple cheddar, bacon crujiente. Acompañada de papas sazonadas.",
      price: 16500,
      image: baconTripleImg,
      isPopular: false,
    },
    {
      id: "runa-tiwaz",
      name: "Runa Tiwaz",
      description: "Pan brioche, doble medallón 120g, provoleta crugiente, cebolla y morrón salteado, cebolla crispy, bacon y salsa bbq. Acompañada de papas sazonadas.",
      price: 16799,
      image: tiwazImg,
      isPopular: false,
    },
    {
      id: "runa-gebo",
      name: "Runa Gebo",
      description: "Pan brioche, medallón 120g, doble cheddar, cebolla crispy, pepinillos agridulces y salsa mil islas. Acompañada de papas sazonadas.",
      price: 16799,
      image: geboImg,
      isPopular: false,
    },
    {
      id: "runa-kenaz",
      name: "Runa Kenaz",
      description: "Pan brioche, doble medallón 120g, provoleta crugiente, morrón asado, aros de cebolla y salsa bbq. Acompañada de papas sazonadas.",
      price: 17699,
      image: kenazImg,
      isPopular: false,
    },
    {
      id: "runa-raido",
      name: "Runa Raido",
      description: "Pan brioche, medallón 120g, queso tybo, queso azul, cebolla caramelizada y rúcula. Acompañada de papas sazonadas.",
      price: 14999,
      image: raidoImg,
      isPopular: false,
    },
    {
      id: "runa-wunjo",
      name: "Runa Wunjo",
      description: "Pan brioche, medallón 120g, doble cheaddar, lechuga, cherrys confitados y salsa alioli. Acompañada de papas sazonadas.",
      price: 15990,
      image: wunjoImg,
      isPopular: false,
    },
    {
      id: "runa-sowilo",
      name: "Runa Sowilo",
      description: "Pan brioche, doble medallón 120g, triple cheddar, cebolla caramelizada, cebolla crispy, huevo a la plancha, bacon crujiente y mostaza honey. Acompañada de papas sazonadas.",
      price: 18599,
      image: sowiloImg,
      isPopular: false,
    },
    {
      id: "runa-berka",
      name: "Runa Berka",
      description: "Pan brioche, medallón 120g, doble cheddar, cebolla caramelizada, bastones de muzza, salsa bbq. Acompañada de papas sazonadas.",
      price: 17699,
      image: berkaImg,
      isPopular: false,
    },
    {
      id: "runa-manaz",
      name: "Runa Manaz",
      description: "Pan brioche, medallón 120g oklahoma, provoleta crujiente, lechuga, cherrys confitados y huevo a la plancha. Acompañada de papas sazonadas.",
      price: 17800,
      image: manazImg,
      isPopular: false,
    },
    {
      id: "runa-pollo-crispy",
      name: "Runa Pollo Crispy",
      description: "Pan brioche, pollo crispy, lechuga, cherrys confitados y salsa mil islas. Acompañada de papas sazonadas.",
      price: 15899,
      image: crispyImg,
      isPopular: false,
    },
    {
      id: "picada-runa",
      name: "Picada Runa",
      description: "Nuggets de pollo x6, Aros de cebolla x6, Bocaditos de espinaca y queso x6, Bastones de muzzarella x6 y Doble porción de papas sazonadas.",
      price: 18000,
      image: picadaGeboImg,
      isPopular: false,
    },
    {
      id: "bastones-de-muzza-runa",
      name: "Bastones de Muzzarella Runa",
      description: "Crujientes bastones de muzzarella x6.",
      price: 6000,
      image: bastonesDeMuzzaImg,
      isPopular: false,
    },
    {
      id: "aros-de-cebolla-runa",
      name: "Aros de cebolla Runa",
      description: "Crujientes aros de cebolla x6.",
      price: 5500,
      image: arosDeCebollaImg,
      isPopular: false,
    },
    {
      id: "papas-runa",
      name: "Papas Runa",
      description: "Papas fritas en una cremosa salsa de queso cheddar, con cebolla de verdeo y panceta.(para compartir).",
      price: 12000,
      image: papasRunaImg,
      isPopular: false,
    },
    {
      id: "bocaditos-de-pollo-runa",
      name: "Nuggets de pollo Runa",
      description: "Crujientes nuggets de pollo x6.",
      price: 5500,
      image: bocaditosPolloImg,
      isPopular: false,
    },
    {
      id: "bocaditos-de-espinaca-runa",
      name: "Bocaditos de espinaca Runa",
      description: "Crujientes bocaditos de espinaca y queso x6.",
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