import arosDeCebollaImg from "@/imgs/Aros de cebolla.jpeg";
import baconImg from "@/imgs/Bacon.jpeg";
import baconDobleImg from "@/imgs/bacon doble.jpeg";
import baconTripleImg from "@/imgs/bacon triple.jpeg";
import berkaImg from "@/imgs/Berka.jpeg";
import bocaditosEspinacaImg from "@/imgs/Bocaditos de espinaca.jpeg";
import bocaditosPolloImg from "@/imgs/Bocaditos de pollo.jpeg";
import cheeseBurgerImg from "@/imgs/Cheese burger.jpeg";
import cheeseBurgerDobleImg from "@/imgs/Cheese burger doble.jpg";
import cheeseBurgerTripleImg from "@/imgs/Cheese burger triple.jpeg";
import crispyImg from "@/imgs/Crispy.jpeg";
import geboImg from "@/imgs/Gebo.jpeg";
import kenazImg from "@/imgs/Kenaz.jpeg";
import manazImg from "@/imgs/Manaz.jpeg";
import papasRunaImg from "@/imgs/Papas Runa.jpeg";
import picadaGeboImg from "@/imgs/Picada Gebo.jpeg";
import raidoImg from "@/imgs/Raido.jpeg";
import sowiloImg from "@/imgs/Sowilo.jpeg";
import tiwazImg from "@/imgs/Tiwaz.jpeg";
import wunjoImg from "@/imgs/Wunjo.jpeg";
import bastonesDeMuzzaImg from "@/imgs/Bastones de muzza.jpeg";
import fallbackImg from "@/imgs/Cheese burger.jpeg";
import type { Product, ProductOption } from "@shared/products";

const imageByKey: Record<string, string> = {
  arosDeCebolla: arosDeCebollaImg,
  bacon: baconImg,
  baconDoble: baconDobleImg,
  baconTriple: baconTripleImg,
  berka: berkaImg,
  bocaditosEspinaca: bocaditosEspinacaImg,
  bocaditosPollo: bocaditosPolloImg,
  cheeseBurger: cheeseBurgerImg,
  cheeseBurgerDoble: cheeseBurgerDobleImg,
  cheeseBurgerTriple: cheeseBurgerTripleImg,
  crispy: crispyImg,
  gebo: geboImg,
  kenaz: kenazImg,
  manaz: manazImg,
  papasRuna: papasRunaImg,
  picadaGebo: picadaGeboImg,
  raido: raidoImg,
  sowilo: sowiloImg,
  tiwaz: tiwazImg,
  wunjo: wunjoImg,
  bastonesDeMuzza: bastonesDeMuzzaImg,
};

export function productImage(product: Product | ProductOption) {
  return product.imageUrl || (product.imageKey ? imageByKey[product.imageKey] : "") || fallbackImg;
}

export { fallbackImg };
