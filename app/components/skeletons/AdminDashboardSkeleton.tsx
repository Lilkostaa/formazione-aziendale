import { Card } from "@/app/components/Card"

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-96 bg-gray-200 rounded" />
      </div>

      {/* KPI Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-4">
              {/* Icon placeholder */}
              <div className="h-12 w-12 bg-gray-200 rounded-full shrink-0" />
              {/* Text placeholder */}
              <div className="space-y-2 w-full">
                <div className="h-6 w-12 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Links Section Skeleton */}
      <div>
        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-32 p-6 border border-gray-200">
              <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4" />
              <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}