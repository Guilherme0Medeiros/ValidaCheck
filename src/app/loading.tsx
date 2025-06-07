export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <span className="animate-spin rounded-full border-4 border-blue-400 border-t-transparent h-12 w-12" />
      <span className="ml-4 text-xl text-gray-600">Carregando...</span>
    </div>
  )
}
