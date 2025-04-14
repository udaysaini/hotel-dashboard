'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, AlertCircle, MoreVertical, Plus } from "lucide-react"

// Import constants and helper functions from main page
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS, isDueSoon, formatDate } from '../utils'

export default function KanbanDashboardPage() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks)
  }, [])

  // Group by status only (without priority subgroups)
  const groupedTasks = {
    pending: tasks.filter(task => task.status === 'pending'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    completed: tasks.filter(task => task.status === 'completed')
  }

  return (
    <div className="container mx-auto px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Kanban Board View
        </h1>
        
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div 
            key={status} 
            className="bg-zinc-900 rounded-xl border border-zinc-800 w-80 flex-shrink-0"
          >
            <div className="p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 rounded-t-xl">
              <h2 className="font-semibold text-zinc-100 flex items-center justify-between">
                {STATUS_LABELS[status]}
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
                  {statusTasks.length}
                </Badge>
              </h2>
            </div>
            
            <div className="p-3 max-h-[calc(100vh-220px)] overflow-y-auto">
              <div className="space-y-3">
                {statusTasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <Card className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium leading-tight text-white">
                              {task.title}
                            </h3>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          
                          {task.description && (
                            <p className="text-zinc-400 text-xs line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center">
                              <div className="w-5 h-5 rounded-full bg-zinc-700 text-white flex items-center justify-center text-xs mr-2">
                                {task.assigned_to?.charAt(0) || '?'}
                              </div>
                              <span className="text-xs text-zinc-400">{task.assigned_to}</span>
                            </div>
                            
                            {task.due_date && (
                              <div className={`flex items-center gap-1 text-xs ${isDueSoon(task.due_date) ? 'text-red-400' : 'text-zinc-500'}`}>
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(task.due_date)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5">
                            <Badge className={`text-xs py-0 px-2 ${PRIORITY_COLORS[task.priority]}`}>
                              {task.priority}
                            </Badge>
                            {task.location && (
                              <Badge variant="outline" className="text-xs py-0 px-2 text-zinc-400 border-zinc-700">
                                {task.location}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                <div className="h-3"></div> {/* Spacing at bottom of column */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
