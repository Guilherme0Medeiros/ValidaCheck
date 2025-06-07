"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge } from "@nextui-org/react"
import { Search, ShoppingCart, Menu, User, LogOut, Phone, Package, Sparkles } from "lucide-react"
import CartDrawer from "./CartDrawer"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/components/AuthProvider"

export default function HeaderBar() {
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [search, setSearch] = useState("")
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) router.push(`/busca?q=${encodeURIComponent(search)}`)
  }

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-violet-900 to-cyan-900 text-white w-full shadow-2xl">
        <div className="border-b border-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent group-hover:from-violet-200 group-hover:to-cyan-200 transition-all">
                  SmartBuy
                </span>
              </Link>

              <div className="hidden md:block">
                <p className="text-emerald-300 font-semibold flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                  <Package className="w-4 h-4" />
                  FRETE GRÁTIS em todo Brasil*
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <Link
                    href="/contato"
                    className="hover:text-violet-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Phone className="w-4 h-4" /> Fale Conosco
                  </Link>
                  <Link
                    href="/pedidos"
                    className="hover:text-cyan-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Package className="w-4 h-4" /> Meus Pedidos
                  </Link>
                </div>

                {user ? (
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Button
                        variant="light"
                        className="text-white hover:text-violet-300 font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
                        startContent={<User className="w-4 h-4" />}
                      >
                        Perfil
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User menu" className="bg-slate-800 border border-slate-700 rounded-xl">
                      <DropdownItem
                        key="profile"
                        className="text-white hover:bg-slate-700 rounded-lg"
                        startContent={<User className="w-4 h-4" />}
                      >
                        Meu Perfil
                      </DropdownItem>
                      <DropdownItem
                        key="orders"
                        className="text-white hover:bg-slate-700 rounded-lg md:hidden"
                        startContent={<Package className="w-4 h-4" />}
                      >
                        Meus Pedidos
                      </DropdownItem>
                      <DropdownItem
                        key="logout"
                        className="text-red-400 hover:bg-red-500/10 rounded-lg"
                        startContent={<LogOut className="w-4 h-4" />}
                        onClick={() => {
                          logout()
                          router.push("/")
                        }}
                      >
                        Sair
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:from-violet-600 hover:to-cyan-600 transition-all"
                    startContent={<User className="w-4 h-4" />}
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>
                )}

                <Badge
                  content={totalItems > 99 ? "99+" : totalItems}
                  color="danger"
                  isInvisible={totalItems === 0}
                  shape="circle"
                  className="bg-gradient-to-r from-red-500 to-pink-500"
                >
                  <Button
                    isIconOnly
                    variant="light"
                    className="text-white hover:text-violet-300 text-lg hover:bg-white/10 transition-all"
                    onClick={() => setCartOpen(true)}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                </Badge>

                <Button
                  isIconOnly
                  variant="light"
                  className="text-white hover:text-violet-300 md:hidden hover:bg-white/10 transition-all"
                  onClick={() => setMobileMenu(!mobileMenu)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 px-4">
          <div className="container mx-auto">
            <form onSubmit={handleSearch} className="flex justify-center">
              <div className="relative w-full max-w-2xl">
                <Input
                  type="text"
                  placeholder="Pesquisar produtos incríveis..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  startContent={<Search className="w-5 h-5 text-slate-400" />}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "w-full",
                    input: "text-slate-800 placeholder:text-slate-500 text-lg",
                    inputWrapper:
                      "bg-white/95 backdrop-blur-sm border-white/20 hover:border-violet-300 focus-within:!border-violet-400 transition-all shadow-lg rounded-2xl h-14",
                  }}
                  size="lg"
                />
              </div>
            </form>
          </div>
        </div>

      
        {mobileMenu && (
          <div className="md:hidden border-t border-white/10 bg-slate-800/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="border-t border-slate-700 pt-4 space-y-3">
                <Link
                  href="/contato"
                  className="flex items-center gap-3 p-4 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
                  onClick={() => setMobileMenu(false)}
                >
                  <Phone className="w-4 h-4" /> Fale Conosco
                </Link>
                <Link
                  href="/pedidos"
                  className="flex items-center gap-3 p-4 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
                  onClick={() => setMobileMenu(false)}
                >
                  <Package className="w-4 h-4" /> Meus Pedidos
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
