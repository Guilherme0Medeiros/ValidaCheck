import { Home, BookOpen, FileText, Clock, Plus, User } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">
                ValidaCheck
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <button className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
                <Home className="w-4 h-4 mr-2" />
                Início
              </button>
              <button className="flex items-center px-4 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <BookOpen className="w-4 h-4 mr-2" />
                Atividades
              </button>
              <button className="flex items-center px-4 py-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-full transition-colors">
                <FileText className="w-4 h-4 mr-2" />
                Relatórios
              </button>
            </nav>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-700" />
              </div>
              <span className="text-gray-900 font-medium">João</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Olá, João!</h1>
          <p className="text-xl text-gray-600">O que deseja fazer hoje?</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Solicitar Nova Atividade */}
          <div className="bg-white rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="relative">
                  <FileText className="w-8 h-8 text-white" />
                  <Plus className="w-4 h-4 text-white absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Solicitar nova atividade
              </h3>
              <p className="text-gray-600 mb-4">
                Pedir aprovação de nova atividade
              </p>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition-colors">
                Nova Solicitação
              </button>
            </div>
          </div>

          {/* Atividades em Andamento */}
          <div className="bg-white rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Atividades em andamento
              </h3>
              <p className="text-gray-600 mb-4">Ver atividades em progresso</p>
              <button className="w-full border border-blue-400 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-full transition-colors">
                Ver Atividades
              </button>
            </div>
          </div>

          {/* Relatórios */}
          <div className="bg-white rounded-xl border border-yellow-200 hover:border-yellow-300 hover:shadow-lg transition-all cursor-pointer p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Relatórios
              </h3>
              <p className="text-gray-600 mb-4">Gerenciar relatórios</p>
              <button className="w-full border border-yellow-500 text-yellow-600 hover:bg-yellow-50 py-2 px-4 rounded-full transition-colors">
                Ver Relatórios
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-200">
            <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-gray-600">Atividades Pendentes</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-200">
            <div className="text-2xl font-bold text-green-600 mb-2">8</div>
            <div className="text-gray-600">Atividades Concluídas</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600 mb-2">3</div>
            <div className="text-gray-600">Relatórios Gerados</div>
          </div>
        </div>
      </main>
    </div>
  );
}
