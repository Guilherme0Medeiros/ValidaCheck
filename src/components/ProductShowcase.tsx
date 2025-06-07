"use client"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { Button, Badge, Card, Tabs, Tab } from "@nextui-org/react"
import { Star, Heart, Share2, Sparkles } from "lucide-react"
import Gallery from "./Gallery"

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

interface ProductShowcaseProps {
  product: Product
}

export default function ProductShowcase({ product }: ProductShowcaseProps) {
  const { addToCart } = useCart()
  const [size, setSize] = useState("M")
  const [color, setColor] = useState("Preto")
  const [added, setAdded] = useState(false)

  const sizes = ["P", "M", "G", "GG"]
  const colors = ["Preto", "Branco", "Azul"]

  const handleAddToCart = () => {
    addToCart({ ...product })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Card className="max-w-6xl w-full rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-slate-200/50">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-8">
          <Gallery images={[product.image]} />
        </div>
        <div className="flex-1 p-8 flex flex-col gap-6">
          <div className="flex gap-4 items-center flex-wrap">
            <Badge
              color="secondary"
              variant="flat"
              className="bg-gradient-to-r from-violet-100 to-cyan-100 text-violet-700 font-semibold px-3 py-1"
            >
              {product.category}
            </Badge>
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-semibold text-yellow-700">{product.rating.rate}</span>
              <span className="text-yellow-600">({product.rating.count})</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 leading-tight">{product.title}</h1>
          <p className="text-slate-600 text-lg leading-relaxed">{product.description}</p>

          <div className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
            <span className="text-4xl font-bold">R$ {product.price.toFixed(2)}</span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <span className="font-semibold text-slate-700">Tamanho:</span>
                <div className="flex gap-2">
                  {sizes.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={size === s ? "solid" : "bordered"}
                      className={
                        size === s
                          ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold"
                          : "border-slate-300 text-slate-600 hover:border-violet-300 hover:bg-violet-50"
                      }
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-700">Cor:</span>
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <Button
                      key={c}
                      size="sm"
                      variant={color === c ? "solid" : "bordered"}
                      className={
                        color === c
                          ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold"
                          : "border-slate-300 text-slate-600 hover:border-violet-300 hover:bg-violet-50"
                      }
                      onClick={() => setColor(c)}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className={`font-bold text-lg py-6 rounded-xl transition-all duration-200 ${
              added
                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                : "bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            }`}
            onClick={handleAddToCart}
            disabled={added}
            startContent={added ? <Sparkles className="w-5 h-5" /> : null}
          >
            {added ? "Adicionado com sucesso!" : "Adicionar ao Carrinho"}
          </Button>

          <div className="flex gap-3">
            <Button
              isIconOnly
              variant="flat"
              className="bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Heart size={20} />
            </Button>
            <Button
              isIconOnly
              variant="flat"
              className="bg-slate-100 hover:bg-blue-50 hover:text-blue-500 transition-colors"
            >
              <Share2 size={20} />
            </Button>
          </div>

          <Tabs
            className="mt-6"
            aria-label="Mais detalhes"
            classNames={{
              tabList: "bg-slate-100 rounded-xl p-1",
              cursor: "bg-gradient-to-r from-violet-500 to-cyan-500",
              tab: "text-slate-600 data-[selected=true]:text-white font-semibold",
            }}
          >
            <Tab key="specs" title="Detalhes">
              <div className="bg-slate-50 rounded-xl p-4 mt-4">
                <ul className="space-y-2 text-slate-700">
                  <li className="flex justify-between">
                    <span>Categoria:</span> <span className="font-semibold">{product.category}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Marca:</span> <span className="font-semibold">Loja Moderna</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tamanho:</span> <span className="font-semibold">{size}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Cor:</span> <span className="font-semibold">{color}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Garantia:</span> <span className="font-semibold">3 meses</span>
                  </li>
                </ul>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </Card>
  )
}
