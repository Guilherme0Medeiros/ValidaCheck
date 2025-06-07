"use client"
import { useCart } from "@/context/CartContext"
import { useState } from "react"
import { Card, CardBody, Button } from "@nextui-org/react"
import { CheckCircle, Package, ArrowLeft, Sparkles, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function SucessoPage() {
  const { cartItems, removeFromCart } = useCart()
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false)

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  function finalizarPedido() {
    cartItems.forEach((item) => removeFromCart(item.id))
    setPedidoFinalizado(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-violet-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button
                isIconOnly
                variant="flat"
                className="bg-white/80 backdrop-blur-sm hover:bg-emerald-50 border border-emerald-200/50"
              >
                <ArrowLeft className="w-5 h-5 text-emerald-600" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  {pedidoFinalizado ? "Pedido Confirmado!" : "Detalhes da Compra"}
                </h1>
                <p className="text-slate-600">
                  {pedidoFinalizado ? "Compra realizada com sucesso" : "Veja seu carrinho e finalize a compra"}
                </p>
              </div>
            </div>
          </div>

          {pedidoFinalizado ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-2xl">
              <CardBody className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                  Compra Finalizada!
                </h2>
                <p className="text-slate-600 text-lg mb-8">
                  Seu pedido foi processado e você receberá um email de confirmação em breve.
                </p>
                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-emerald-200/50">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold">
                    <Sparkles className="w-5 h-5" />
                    <span>Obrigado por escolher nossa loja!</span>
                  </div>
                </div>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold px-8 py-3 text-lg">
                    <ShoppingBag className="w-0 h-0 mr-2" />
                    Voltar a Pagina Inicial
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <>
              {cartItems.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl">
                  <CardBody className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Seu carrinho está vazio</h2>
                    <p className="text-slate-600 mb-6">Adicione alguns produtos para continuar</p>
                    <Link href="/">
                      <Button className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold px-8 py-3">
                        Ir às Compras
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Lista de Itens */}
                  <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl">
                    <CardBody className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-violet-500" />
                        Itens do Pedido
                      </h3>
                      <div className="space-y-4">
                        {cartItems.map((item, index) => (
                          <div key={item.id}>
                            <div className="flex gap-4 items-center">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-violet-50 to-cyan-50 flex items-center justify-center flex-shrink-0">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-800 mb-1">{item.title}</h4>
                                <p className="text-sm text-slate-600">
                                  {item.quantity} × R$ {item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-lg font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                            {index < cartItems.length - 1 && <div className="border-b border-slate-200 mt-4"></div>}
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Total e Finalização */}
                  <Card className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xl">
                    <CardBody className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-6 h-6" />
                          <span className="text-2xl font-bold">Total Final:</span>
                        </div>
                        <span className="text-3xl font-bold">R$ {total.toFixed(2)}</span>
                      </div>
                      <div className="bg-white/20 rounded-xl p-4 mb-6">
                        <div className="text-white/90 text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>R$ {total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Frete:</span>
                            <span className="text-emerald-200 font-semibold">GRÁTIS</span>
                          </div>
                          <div className="border-t border-white/20 pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                              <span>Total:</span>
                              <span>R$ {total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={finalizarPedido}
                        className="w-full bg-white text-emerald-600 hover:bg-white/90 font-bold text-lg py-4"
                        size="lg"
                      >
                        <CheckCircle className="w-0 h-0 mr-5" />
                        Realizar Compra
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
