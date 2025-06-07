import "./globals.css"
import { Providers } from "./providers"
import { Metadata } from "next"
import Navbar from "@/components/HeaderBar"

export const metadata: Metadata = {
  title: "SmartBuy",
  description: "Uma loja virtual fictícia com Next.js",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-white text-gray-900 relative">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
