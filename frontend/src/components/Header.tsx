import { BookOpen, Home, FileText, User } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900">ValidaCheck</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
              <Home className="w-4 h-4 mr-2" />
              Início
            </button>
            <button className="flex items-center px-4 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
              <BookOpen className="w-4 h-4 mr-2" />
              Atividades
            </button>
            <button className="flex items-center px-4 py-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-md transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Relatórios
            </button>
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-700" />
            </div>
            <span className="text-gray-900 font-medium">Joao</span>
          </div>
        </div>
      </div>
    </header>
  )
}
