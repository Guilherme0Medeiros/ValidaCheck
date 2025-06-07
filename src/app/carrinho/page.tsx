"use client"
import { useCart } from "@/context/CartContext"
import { Card, CardBody, Button } from "@nextui-org/react"
import { ShoppingCart, Trash2, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart()

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button
                isIconOnly
                variant="flat"
                className="bg-white/80 backdrop-blur-sm hover:bg-violet-50 border border-violet-200/50"
              >
                <ArrowLeft className="w-5 h-5 text-violet-600" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                  Meu Carrinho
                </h1>
                <p className="text-slate-600">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "itens"} no carrinho
                </p>
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl">
              <CardBody className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Seu carrinho está vazio</h2>
                <p className="text-slate-600 mb-6">Que tal adicionar alguns produtos incríveis?</p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold px-8 py-3 text-lg">
                    Continuar Comprando
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-6">
              
              <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl">
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex gap-6 items-center">
                          
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-violet-50 to-cyan-50 flex items-center justify-center flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-2">{item.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                              <span className="bg-slate-100 px-2 py-1 rounded-lg">Qtd: {item.quantity}</span>
                              <span className="bg-slate-100 px-2 py-1 rounded-lg">R$ {item.price.toFixed(2)} cada</span>
                            </div>
                            <div className="text-xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>

                          
                          <Button
                            isIconOnly
                            variant="flat"
                            className="bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                        {index < cartItems.length - 1 && <div className="border-b border-slate-200 mt-4"></div>}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              
              <Card className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-xl">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6" />
                      <span className="text-xl font-bold">Total do Pedido</span>
                    </div>
                    <div className="text-3xl font-bold">R$ {total.toFixed(2)}</div>
                  </div>
                  <div className="text-white/80 text-sm mb-6">
                    Frete grátis para todo o Brasil • Parcelamento em até 12x sem juros
                  </div>
                  <div className="flex gap-4">
                    <Link href="/" className="flex-1">
                      <Button
                        variant="flat"
                        className="w-full bg-white/20 text-white border border-white/30 hover:bg-white/30 font-semibold"
                      >
                        Continuar Comprando
                      </Button>
                    </Link>
                    <Link href="/finalizado" className="flex-1">
                      <Button className="w-full bg-white text-violet-600 hover:bg-white/90 font-bold">
                        Realizar Compra
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
