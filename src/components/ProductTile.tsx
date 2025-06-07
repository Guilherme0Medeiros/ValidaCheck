"use client"
import Link from "next/link"
import type React from "react"

import { useCart } from "@/context/CartContext"
import { ShoppingCart, Sparkles } from "lucide-react"

interface ProductTileProps {
  id: number
  title: string
  image: string
  price: number
}

export default function ProductTile({ id, title, image, price }: ProductTileProps) {
  const { addToCart } = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({ id, title, price, image })
  }

  return (
    <Link
      href={`/produtos/${id}`}
      className="group bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200/50 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 p-6 flex flex-col items-center text-center max-w-sm overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="w-full aspect-[3/4] mb-4 relative z-10">
        {image ? (
          <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-violet-50 to-cyan-50 flex items-center justify-center">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 rounded-xl">
            <div className="text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Sem imagem</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 w-full">
        <h2 className="font-bold text-slate-800 text-lg line-clamp-2 mb-3 group-hover:text-violet-600 transition-colors">
          {title}
        </h2>

        <div className="mb-4 space-y-1">
          <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
            R$ {price.toFixed(2)}
          </div>
          <div className="text-sm text-slate-500 bg-emerald-50 px-2 py-1 rounded-full inline-block">
            6x R$ {(price / 6).toFixed(2)} sem juros
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl py-3 px-4 hover:from-violet-600 hover:to-cyan-600 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Comprar
        </button>
      </div>
    </Link>
  )
}
