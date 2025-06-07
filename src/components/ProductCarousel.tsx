"use client";
import { useRef } from "react";
import ProductTile from "@/components/ProductTile";

type Produto = {
  id: number;
  title: string;
  image: string;
  price: number;
};

export default function ProductCarousel({ produtos }: { produtos: Produto[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector("div[data-card]");
    if (!card) return;
    const scrollAmount = (card as HTMLDivElement).offsetWidth + 24; 
    carousel.scrollBy({
      left: direction === "right" ? scrollAmount * 2 : -scrollAmount * 2,
      behavior: "smooth"
    });
  };

  return (
    <main className="p-6 w-full max-w-[1400px] mx-auto">
      <div className="relative">
        {/* Botão voltar */}
        <button
          className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border rounded-full p-2 text-gray-600 hover:bg-gray-200 transition disabled:opacity-30"
          style={{ left: "-28px" }}
          onClick={() => scroll("left")}
          aria-label="Voltar"
        >
          &#x2039;
        </button>
        {/* Botão avançar */}
        <button
          className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border rounded-full p-2 text-gray-600 hover:bg-gray-200 transition disabled:opacity-30"
          style={{ right: "-28px" }}
          onClick={() => scroll("right")}
          aria-label="Avançar"
        >
          &#x203A;
        </button>
        {/* Carrossel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar"
          tabIndex={0}
        >
          {produtos.map((produto) => (
            <div
              key={produto.id}
              data-card
              className="snap-start flex-shrink-0"
              style={{ width: "230px" }}
            >
              <ProductTile
                id={produto.id}
                title={produto.title}
                image={produto.image}
                price={produto.price}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
