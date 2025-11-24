export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Navbar Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="h-8 w-32 bg-gray-200 rounded" />
        <div className="flex gap-4">
          <div className="hidden sm:block h-8 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-10 w-64 bg-gray-200 rounded" />
          <div className="h-5 w-96 bg-gray-200 rounded" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm">
              <div className="h-14 w-14 bg-gray-200 rounded-full shrink-0" />
              <div className="space-y-2 w-full">
                <div className="h-8 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Corsi Grid Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[400px] flex flex-col shadow-sm">
                {/* Image Area */}
                <div className="h-48 bg-gray-200 w-full" />
                
                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col space-y-4">
                  <div className="h-7 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-10 w-28 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}