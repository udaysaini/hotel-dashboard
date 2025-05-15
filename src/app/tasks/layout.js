'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  Layout, 
  BarChart, 
  Grid2X2,
  List,
  Table,
  Zap
} from 'lucide-react'

const views = [
  {
    name: 'Categories',
    path: '/tasks',
    icon: List,
    description: 'Tasks organized by status and priority'
  },
  {
    name: 'Quick',
    path: '/tasks/quick',
    icon: Zap,
    description: 'At-a-glance overview of critical tasks'
  },
  {
    name: 'Table',
    path: '/tasks/table',
    icon: Table,
    description: 'Detailed tabular view of all tasks'
  },
  {
    name: 'Analytics',
    path: '/tasks/analytics',
    icon: BarChart,
    description: 'Insights and performance metrics'
  },
  {
    name: 'Glanceable',
    path: '/tasks/glanceable',
    icon: Grid2X2,
    description: 'Quick visual overview of all tasks'
  }
]

export default function TasksLayout({ children }) {
  const pathname = usePathname()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">FourSight for Four Seasons</h1>
          <p className="text-zinc-400">Multiple views to help you manage tasks efficiently</p>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-1">
          {views.map((view) => {
            const Icon = view.icon
            const isActive = view.path === pathname || 
              (view.path === '/tasks' && pathname === '/tasks')
            
            return (
              <Link
                key={view.path}
                href={view.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors relative",
                  isActive
                    ? "text-white bg-zinc-800"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{view.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />
                )}
              </Link>
            )
          })}
        </div>
        
        {children}
      </div>
    </div>
  )
}
