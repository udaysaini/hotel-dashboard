'use client'

import { useTaskContext } from '@/contexts/TaskContext'

export default function SearchQueryIndicator() {
  const { filteredTasks, searchQuery, clearFiltered } = useTaskContext()

  if (!searchQuery) return null

  return (
    <div className="flex items-center">
      <div className="bg-zinc-800 px-3 py-2 rounded-md text-zinc-300 flex-1">
        <span className="text-sm font-medium">Filter applied: &quot;{searchQuery}&quot;</span>
        <span className="ml-2 text-xs text-zinc-400">({filteredTasks?.length || 0} results)</span>
      </div>
      <button 
        className="ml-2 text-sm text-zinc-400 hover:text-white"
        onClick={clearFiltered}
      >
        Clear
      </button>
    </div>
  )
}
