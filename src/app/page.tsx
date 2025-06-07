import ProductCarousel from "@/components/ProductCarousel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartBuy",
  description: "Uma loja virtual fictícia com Next.js",
};

type Produto = {
  id: number;
  title: string;
  image: string;
  price: number;
};

async function getProdutos(): Promise<Produto[]> {
  const res = await fetch("https://fakestoreapi.com/products");
  return res.json();
}

export default async function HomePage() {
  const produtos = await getProdutos();

  return (
    <ProductCarousel produtos={produtos} />
  );
}
