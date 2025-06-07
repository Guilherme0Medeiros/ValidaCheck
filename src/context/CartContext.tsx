"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type CartItem = {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  
  useEffect(() => {
    const data = localStorage.getItem("cartItems")
    if (data) setCartItems(JSON.parse(data))
    setIsLoaded(true)
  }, [])

  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  function addToCart(item: Omit<CartItem, "quantity">) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function removeFromCart(id: number) {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  
  if (!isLoaded) return null

  return <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider")
  }
  return context
}
