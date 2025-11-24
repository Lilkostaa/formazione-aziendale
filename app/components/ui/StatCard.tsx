import { ReactNode } from 'react'
import { Card } from '../Card'

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

export function StatCard({ label, value, icon, color = 'blue' }: StatCardProps) {
  
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${colorStyles[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-500">{label}</p>
        </div>
      </div>
    </Card>
  )
}