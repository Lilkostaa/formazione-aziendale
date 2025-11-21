export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Caricamento...</p>
      </div>
    </div>
  )
}
