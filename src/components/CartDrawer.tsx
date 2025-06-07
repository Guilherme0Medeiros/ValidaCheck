"use client"
import { useCart } from "@/context/CartContext"
import type React from "react"

import { useAuth } from "@/components/AuthProvider"
import { useEffect, useState } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { cartItems, addToCart, removeFromCart } = useCart()
  const { user } = useAuth()
  const [error, setError] = useState("")

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const stopBubble = (e: React.MouseEvent) => e.stopPropagation()

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose()
    }
    document.addEventListener("keydown", esc)
    return () => document.removeEventListener("keydown", esc)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const clickOut = () => {
      if (isOpen) onClose()
    }
    if (isOpen) document.addEventListener("click", clickOut)
    return () => document.removeEventListener("click", clickOut)
  }, [isOpen, onClose])

  const handleDecrease = (id: number) => {
    const item = cartItems.find((i) => i.id === id)
    if (item && item.quantity === 1) removeFromCart(id)
    else if (item) {
      addToCart({ ...item })
      setTimeout(() => removeFromCart(id), 0)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-slate-50 to-white shadow-2xl z-50 flex flex-col transition-transform border-l border-slate-200/50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      onClick={stopBubble}
    >
      <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-violet-500 to-cyan-500">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Seu Carrinho</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 font-bold text-2xl w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center">
              <span className="text-3xl">🛒</span>
            </div>
            <p className="text-slate-500 text-lg">Seu carrinho está vazio</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <span>R$ {item.price.toFixed(2)}</span>
                    <span>×</span>
                    <span>{item.quantity}</span>
                  </div>
                  <div className="text-lg font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-violet-600 border border-slate-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-all"
                    >
                      −
                    </button>
                    <span className="font-semibold text-slate-700 min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => addToCart({ ...item })}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-violet-600 border border-slate-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-red-500 text-xl ml-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-all"
                  title="Remover"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="p-6 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-slate-800">Total:</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
              R$ {total.toFixed(2)}
            </span>
          </div>
          {error && (
            <div className="text-red-500 mb-3 text-center text-sm bg-red-50 p-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <button
            onClick={() => {
              if (!user) {
                setError("Faça login para finalizar a compra!")
                return
              }
              setError("")
              onClose()
              window.location.href = "/finalizado"
            }}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white py-4 rounded-xl hover:from-violet-600 hover:to-cyan-600 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Realizar compra
          </button>
        </div>
      )}
    </div>
  )
}
